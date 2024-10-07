"use client"

import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Bell, Menu } from "lucide-react"
import Logo from '@/public/images/logo.png'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 bg-white backdrop-blur-md shadow-md`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6">
                <ul className="space-y-4">
                  <li><NavLink href="/" onClick={closeMenu}>Home</NavLink></li>
                  <li><NavLink href="/profile" onClick={closeMenu}>Profile</NavLink></li>
                  <li><NavLink href="/transactions" onClick={closeMenu}>Transactions</NavLink></li>
                  <li><NavLink href="/settings" onClick={closeMenu}>Settings</NavLink></li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <Image src={Logo} alt="Clear The Chips" width={28} height={28} />
            <span className="text-xl font-semibold text-gray-800 hidden sm:inline">Clear The Chips</span>
          </Link>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><NavLink href="/">Home</NavLink></li>
            <li><NavLink href="/profile">Profile</NavLink></li>
            <li><NavLink href="/transactions">Transactions</NavLink></li>
            <li><NavLink href="/settings">Settings</NavLink></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <NotificationBell count={3} />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children, className = '', onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <Link href={href} className={`text-gray-600 hover:text-gray-900 transition-colors ${className}`} onClick={onClick}>
      {children}
    </Link>
  );
}

function NotificationBell({ count }: { count: number }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {count > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {count}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">You have {count} unread notifications.</p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <p className="text-sm">New game invitation from John</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <p className="text-sm">You won $50 in last night&apos;s game!</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <p className="text-sm">Reminder: Upcoming tournament this weekend</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}