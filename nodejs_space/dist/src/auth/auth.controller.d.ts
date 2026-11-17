import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, MeResponseDto } from './dto/auth-response.dto';
export declare class AuthController {
    private authService;
    private readonly logger;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    me(req: Request): Promise<MeResponseDto>;
    googleAuth(redirectUri: string, res: Response): Promise<void>;
    googleCallback(code: string, state: string, res: Response): Promise<void>;
}
