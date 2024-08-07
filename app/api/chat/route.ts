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
    const { message } = await req.json()

    // Fetch user's chat history
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('content, is_bot')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (messagesError) {
      throw new Error('Error fetching message history')
    }

    // If this is a new chat, fetch the base prompt
    let basePrompt = ''
    if (messages.length === 0) {
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('base_prompt')
        .single()

      if (settingsError) {
        console.error('Error fetching base prompt:', settingsError)
      } else {
        basePrompt = settingsData.base_prompt
        console.log(basePrompt)
      }
    }

    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: 'system', content: basePrompt || 'You are a helpful assistant.' },
      ...messages.map(msg => ({
        role: msg.is_bot ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: openaiMessages,
    })

    const reply = completion.choices[0].message

    // Save the new messages to the database
    await supabase.from('messages').insert([
      { user_id: user.id, content: message, is_bot: false },
      { user_id: user.id, content: reply.content, is_bot: true }
    ])

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
