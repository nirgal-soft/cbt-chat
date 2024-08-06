'use client'
import React, { useState } from 'react';
import { Bars3Icon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';

interface MenuBarProps {
  onSidebarToggle: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onSidebarToggle }) => {
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={onSidebarToggle}
              className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-600">Friendly Chat</h1>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsKebabMenuOpen(!isKebabMenuOpen)}
                className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              >
                <EllipsisVerticalIcon className="h-6 w-6" />
              </button>
              {isKebabMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
