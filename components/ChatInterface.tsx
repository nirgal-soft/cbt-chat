'use client'
import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/auth-helpers-nextjs';

interface ChatInterfaceProps {
  currentConversationId: string | null;
  onConversationChange: (newConversationId: string | null) => void;
  user: User | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentConversationId,
  onConversationChange,
  user,
}) => {
  const [messages, setMessages] = useState<any[]>([]); // Define message types according to your data structure
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Example of useEffect to fetch messages when currentConversationId changes
  useEffect(() => {
    if (currentConversationId) {
      // Fetch messages for the conversation
      // Example: fetchMessages(currentConversationId);
    } else {
      // Reset messages if no conversation selected
      setMessages([]);
    }
  }, [currentConversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      // Send the message and get the conversation ID if it's a new conversation
      // Example: const newConversationId = await sendMessage(input);
      const newConversationId = 'some-new-id'; // Replace with actual ID

      // Trigger conversation change
      onConversationChange(newConversationId);

      // Clear input
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-500 italic mb-4 p-3 bg-white rounded-lg border border-orange-200 shadow-sm">
            <p>Welcome! Type a message to start a new conversation or select an existing one from the sidebar.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <span className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.sender === 'ai'
                  ? 'bg-white text-orange-800 border border-orange-300'
                  : 'bg-orange-500 text-white'
              }`}>
                {message.content}
              </span>
            </div>
          ))
        )}
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
            disabled={isLoading || !user}
          />
          <button 
            type="submit" 
            className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300"
            disabled={isLoading || !user}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface;
