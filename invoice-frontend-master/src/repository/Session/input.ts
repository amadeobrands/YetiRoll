export interface SessionCreateInput {
    email: string;
    password: string;
}

export interface SessionRefreshInput {
    refreshToken: string
}
