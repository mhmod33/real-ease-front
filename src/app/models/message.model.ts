export interface Root {
  message: string
  data: Message[]
}

export interface Message {
  id: number
  property: Property
  sender: Sender
  receiver: Receiver
  message: string
  read_at: string
}

export interface MessageHistoryEntry {
  id: number
  created_at: string
  updated_at: string
  message: string
  property_id: number
  receiver_id: number
  read_at: string | null
  sender_id: number
}

export interface MessageHistoryResponse {
  message: string
  data: MessageHistoryEntry[]
}

export interface SentMessageResponse {
  message?: string
  data?: MessageHistoryEntry
}

export interface Property {
  id: number
  name: string
  location: string
  price: string
  agent: any
}

export interface Sender {
  id: number
  name: string
  email: string
  phone: string
}

export interface Receiver {
  id: number
  name: string
  email: string
  phone: any
}
