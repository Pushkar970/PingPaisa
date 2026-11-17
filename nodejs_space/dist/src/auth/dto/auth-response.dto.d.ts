export declare class AuthUserDto {
    id: string;
    email: string;
    name: string;
}
export declare class AuthResponseDto {
    token: string;
    user: AuthUserDto;
}
export declare class MeUserDto {
    id: string;
    email: string;
    name: string;
    tier: string;
    createdAt: string;
}
export declare class MeResponseDto {
    user: MeUserDto;
}
