import React from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAdminStatus } from '../hooks/useAdminStatus';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin, isLoading } = useAdminStatus();

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
    </div>
  );
};

export default Sidebar;
