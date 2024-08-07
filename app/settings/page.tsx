'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Settings() {
  const [clearing, setClearing] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const clearChatHistory = async () => {
    setClearing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      alert('Chat history cleared successfully!')
      router.push('/chat') // Redirect to chat page
    } catch (error) {
      console.error('Error clearing chat history:', error)
      alert('Failed to clear chat history. Please try again.')
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Clear Chat History</h2>
        <p className="mb-2">This action will delete all your chat messages. This cannot be undone.</p>
        <button
          onClick={clearChatHistory}
          disabled={clearing}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          {clearing ? 'Clearing...' : 'Clear Chat History'}
        </button>
      </div>
    </div>
  )
}
