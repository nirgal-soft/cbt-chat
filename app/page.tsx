// app/page.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      setIsLoading(true)
      setShowInstructions(false)
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
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-[calc(100vh-2rem)] sm:h-[600px]">
        <h1 className="text-2xl sm:text-3xl font-bold p-4 text-orange-700 border-b border-orange-200">Friendly Chat</h1>
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
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <span className={`inline-block p-3 rounded-lg max-w-[80%] ${
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
