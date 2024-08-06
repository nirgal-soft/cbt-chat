import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-orange-100 rounded">Home</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-orange-100 rounded">Profile</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-orange-100 rounded">Settings</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
