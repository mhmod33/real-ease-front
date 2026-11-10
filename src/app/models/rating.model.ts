export interface Ratings {
  data: Rating
}

export interface Rating {
  id: number
  property_id: number
  user_id: number
  rate: string
  comment: string
  created_at: string
  updated_at: string
  user: User
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: any
  avatar: any
  cover_photo: any
  google_id: any
  role: string
  type: string
  age: number
  gender: string
  agency: string
  location: string
  description: string
  phone: string
  whatsapp_phone: string
  personal_website: string
  social_media: SocialMedia
  created_at: string
  updated_at: string
}

export interface SocialMedia {
  facebook: string
  instagram: string
  twitter: string
}
