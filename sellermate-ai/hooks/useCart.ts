import { useReducer, useEffect, useState } from 'react'
import { CartItem } from '@/types'

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: CartItem[] }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'INIT_CART':
      return action.payload
    case 'ADD_ITEM': {
      const existingItem = state.find(item => item.product_id === action.payload.product_id)
      if (existingItem) {
        return state.map(item =>
          item.product_id === action.payload.product_id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      }
      return [...state, action.payload]
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.product_id !== action.payload)
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.product_id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

export function useCart() {
  const [cartItems, dispatch] = useReducer(cartReducer, [])
  const [isMounted, setIsMounted] = useState(false)

  // Initialize from localStorage after mounting
  useEffect(() => {
    const savedCart = localStorage.getItem('sellermate_cart')
    if (savedCart) {
      try {
        dispatch({ type: 'INIT_CART', payload: JSON.parse(savedCart) })
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
      }
    }
    setIsMounted(true)
  }, [])

  // Persist to localStorage whenever cartItems changes, but only after mount
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sellermate_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isMounted])

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return {
    cartItems,
    cartTotal,
    cartCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isMounted
  }
}
