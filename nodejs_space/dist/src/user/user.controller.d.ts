import type { Request } from 'express';
import { UserService } from './user.service';
import { PlanResponseDto, UpgradeResponseDto, SetMonthlyLimitDto, MonthlyLimitResponseDto } from './dto/user.dto';
export declare class UserController {
    private service;
    constructor(service: UserService);
    getPlan(req: Request): Promise<PlanResponseDto>;
    setMonthlyLimit(req: Request, dto: SetMonthlyLimitDto): Promise<MonthlyLimitResponseDto>;
    upgrade(req: Request): Promise<UpgradeResponseDto>;
}
