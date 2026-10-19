export interface Root {
  message: string
  data: Message[]
}

export interface Message {
  id: number
  property: Property
  sender_id: SenderId
  receiver_id: ReceiverId
  message: string
  read_at: string
}

export interface Property {
  id: number
  name: string
  location: string
  price: string
  agent: any
}

export interface SenderId {
  id: number
  name: string
  email: string
  phone: string
}

export interface ReceiverId {
  id: number
  name: string
  email: string
  phone: any
}
