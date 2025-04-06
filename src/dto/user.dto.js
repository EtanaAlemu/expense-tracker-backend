// User Request DTOs
class CreateUserRequest {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
    }
}

class UpdateUserRequest {
    constructor(data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
    }
}

class LoginRequest {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
    }
}

// User Response DTOs
class UserResponse {
    constructor(user) {
        this.id = user._id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}

class LoginResponse {
    constructor(user, token) {
        this.user = new UserResponse(user);
        this.token = token;
    }
}

module.exports = {
    CreateUserRequest,
    UpdateUserRequest,
    LoginRequest,
    UserResponse,
    LoginResponse
}; 