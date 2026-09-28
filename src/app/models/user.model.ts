export type UserType =
  | 'وكيل عقاري مستقل'
  | 'وكيل عقاري'
  | 'شركة عقارية'
  | 'وكيل تجاري';

export interface UserProperty {
  id: string;
  title: string;
  price: string;
  location: string;
  type: 'للبيع' | 'للإيجار';
  image: string;
}

export interface SocialMedia {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}
export interface Users {
  message: string
  data: Data[]
  pagination: Pagination
}

export interface Data {
  id: number
  name: string
  email: string
  email_verified_at: any
  avatar: any
  cover_photo?: string
  google_id?: string
  role: string
  type: string
  age?: number
  location?: string
  gender?: string
  agency: string
  description?: string
  phone?: string
  whatsapp_phone?: string
  personal_website?: string
  social_media?: SocialMedia
  properties?: UserProperty[]
  created_at: string
  updated_at: string
}
export interface User {
  id: number
  name: string
  email: string
  email_verified_at: any
  avatar: any
  cover_photo?: string
  google_id?: string
  role: string
  type: string
  age?: number
  gender?: string
  agency: string
  location?: string
  description?: string
  phone?: string
  whatsapp_phone?: string
  personal_website?: string
  social_media?: SocialMedia
  properties?: UserProperty[]
  created_at: string
  updated_at: string
}
export interface Pagination {
  total: number
  per_page: number
  last_page: number
  current_page: number
}
