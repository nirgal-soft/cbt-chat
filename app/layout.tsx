'use client'

import './globals.css'
import { useState } from 'react'
import { ToastProvider } from '../contexts/ToastContext'
import MenuBar from '../components/MenuBar'
import Sidebar from '../components/Sidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <ToastProvider>
          <div className="flex flex-col h-screen">
            <MenuBar onSidebarToggle={toggleSidebar} />
            <div className="flex flex-grow overflow-hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              <main className={`flex-grow overflow-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
