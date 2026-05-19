export interface Seller {
  id: string
  store_name: string
  store_description: string | null
  whatsapp_number: string | null
  created_at: string
}

export interface Product {
  id: string
  seller_id: string
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  created_at: string
}

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  seller_id: string
  customer_name: string
  whatsapp_number: string
  delivery_note: string | null
  items: OrderItem[]
  total: number
  status: 'pending' | 'fulfilled' | 'cancelled'
  created_at: string
}

export interface CartItem extends OrderItem {}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
