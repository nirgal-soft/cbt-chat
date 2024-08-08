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
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })  
  const { showToast } = useToast()

  const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  try {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // data: {
        //   role: 'user' // Set a default role
        // }
      },
    })
    if (error) {
      console.error('Signup error:', error)
      showToast(error.message, 'error')
    } else if (data.user) {
      console.log('Signup successful:', data)
      showToast("Sign up successful!", 'success')
      setEmail('')
      setPassword('')
      
      // Automatically sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (signInError) {
        console.error('Auto sign-in error:', signInError)
        showToast("Sign up successful, but couldn't automatically sign in. Please sign in manually.", 'error')
      } else {
        showToast("Signed in successfully!", 'success')
        router.push('/chat') // Redirect to the chat page or your desired route
      }
    }
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    showToast("An unexpected error occurred", 'error')
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
