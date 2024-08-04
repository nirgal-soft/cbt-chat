// components/ChatInterface.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Message {
  id: string;
  content: string;
  is_bot: boolean;
  user_id: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/') // Redirect to login if not authenticated
        return
      }
      setUserId(user.id)
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        setMessages(data || [])
        setShowInstructions(data?.length === 0)
      }
    }

    fetchUserAndMessages()
  }, [router, supabase])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && userId) {
      setIsLoading(true)
      setShowInstructions(false)

      try {
        // Insert user message to Supabase
        const { data: userMessage, error: userError } = await supabase
          .from('messages')
          .insert({ content: input, is_bot: false, user_id: userId })
          .select()
          .single()

        if (userError) {
          throw userError
        }

        setMessages(prevMessages => [...prevMessages, userMessage])
        setInput('')

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        if (!data.reply || !data.reply.content) {
          throw new Error('Invalid response from API')
        }

        // Insert bot message to Supabase
        const { data: botMessage, error: botError } = await supabase
          .from('messages')
          .insert({ content: data.reply.content, is_bot: true, user_id: userId })
          .select()
          .single()

        if (botError) {
          throw botError
        }

        setMessages(prevMessages => [...prevMessages, botMessage])
      } catch (error: unknown) {
        console.error('Error in handleSubmit:', error)
        let errorMessage = 'An unknown error occurred. Please try again.';
        
        if (error instanceof Error) {
          errorMessage = `An error occurred: ${error.message}. Please try again.`;
        } else if (typeof error === 'string') {
          errorMessage = `An error occurred: ${error}. Please try again.`;
        }
        
        setMessages(prevMessages => [...prevMessages, { 
          id: Date.now().toString(), 
          content: errorMessage, 
          is_bot: true,
          user_id: userId 
        }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/') // Redirect to login page after sign out
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-[calc(100vh-2rem)] sm:h-[600px]">
        <div className="flex justify-between items-center p-4 border-b border-orange-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-700">Friendly Chat</h1>
          <button 
            onClick={handleSignOut}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-orange-50">
          {showInstructions && (
            <div className="text-gray-500 italic mb-4 p-3 bg-white rounded-lg border border-orange-200 shadow-sm">
              <p>Welcome to Friendly Chat! Here&apos;s how to use this chatbot:</p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Type your message in the input box below</li>
                <li>Press &apos;Send&apos; or hit Enter to send your message</li>
                <li>Wait for the bot to respond</li>
                <li>You can ask questions, seek advice, or just chat!</li>
              </ul>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.is_bot ? 'justify-start' : 'justify-end'}`}>
              <span className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.is_bot
                  ? 'bg-white text-orange-800 border border-orange-300'
                  : 'bg-orange-500 text-white'
              }`}>
                {message.content}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-orange-500">
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-orange-200 bg-white">
          <div className="flex rounded-lg border border-orange-300 overflow-hidden">
            <input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              className="flex-grow p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 bg-white"
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-orange-500 text-white px-4 py-2 hover:bg-orange-600 transition-colors disabled:bg-orange-300"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
