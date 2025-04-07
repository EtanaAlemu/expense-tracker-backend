import { IUser } from '../types';

// User Request DTOs
export interface CreateUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// User Response DTOs
export class UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: IUser) {
        this.id = user._id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}

export class LoginResponse {
    user: UserResponse;
    token: string;

    constructor(user: IUser, token: string) {
        this.user = new UserResponse(user);
        this.token = token;
    }
} 