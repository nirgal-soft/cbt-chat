import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useAdminStatus } from '../hooks/useAdminStatus';

interface MenuBarProps {
  onSidebarToggle: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onSidebarToggle }) => {
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const kebabMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminStatus();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (kebabMenuRef.current && !kebabMenuRef.current.contains(event.target as Node)) {
        setIsKebabMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md h-12 flex items-center justify-between px-4">
      <button
        onClick={onSidebarToggle}
        className="p-2 rounded-md hover:bg-gray-100"
      >
        <Bars3Icon className="h-6 w-6 text-gray-600" />
      </button>
      
      <Link href="/chat" className="text-xl font-bold text-orange-600">
        Friendly Chat
      </Link>
      
      <div ref={kebabMenuRef} className="relative">
        <button
          onClick={() => setIsKebabMenuOpen(!isKebabMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
        </button>
        {isKebabMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <Link href="/chat" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</Link>
            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
            <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
            {isAdmin && (
              <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Settings</Link>
            )}
            <button 
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBar;
