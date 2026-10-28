export interface Orders {
  message: string
  data: Order[]
}

export interface Order {
  selected: boolean
  id: number
  order_number: string
  property: Property
  owner: number
  client: Client
  status: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: number
  name: string
  location: string
  price: string
  agent: any
}

export interface Client {
  id: number
  name: string
  email: string
  phone: any
}

export type OrderStatus = 'pending' | 'cancelled' | 'completed' | 'negotiating';