import { UserProperty } from './user.model';

export type AgentType =
  | 'وكيل عقاري'
  | 'وكيل عقاري مستقل'
  | 'وكيل تجاري'
  | 'شركة عقارية';

export interface AgentSocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface AgentStats {
  total: number;
  sold: number;
  rented: number;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  email: string;
  image: string;
  bannerImage?: string;
  propertiesCount: number;
  location: string;
  phone?: string;
  age?: number;
  gender?: 'ذكر' | 'أنثى';
  address?: string;
  agencyName?: string;
  agencyAddress?: string;
  agencyDescription?: string;
  agentLicense?: string;
  taxNumber?: string;
  stats?: AgentStats;
  socialLinks?: AgentSocialLinks;
  properties?: UserProperty[];
}

export interface AgentTypeStats {
  realEstateCompanyCount: number; // شركة عقارية: 50
  independentAgentCount: number; // وكيل عقاري مستقل: 50
  exclusiveAgentCount: number; // وكيل حصري: 30
  commercialAgentCount: number; // وكيل تجاري: 20
  total: number; // 150
}
