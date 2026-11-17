import type { Request } from 'express';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionResponseDto, SubscriptionListResponseDto, SubscriptionUpcomingResponseDto, DeleteResponseDto } from './dto/subscription.dto';
export declare class SubscriptionsController {
    private service;
    constructor(service: SubscriptionsService);
    findAll(req: Request, page?: number, limit?: number): Promise<SubscriptionListResponseDto>;
    findUpcoming(req: Request, days?: number): Promise<SubscriptionUpcomingResponseDto>;
    findOne(req: Request, id: string): Promise<SubscriptionResponseDto>;
    create(req: Request, dto: CreateSubscriptionDto): Promise<SubscriptionResponseDto>;
    update(req: Request, id: string, dto: UpdateSubscriptionDto): Promise<SubscriptionResponseDto>;
    remove(req: Request, id: string): Promise<DeleteResponseDto>;
}
