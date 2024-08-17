'use client'

import React, { useState } from 'react'
import './globals.css'
import { ToastProvider } from '../contexts/ToastContext'
import MenuBar from '../components/MenuBar'
import Sidebar from '../components/Sidebar'

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setIsSidebarOpen(false); // Optionally close the sidebar after selection
  };

  // Function to trigger a refresh, which updates the refreshTrigger
  const triggerRefresh = () => {
    setRefreshTrigger(Date.now());
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <ToastProvider>
          <div className="flex flex-col h-screen">
            <MenuBar onSidebarToggle={toggleSidebar} />
            <div className="flex flex-grow overflow-hidden">
              <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                onConversationSelect={handleConversationSelect}
                currentConversationId={currentConversationId}
                refreshTrigger={refreshTrigger} // Passing the numeric value
              />
              <main className={`flex-grow overflow-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {React.Children.map(children, child =>
                  React.isValidElement(child)
                    ? React.cloneElement(child as React.ReactElement<any>, { currentConversationId })
                    : child
                )}
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
