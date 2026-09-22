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

export interface UserSocialLinks {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface User {
  id: string;
  name: string;
  type: UserType;
  email: string;
  image: string;
  bannerImage?: string;
  propertiesCount: number;
  location: string;
  phone?: string;
  role:string;
  whatsapp?: string;
  website?: string;
  age?: number;
  gender?: 'ذكر' | 'أنثى';
  address?: string;
  agencyName?: string;
  agencyAddress?: string;
  description?: string;
  experienceYears?: number;
  socialLinks?: UserSocialLinks;
  properties?: UserProperty[];
}
