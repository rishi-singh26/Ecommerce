export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface User {
    _id: string;
    avatar: Avatar;
    username: string;
    email: string;
    role: string;
    loginType: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Avatar {
    url: string;
    localPath: string;
    _id: string;
}