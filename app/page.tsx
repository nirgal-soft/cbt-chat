// app/page.tsx
'use client'

import React, { useState } from 'react'

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      setIsLoading(true)
      const userMessage = { text: input, sender: 'user' as const }
      setMessages(prevMessages => [...prevMessages, userMessage])
      setInput('')

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              ...messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
              })),
              { role: 'user', content: userMessage.text }
            ]
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to get response')
        }

        const data = await response.json()
        setMessages(prevMessages => [
          ...prevMessages,
          { text: data.reply.content, sender: 'bot' }
        ])
      } catch (error) {
        console.error('Error:', error)
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }
        ])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-orange-700">Friendly Chat</h1>
        <div className="bg-orange-50 p-4 h-96 overflow-y-auto mb-4 rounded-lg border border-orange-200">
          {messages.map((message, index) => (
            <div key={index} className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-orange-800 border border-orange-300'
              }`}>
                {message.text}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-orange-500">
              Thinking...
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            className="flex-grow p-3 border border-orange-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 bg-white"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="bg-orange-500 text-white p-3 rounded-r-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  )
}
