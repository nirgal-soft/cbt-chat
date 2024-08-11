// components/ChatWrapper.tsx
'use client'

import { useState } from 'react'
import ChatInterface from './ChatInterface'

export default function ChatWrapper() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  return (
    <ChatInterface 
      currentConversationId={currentConversationId} 
      onConversationChange={setCurrentConversationId}
    />
  )
}
