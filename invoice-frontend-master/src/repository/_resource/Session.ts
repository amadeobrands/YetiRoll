export interface SessionResource {
    generated_at: Date;
    token_type: string;
    access_token_expires_in: number;
    access_token: string;
    refresh_token: string;
}
