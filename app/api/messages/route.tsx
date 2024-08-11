import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const url = new URL(req.url)
  const conversation_id = url.searchParams.get('conversation_id')

  if (!conversation_id) {
    return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { content, conversation_id, sender } = await req.json()

  // Validate sender
  if (!sender || (sender !== 'user' && sender !== 'ai')) {
    return NextResponse.json({ error: 'Invalid sender' }, { status: 400 })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // First, check if the user owns the conversation
  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .select('user_id')
    .eq('id', conversation_id)
    .single()

  if (conversationError || conversation?.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // If the user owns the conversation, insert the message
  const { data, error } = await supabase
    .from('messages')
    .insert({ 
      content, 
      conversation_id, 
      sender,
      user_id: user.id
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
