'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import {
  UploadCloud,
  MessageSquare,
  Zap,
  ArrowRight,
  CheckCircle2,
  Store,
  Sparkles,
} from 'lucide-react'

interface MockMessage {
  role: 'user' | 'assistant'
  content: string
  product?: {
    name: string
    price: string
    image: string
    emoji: string
  }
}

// Mock interactive chat messages for the Landing Page Phone Simulation
const CHAT_SIMULATIONS: Record<'sourdough' | 'matcha' | 'glutenfree', [MockMessage, MockMessage]> = {
  sourdough: [
    { role: 'user', content: 'Do you have fresh sourdough today? 🥖' },
    {
      role: 'assistant',
      content: 'Yes, we do! Our Artisan Sourdough is freshly baked. It features slow-fermented organic flour and a crispy crust.',
      product: {
        name: 'Artisan Sourdough',
        price: '$7.50',
        image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=200',
        emoji: '🥖'
      }
    }
  ],
  matcha: [
    { role: 'user', content: 'How much is the matcha latte? 🍵' },
    {
      role: 'assistant',
      content: 'Our Organic Matcha Latte is $5.25. It uses ceremonial-grade matcha whisked with oat milk. Highly recommended!',
      product: {
        name: 'Matcha Latte',
        price: '$5.25',
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=200',
        emoji: '🍵'
      }
    }
  ],
  glutenfree: [
    { role: 'user', content: 'Do you have anything gluten-free? 🧁' },
    {
      role: 'assistant',
      content: 'We sure do! Try our popular GF Chocolate Raspberry Brownie ($4.50)—it is decadent and completely dairy-free.',
      product: {
        name: 'GF Chocolate Brownie',
        price: '$4.50',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=200',
        emoji: '🍫'
      }
    }
  ]
}

export default function LandingPage() {
  const [activeSim, setActiveSim] = useState<'sourdough' | 'matcha' | 'glutenfree'>('sourdough')
  const [messages, setMessages] = useState<MockMessage[]>([
    { role: 'assistant', content: 'Hi! Welcome to Sweet Joy Bakery. How can I assist you today? 🍰' }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const triggerSimulation = (key: 'sourdough' | 'matcha' | 'glutenfree') => {
    if (isTyping) return
    setActiveSim(key)
    
    // Clear previous simulated messages and show user asking
    setMessages([
      { role: 'assistant', content: 'Hi! Welcome to Sweet Joy Bakery. How can I assist you today? 🍰' },
      { role: 'user', content: CHAT_SIMULATIONS[key][0].content }
    ])
    
    // Start typing indicator
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, CHAT_SIMULATIONS[key][1]])
    }, 1200)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background Patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />
      <div className="absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-whatsapp/5 blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[-10%] h-[40vw] w-[40vw] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none -z-10 animate-float" />

      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Column: Heading and CTAs */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left max-w-3xl mx-auto lg:mx-0 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-whatsapp/10 text-whatsapp border border-whatsapp/25 uppercase tracking-wider glass-pill">
                  <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse" /> AI-Powered WhatsApp Storefront
                </div>
                
                <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.08] tracking-tight">
                  Turn your WhatsApp hustle into a{' '}
                  <span className="text-whatsapp bg-gradient-to-r from-whatsapp via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                    premium storefront
                  </span>{' '}
                  in minutes
                </h1>
                
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Upload products easily, let our integrated AI sales assistant answer buyer questions 24/7, and receive structured, ready-to-deliver order slips directly on WhatsApp.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/auth/signup" className="w-full sm:w-auto">
                    <Button className="w-full bg-whatsapp hover:bg-whatsapp-hover text-white font-bold py-7 px-8 rounded-2xl text-base shadow-xl hover:shadow-whatsapp/20 transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-95">
                      Create My Store <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/store/demo" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="w-full border-border bg-card/65 backdrop-blur-sm hover:bg-muted font-bold py-7 px-8 rounded-2xl text-base shadow-md transition-all duration-300 transform active:scale-95"
                    >
                      See a Demo Store
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-6 text-xs font-medium text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-whatsapp" /> No Credit Card Required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-whatsapp" /> Setup in 3 Minutes
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Phone Simulator */}
              <div className="lg:col-span-5 flex flex-col items-center animate-fade-in [animation-delay:0.2s]">
                {/* Simulation Mode Selectors */}
                <div className="flex gap-2 mb-4 bg-muted/60 p-1 rounded-2xl border border-border/80 glass-pill max-w-full overflow-x-auto">
                  <button 
                    onClick={() => triggerSimulation('sourdough')}
                    className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 ${
                      activeSim === 'sourdough' ? 'bg-whatsapp text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    🥖 Sourdough bread
                  </button>
                  <button 
                    onClick={() => triggerSimulation('matcha')}
                    className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 ${
                      activeSim === 'matcha' ? 'bg-whatsapp text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    🍵 Matcha Latte
                  </button>
                  <button 
                    onClick={() => triggerSimulation('glutenfree')}
                    className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 ${
                      activeSim === 'glutenfree' ? 'bg-whatsapp text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    🍫 Gluten-Free
                  </button>
                </div>

                {/* Phone mockup container */}
                <div className="relative w-full max-w-[340px] aspect-[9/18.5] bg-slate-900 rounded-[2.8rem] border-[8px] border-slate-800 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(37,211,102,0.15)] transition-all duration-500 flex flex-col overflow-hidden hover:scale-[1.02] cursor-pointer">
                  {/* Speaker and Camera notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-800 rounded-b-xl flex items-center justify-center gap-1.5 z-20">
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-600"></div>
                    <div className="h-1 w-12 rounded-full bg-zinc-700"></div>
                  </div>

                  {/* App Frame Content */}
                  <div className="flex-grow flex flex-col bg-slate-50 rounded-[2.2rem] overflow-hidden border border-zinc-200 mt-2 p-3 text-slate-800 text-xs">
                    {/* Header */}
                    <div className="bg-whatsapp text-white p-3.5 rounded-2xl flex items-center gap-2 mb-3 shadow-md">
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shadow-inner">🥐</div>
                      <div>
                        <div className="font-extrabold text-[11px] leading-tight">Sweet Joy Bakery</div>
                        <div className="text-[8px] opacity-90 flex items-center gap-1 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                          AI Sales Agent Active
                        </div>
                      </div>
                    </div>

                    {/* Messages Mock */}
                    <div className="flex-grow space-y-3 overflow-y-auto pr-1 flex flex-col text-[11px]">
                      {messages.map((msg, index) => (
                        <div 
                          key={index}
                          className={`max-w-[85%] rounded-2xl p-2.5 shadow-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-whatsapp text-white self-end rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 self-start rounded-bl-none'
                          }`}
                        >
                          <div>{msg.content}</div>
                          {msg.product && (
                            <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200/60 flex gap-2 items-center text-left">
                              <img 
                                src={msg.product.image} 
                                alt={msg.product.name} 
                                className="h-10 w-10 object-cover rounded-lg border border-slate-200"
                              />
                              <div className="flex-grow min-w-0">
                                <div className="font-bold text-[10px] text-slate-900 truncate">{msg.product.emoji} {msg.product.name}</div>
                                <div className="text-whatsapp font-bold text-[9px]">{msg.product.price}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Simulated typing indicator */}
                      {isTyping && (
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-2.5 max-w-[30%] self-start shadow-sm flex items-center justify-center gap-1">
                          <span className="h-1.5 w-1.5 bg-whatsapp rounded-full animate-bounce"></span>
                          <span className="h-1.5 w-1.5 bg-whatsapp rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="h-1.5 w-1.5 bg-whatsapp rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      )}
                    </div>

                    {/* Footer Mock */}
                    <div className="mt-3 p-1 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-inner">
                      <div className="flex-grow bg-slate-100 py-2 px-2.5 rounded-lg text-[9px] text-slate-400 font-medium">
                        {activeSim === 'sourdough' ? 'Inquire about sourdough...' : activeSim === 'matcha' ? 'Inquire about matcha...' : 'Inquire about GF brownie...'}
                      </div>
                      <div className="h-7 w-7 rounded-lg bg-whatsapp flex items-center justify-center text-white text-[10px] shadow-md shadow-whatsapp/20">💬</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-24 bg-muted/20 border-y border-border/40 relative">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            
            <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground">
                How SellerMate AI Works
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Everything you need to sell online in minutes. No credit cards, no payment gateways, no complexity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full">
                <div className="h-14 w-14 rounded-2xl bg-whatsapp/10 text-whatsapp flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-foreground mb-3">1. Upload Products</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  Quickly add your items with name, description, stock quantity, price, and image. Edit details seamlessly in a clean dashboard.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full">
                <div className="h-14 w-14 rounded-2xl bg-whatsapp/10 text-whatsapp flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-foreground mb-3">2. AI Handles Questions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  Our Gemini sales agent reads your product listings. It answers customer queries, checks sizes, details ingredients, and makes upsells automatically.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full">
                <div className="h-14 w-14 rounded-2xl bg-whatsapp/10 text-whatsapp flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-foreground mb-3">3. Structured Orders</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  Buyers complete their cart on your page. You receive formatted text slips directly in WhatsApp and see invoices update in your admin panel.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/60 backdrop-blur-md py-12">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-whatsapp flex items-center justify-center shadow-md">
              <Store className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-base text-foreground">
              SellerMate <span className="text-whatsapp">AI</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} SellerMate AI. Crafted with ❤️ for local entrepreneurs.
          </p>
        </div>
      </footer>
    </div>
  )
}
