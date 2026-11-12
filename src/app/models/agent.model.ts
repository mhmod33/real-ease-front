export interface AgentsResponse {
  message: string
  data: Agent[]
}
export interface AgentDetailsResponse {
  message: string
  data: AgentDetails
}
export interface Agent {
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
  properties:Properties[]
  stats:stats[]
}

export interface AgentDetails {
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
  properties:Properties[]
  stats:stats[]
}

export interface SocialMedia {
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
}
export interface AgentTypeStats {
  realEstateCompanyCount: number
  independentAgentCount: number
  exclusiveAgentCount: number
  commercialAgentCount: number
  total: number
}
export interface AgentType {
  id: number
  name: string
}

export interface AgentStatsResponse {
  message: string,
  data:stats
}
export interface stats  {
  total_agents: number,
  real_estate_agents: number,
  independent_real_estate_agents: number,
  real_estate_company: number,
  commercial_agents: number
}
export interface Properties {
  id:number
  name:string
  price:number
  location:string
  type:'للبيع' | 'للإيجار'
  imag:string
}
