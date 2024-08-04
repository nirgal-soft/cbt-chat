// app/api/chat/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const message = body.message

    if (typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    // Fetch user's chat history
    const { data: messages } = await supabase
      .from('messages')
      .select('content, is_bot')
      .order('created_at', { ascending: true })
      .limit(10) // Limit to last 10 messages for context

    // Prepare messages for OpenAI
    const openaiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: 'You are a helpful assistant.' }
    ]

    if (messages) {
      messages.forEach(msg => {
        openaiMessages.push({
          role: msg.is_bot ? 'assistant' : 'user',
          content: msg.content
        })
      })
    }

    // Add the new user message
    openaiMessages.push({ role: 'user', content: message })

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: openaiMessages,
    })

    const reply = completion.choices[0].message

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
