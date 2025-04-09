export interface LoginRequest {
    username: string;
    passwordHash: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    passwordHash: string;
}

export interface PasswordUpdateRequest {
    userId: number;
    oldPasswordHash: string;
    newPasswordHash: string;
}
