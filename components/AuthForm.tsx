// components/AuthForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '../contexts/ToastContext'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { showToast } = useToast()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast("Sign up successful! Please check your email for confirmation.", 'success')
      setEmail('')
      setPassword('')
    }
    setLoading(false)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast("Signed in successfully!", 'success')
      router.push('/chat')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 bg-white"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 bg-white"
        required
      />
      <button
        type="submit"
        className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300"
        disabled={loading}
      >
        {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
      </button>
      <p className="mt-4 text-center text-gray-700">
        {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-orange-500 hover:underline"
          disabled={loading}
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </form>
  )
}
