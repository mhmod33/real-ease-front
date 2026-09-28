export interface AuthResponse {
    message?: string;
    token?: string;
    access_token?: string;
    user?: {
        id?: string | number;
        name?: string;
        email?: string;
        email_verified_at?: string | null;
        role?: string;
        type?: string;
        agency?: string;
        age?: number;
        gender?: string;
        location?: string;
        description?: string;
        phone?: string;
        whatsapp_phone?: string;
        personal_website?: string;
        social_media?: {
            linkedin?: string;
            instagram?: string;
            facebook?: string;
            twitter?: string;
        };
        created_at?: string;
        updated_at?: string;
        avatar?: string | null;
        cover_photo?: string | null;
    };
    Message?: string;
    UserID?: number;
    UserName?: string;
    UserRole?: string;
    UserPhoto?: string | null;
    Token?: string;
}
