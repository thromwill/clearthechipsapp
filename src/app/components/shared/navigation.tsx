"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import homeIcon from '@/public/icons/home.svg';
import profileIcon from '@/public/icons/profile.svg';
import transactionsIcon from '@/public/icons/transactions.svg';
import settingsIcon from '@/public/icons/settings.svg';

export default function Navigation() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-4 w-full -mx-4 px-4 z-50">
      <div className="flex justify-center items-center max-w-sm mx-auto bg-gray-100 border border-gray-300 rounded-full overflow-hidden">
        <Link className="flex-1 flex items-center justify-center p-3 hover:bg-gray-200" href="/">
          <Image src={homeIcon} alt="Home" className="w-5 h-5 md:w-6 md:h-6" />
        </Link>
        <Link className="flex-1 flex items-center justify-center p-3 hover:bg-gray-200" href="/profile">
          <Image src={profileIcon} alt="Profile" className="w-5 h-5 md:w-6 md:h-6" />
        </Link>
        <Link className="flex-1 flex items-center justify-center p-3 hover:bg-gray-200" href="/transactions">
          <Image src={transactionsIcon} alt="Transactions" className="w-4 h-4 md:w-5 md:h-5" />
        </Link>
        <Link className="flex-1 flex items-center justify-center p-3 hover:bg-gray-200" href="/settings">
          <Image src={settingsIcon} alt="Settings" className="w-6 h-6 md:w-7 md:h-7" />
        </Link>
      </div>
    </nav>
  );
}