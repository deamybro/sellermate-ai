import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ChatMessage, Product } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { messages, products, storeName } = await req.json() as {
      messages: ChatMessage[]
      products: Product[]
      storeName: string
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Using local rule-based fallback.')
      return NextResponse.json({ reply: generateFallbackReply(messages, products, storeName) })
    }

    // 1. Create product catalog text for Gemini
    const catalogText = products
      .map(
        (p) =>
          `- Product: ${p.name}\n  Description: ${p.description || 'N/A'}\n  Price: $${p.price.toFixed(2)}\n  Stock Qty: ${p.stock}`
      )
      .join('\n')

    // 2. Define System Instructions
    const systemPrompt = `You are a helpful and polite WhatsApp-style sales assistant for the online store named "${storeName}".
Here is our catalog of available products:
${catalogText}

Instructions for your behavior:
1. Answer customer questions politely, helpfully, and matching a casual chat app style (friendly, concise).
2. If they ask about a product, describe its benefits and specify its price and stock.
3. Suggest related items in our catalog to cross-sell or upsell when appropriate.
4. If they want to purchase, tell them they can close the chat, click the "Add to Cart" button next to the product and then click "Checkout" in their cart.
5. Do NOT fabricate products, prices, or information not in the catalog. If we don't have it, say so politely.
6. Refuse to discuss anything unrelated to the store or its products. Keep the conversion strictly business-related.`

    // 3. Format message history for Gemini SDK (needs 'user' and 'model' roles)
    // Filter out system prompts or odd messages, only take user/assistant
    const chatHistory = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const latestMessage = messages[messages.length - 1].content

    // 4. Initialize Gemini with system instructions
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    })

    // 5. Send message
    const chat = model.startChat({
      history: chatHistory,
    })

    const result = await chat.sendMessage(latestMessage)
    const replyText = result.response.text()

    return NextResponse.json({ reply: replyText })
  } catch (error) {
    console.error('API Chat Error:', error)
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble understanding right now. Please try again in a bit!" },
      { status: 200 } // Return 200 with fallback text to avoid crashing frontend experience
    )
  }
}

// Fallback rule-based matching when no API Key is available
function generateFallbackReply(messages: ChatMessage[], products: Product[], storeName: string): string {
  const latestMessage = messages[messages.length - 1].content.toLowerCase()

  // Find matches
  const matches = products.filter(
    (p) =>
      latestMessage.includes(p.name.toLowerCase()) ||
      (p.description && latestMessage.includes(p.description.toLowerCase()))
  )

  if (matches.length > 0) {
    const list = matches
      .map((p) => `- ${p.name} ($${p.price.toFixed(2)}) - ${p.stock} available.`)
      .join('\n')
    return `Yes! We have that available at ${storeName}:\n${list}\n\nTo buy, just close this chat and click "Add to Cart"!`
  }

  if (latestMessage.includes('hello') || latestMessage.includes('hi') || latestMessage.includes('hey')) {
    return `Hello! Welcome to ${storeName}. What products are you looking for today? 🛍️`
  }

  if (latestMessage.includes('price') || latestMessage.includes('cost') || latestMessage.includes('how much')) {
    const list = products.map((p) => `- ${p.name}: $${p.price.toFixed(2)}`).join('\n')
    return `Here is our price list:\n${list}\n\nAny of these catch your eye?`
  }

  // Generic fallback
  return `Thank you for contacting ${storeName}! We have ${products.length} products in stock today. Please feel free to ask about specific items or add them directly to your cart.`
}
