"use client"

import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import homeIcon from '@/public/icons/home.svg';
import profileIcon from '@/public/icons/profile.svg';
import transactionsIcon from '@/public/icons/transactions.svg';
import settingsIcon from '@/public/icons/settings.svg';

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Clear The Chips
        </Link>
        {!isMobile && (
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-gray-600 hover:text-blue-600 flex items-center"><Image src={homeIcon} alt="Home" className="w-5 h-5 mr-2" /> Home</Link></li>
              <li><Link href="/profile" className="text-gray-600 hover:text-blue-600 flex items-center"><Image src={profileIcon} alt="Profile" className="w-5 h-5 mr-2" /> Profile</Link></li>
              <li><Link href="/transactions" className="text-gray-600 hover:text-blue-600 flex items-center"><Image src={transactionsIcon} alt="Transactions" className="w-5 h-5 mr-2" /> Transactions</Link></li>
              <li><Link href="/settings" className="text-gray-600 hover:text-blue-600 flex items-center"><Image src={settingsIcon} alt="Settings" className="w-5 h-5 mr-2" /> Settings</Link></li>
            </ul>
          </nav>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}