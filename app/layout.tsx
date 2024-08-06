// app/layout.tsx
import './globals.css'  // Make sure this import is present
import { ToastProvider } from '../contexts/ToastContext'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Friendly Chat',
  description: 'A simple chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
