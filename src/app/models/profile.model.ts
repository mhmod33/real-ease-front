import { Property } from "./property.model"

export interface Root {
  message: string
  data: ProfileModel
}

export interface ProfileModel {
  id: number
  name: string
  email: string
  phone: string
  whatsapp_phone: string
  personal_website: string
  role: string
  avatar: any
  social_media: SocialMedia
  location: string
  description: string
  type: string
  age: number
  properties: Property[]
}

export interface SocialMedia {
  facebook: string
  instagram: string
  twitter: string
  linkedin?: string
}
