'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminSettings() {
  const [basePrompt, setBasePrompt] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [updating, setUpdating] = useState<boolean>(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdminAndFetchSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (error || userData?.role !== 'admin') {
          router.push('/')
          return
        }

        // Fetch settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('base_prompt')
          .single()

        if (!settingsError && settingsData) {
          setBasePrompt(settingsData.base_prompt)
        }
      } else {
        router.push('/')
        return
      }

      setLoading(false)
    }

    checkAdminAndFetchSettings()
  }, [router, supabase])

  const updateBasePrompt = async () => {
    setUpdating(true)
    const { error } = await supabase
      .from('settings')
      .update({ base_prompt: basePrompt })
      .eq('id', 1)

    if (error) {
      console.error('Error updating base prompt:', error)
      alert('Failed to update base prompt. Please try again.')
    } else {
      alert('Base prompt updated successfully')
    }
    setUpdating(false)
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <div className="mb-4">
        <label htmlFor="basePrompt" className="block text-sm font-medium text-gray-700 mb-2">
          Base Prompt
        </label>
        <textarea
          id="basePrompt"
          value={basePrompt}
          onChange={(e) => setBasePrompt(e.target.value)}
          placeholder="Enter new base prompt"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          rows={5}
        />
      </div>
      <button
        onClick={updateBasePrompt}
        disabled={updating}
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {updating ? 'Updating...' : 'Update Base Prompt'}
      </button>
    </div>
  )
}
