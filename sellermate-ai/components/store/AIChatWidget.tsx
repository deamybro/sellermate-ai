import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { ChatMessage, Product } from '@/types'
import { cn } from '@/lib/utils'

interface AIChatWidgetProps {
  products: Product[]
  storeName: string
}

export default function AIChatWidget({ products, storeName }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi! 👋 I'm here to help you find the perfect product. What are you looking for today?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, loading])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          products,
          storeName,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error('AI chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting right now. Can you try again shortly?",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="mb-4 w-[350px] max-w-[calc(100vw-2rem)] h-[480px] bg-card rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-whatsapp text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm leading-tight">Store Assistant</h3>
                <span className="text-[10px] text-whatsapp-light font-medium">Ask me anything about our store!</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 rounded-full h-8 w-8"
              title="Close Chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 bg-muted/20 space-y-3 flex flex-col">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'max-w-[80%] rounded-2xl p-3 text-sm leading-normal shadow-sm',
                  msg.role === 'user'
                    ? 'bg-whatsapp text-white self-end rounded-br-none'
                    : 'bg-white text-foreground border border-border self-start rounded-bl-none'
                )}
              >
                {msg.content}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="bg-white border border-border rounded-2xl rounded-bl-none p-3 text-sm max-w-[80%] self-start shadow-sm flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce"></span>
                <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about price, stock, specs..."
              className="flex-grow rounded-xl bg-muted/40 border-border text-sm"
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || loading}
              className="bg-whatsapp hover:bg-whatsapp-hover text-white rounded-xl h-9 w-9 shrink-0 flex items-center justify-center"
              title="Send Message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'h-14 w-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 scale-100 hover:scale-105 active:scale-95',
          isOpen ? 'bg-customDark hover:bg-customDark/90' : 'bg-whatsapp hover:bg-whatsapp-hover'
        )}
        title={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}
