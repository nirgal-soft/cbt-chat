'use client'
import React, { useState, useEffect, useCallback } from 'react';
import ChatInterface from './ChatInterface';
import Sidebar from './Sidebar';

export default function ChatWrapper() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshConversations = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleNewConversation = useCallback((newConversationId: string | null) => {
    setCurrentConversationId(newConversationId);
    refreshConversations();
  }, [refreshConversations]);

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onConversationSelect={setCurrentConversationId}
        currentConversationId={currentConversationId}
        refreshTrigger={refreshTrigger}
      />
      <ChatInterface
        currentConversationId={currentConversationId}
        onConversationChange={handleNewConversation}
        user={null}
        // Assuming user is passed down from a parent component
      />
    </div>
  );
}

