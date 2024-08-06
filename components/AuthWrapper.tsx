// components/AuthWrapper.tsx
'use client'

import Auth from './Auth'
import { ToastProvider } from '../contexts/ToastContext'

export default function AuthWrapper() {
  return (
    <ToastProvider>
      <main className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-orange-700 text-center">Friendly Chat</h1>
          <Auth />
        </div>
      </main>
    </ToastProvider>
  )
}
