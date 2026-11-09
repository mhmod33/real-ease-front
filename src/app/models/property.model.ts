
export interface Properties {
  message: string
  data: Property[]
  pagination: Pagination
}

export interface Property {
  id: number
  name: string
  price: number
  features: string[]
  description: string
  location: string
  latitude: any
  longitude: any
  type: string
  contract_type: string
  status: 'available' | 'sold' | 'pending' | 'rented';
  rate: number;
  images: string[]
  image: string
  user: User
  created_at: string;
  isSaved?: boolean
  isLiked?: boolean
}

export interface User {
  id: number
  name: string
  agency?: string
  email: string
  phone: any
  role: string
  avatar: any
  social_media?: SocialMedia
  location?: string
  description?: string
  type: string
  age: number
}

export interface SocialMedia {
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
}

export interface Pagination {
  total: number
  per_page: number
  current_page: number
}
