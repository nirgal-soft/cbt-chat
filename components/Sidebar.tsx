import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAdminStatus } from '../hooks/useAdminStatus';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationSelect: (conversationId: string) => void;
}

interface Conversation {
  id: string;
  title: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onConversationSelect }) => {
  const { isAdmin, isLoading } = useAdminStatus();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching conversations:', error)
      } else {
        setConversations(data || [])
      }
    }

    fetchConversations()
  }, [supabase])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-orange-600">Menu</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/chat" className="block py-2 px-4 text-gray-700 hover:bg-orange-100 rounded">Home</Link>
          </li>
          <li>
            <Link href="/profile" className="block py-2 px-4 text-gray-700 hover:bg-orange-100 rounded">Profile</Link>
          </li>
          <li>
            <Link href="/settings" className="block py-2 px-4 text-gray-700 hover:bg-orange-100 rounded">Settings</Link>
          </li>
          {!isLoading && isAdmin && (
            <li>
              <Link href="/admin/settings" className="block py-2 px-4 text-gray-700 hover:bg-orange-100 rounded">Admin Settings</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-orange-600 mb-2">Conversations</h3>
        <ul className="space-y-1">
          {conversations.map(conv => (
            <li key={conv.id}>
              <button
                onClick={() => onConversationSelect(conv.id)}
                className="w-full text-left py-1 px-2 text-gray-700 hover:bg-orange-100 rounded truncate"
              >
                {conv.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
