"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PushNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
const http2 = __importStar(require("http2"));
const jwt = __importStar(require("jsonwebtoken"));
let PushNotificationService = PushNotificationService_1 = class PushNotificationService {
    prisma;
    logger = new common_1.Logger(PushNotificationService_1.name);
    fcm;
    apnsJwt;
    constructor(prisma) {
        this.prisma = prisma;
    }
    onModuleInit() {
        const raw = process.env.FCM_SERVICE_ACCOUNT_B64;
        if (!raw) {
            this.logger.warn('FCM_SERVICE_ACCOUNT_B64 not set — Android push disabled');
            return;
        }
        try {
            const serviceAccount = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
            const app = (0, app_1.getApps)().length ? (0, app_1.getApp)() : (0, app_1.initializeApp)({ credential: (0, app_1.cert)(serviceAccount) });
            this.fcm = (0, messaging_1.getMessaging)(app);
            this.logger.log('FCM initialized successfully');
        }
        catch (e) {
            this.logger.error(`FCM init failed: ${e?.message}`);
        }
    }
    apnsToken() {
        const { APNS_KEY_ID, APNS_TEAM_ID, APNS_PRIVATE_KEY_B64 } = process.env;
        if (!APNS_KEY_ID || !APNS_TEAM_ID || !APNS_PRIVATE_KEY_B64)
            return undefined;
        const now = Math.floor(Date.now() / 1000);
        if (this.apnsJwt && now - this.apnsJwt.issuedAt < 50 * 60)
            return this.apnsJwt.token;
        const key = Buffer.from(APNS_PRIVATE_KEY_B64, 'base64').toString('utf8');
        const token = jwt.sign({ iss: APNS_TEAM_ID, iat: now }, key, {
            algorithm: 'ES256',
            header: { alg: 'ES256', kid: APNS_KEY_ID },
        });
        this.apnsJwt = { token, issuedAt: now };
        return token;
    }
    async sendAndroid(token, title, body, data = {}) {
        if (!this.fcm)
            return;
        try {
            await this.fcm.send({ token, notification: { title, body }, data, android: { priority: 'high' } });
        }
        catch (e) {
            if (e?.code === 'messaging/registration-token-not-registered' ||
                e?.code === 'messaging/invalid-registration-token') {
                await this.prisma.pushToken.deleteMany({ where: { token } });
            }
            else {
                this.logger.error(`FCM send failed: ${e?.message ?? e}`);
            }
        }
    }
    async sendIos(deviceToken, title, body, data = {}) {
        const bearer = this.apnsToken();
        const topic = process.env.IOS_BUNDLE_ID;
        if (!bearer || !topic) {
            this.logger.warn('APNS_* / IOS_BUNDLE_ID not set — iOS push disabled');
            return;
        }
        await new Promise((resolve) => {
            const client = http2.connect('https://api.push.apple.com');
            const req = client.request({
                ':method': 'POST',
                ':path': `/3/device/${deviceToken}`,
                authorization: `bearer ${bearer}`,
                'apns-topic': topic,
                'apns-push-type': 'alert',
                'apns-priority': '10',
            });
            let status = 0;
            let responseBody = '';
            req.on('response', (headers) => { status = Number(headers[':status']); });
            req.on('data', (chunk) => { responseBody += chunk; });
            req.on('end', async () => {
                if (status === 410 || responseBody.includes('Unregistered') || responseBody.includes('BadDeviceToken')) {
                    await this.prisma.pushToken.deleteMany({ where: { token: deviceToken } });
                }
                else if (status >= 400) {
                    this.logger.error(`APNs ${status}: ${responseBody}`);
                }
                client.close();
                resolve();
            });
            req.on('error', (e) => { this.logger.error(`APNs request failed: ${e.message}`); client.close(); resolve(); });
            req.end(JSON.stringify({ aps: { alert: { title, body }, sound: 'default' }, ...data }));
        });
    }
    async sendToUser(userId, title, body, data = {}) {
        const tokens = await this.prisma.pushToken.findMany({ where: { userId } });
        if (tokens.length === 0) {
            this.logger.log(`No push tokens for user ${userId}`);
            return;
        }
        const promises = tokens.map((t) => {
            if (t.deviceType === 'android')
                return this.sendAndroid(t.token, title, body, data);
            if (t.deviceType === 'ios')
                return this.sendIos(t.token, title, body, data);
            return Promise.resolve();
        });
        await Promise.all(promises);
        this.logger.log(`Sent push notification to ${tokens.length} device(s) for user ${userId}`);
    }
};
exports.PushNotificationService = PushNotificationService;
exports.PushNotificationService = PushNotificationService = PushNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PushNotificationService);
//# sourceMappingURL=push-notification.service.js.map