export interface AuthResponse {
    Message: string;
    UserID: number;
    UserName: string;
    UserRole: string;
    UserPhoto: string | null;
    Token: string;
}
