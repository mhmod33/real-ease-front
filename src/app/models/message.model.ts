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
