// components/ChatInterface.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  conversation_id: string;
}

interface Conversation {
  id: string;
  title: string;
}

interface ChatInterfaceProps {
  currentConversationId: string | null;
  onConversationChange: (conversationId: string | null) => void;
}

export default function ChatInterface({ currentConversationId, onConversationChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId)
    } else {
      setMessages([])
      setShowInstructions(true)
    }
  }, [currentConversationId])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversation_id=${conversationId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const data = await response.json()
      setMessages(data)
      setShowInstructions(data.length === 0)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const saveMessage = async (content: string, sender: 'user' | 'ai') => {
    if (!currentConversationId) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          conversation_id: currentConversationId,
          sender
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save message')
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && currentConversationId) {
      setIsLoading(true)
      setShowInstructions(false)

      try {
        // Save user message
        const userMessage = await saveMessage(input, 'user')
        setMessages(prevMessages => [...prevMessages, userMessage])
        setInput('')

        // Send message to AI
        const chatResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input,
            conversationId: currentConversationId
          }),
        })

        if (!chatResponse.ok) {
          throw new Error('Failed to get AI response')
        }

        const chatData = await chatResponse.json()

        // Save AI response
        const aiMessage = await saveMessage(chatData.reply.content, 'ai')
        setMessages(prevMessages => [...prevMessages, aiMessage])

      } catch (error) {
        console.error('Error in handleSubmit:', error)
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false)
      }
    }
  }

  const createNewConversation = async () => {
    const title = prompt('Enter a title for the new conversation:')
    if (title) {
      try {
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        })
        if (!response.ok) {
          throw new Error('Failed to create conversation')
        }
        const data = await response.json()
        setConversations(prev => [data, ...prev])
        onConversationChange(data.id)
      } catch (error) {
        console.error('Error creating new conversation:', error)
        // You might want to show an error message to the user here
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="p-4 bg-white border-b border-orange-200">
        <select 
          value={currentConversationId || ''}
          onChange={(e) => onConversationChange(e.target.value || null)}
          className="p-2 border border-orange-300 rounded-lg mr-2"
        >
          <option value="">Select a conversation</option>
          {conversations.map(conv => (
            <option key={conv.id} value={conv.id}>{conv.title}</option>
          ))}
        </select>
        <button 
          onClick={createNewConversation}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          New Conversation
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {showInstructions && (
          <div className="text-gray-500 italic mb-4 p-3 bg-white rounded-lg border border-orange-200 shadow-sm">
            <p>Welcome to Friendly Chat! Here's how to use this chatbot:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Select a conversation from the dropdown or create a new one</li>
              <li>Type your message in the input box below</li>
              <li>Press 'Send' or hit Enter to send your message</li>
              <li>Wait for the bot to respond</li>
              <li>You can ask questions, seek advice, or just chat!</li>
            </ul>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <span className={`inline-block p-3 rounded-lg max-w-[80%] ${
              message.sender === 'ai'
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
      <div className="p-4 bg-white border-t border-orange-200">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            className="flex-grow p-3 border border-orange-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 bg-white"
            placeholder="Type your message..."
            disabled={isLoading || !currentConversationId}
          />
          <button 
            type="submit" 
            className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300"
            disabled={isLoading || !currentConversationId}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
