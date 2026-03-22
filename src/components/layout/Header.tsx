
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Activity, Calendar, FileText, Trophy, ChevronDown, LogIn } from 'lucide-react';
import { UserNav } from './UserNav';
import { Suspense } from 'react';
import Logo from './Logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { href: '/triage', label: 'AI Triage', icon: <Activity className="h-4 w-4" /> },
    { href: '/appointments', label: 'My Appointments', icon: <Calendar className="h-4 w-4" /> },
    { href: '/records', label: 'Health Vault', icon: <FileText className="h-4 w-4" /> },
    { href: '/rewards', label: 'Rewards', icon: <Trophy className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="glass-morphism rounded-full w-full max-w-7xl h-16 flex items-center justify-between px-6 pointer-events-auto transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Logo className="text-xl sm:text-2xl text-white" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Button 
              key={item.label} 
              variant="ghost" 
              asChild 
              className={cn(
                "text-white/80 font-medium hover:bg-white/10 hover:text-white rounded-full flex items-center gap-2",
                pathname === item.href && "bg-white/20 text-white"
              )}
            >
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white/80 font-medium hover:bg-white/10 hover:text-white rounded-full group">
                    Our Services
                    <ChevronDown className="ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-morphism text-white rounded-xl mt-2">
              <DropdownMenuItem asChild>
                <Link href="/search" className="cursor-pointer">Find Doctors</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/clinics" className="cursor-pointer">Clinics</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/hospitals" className="cursor-pointer">Hospitals</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/diagnostics" className="cursor-pointer">Diagnostics</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-4">
            <Suspense fallback={<Button disabled className="rounded-full">...</Button>}>
              <UserNav />
            </Suspense>
          </div>
        </nav>

        <div className="lg:hidden flex items-center gap-2">
          <UserNav />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#020817] border-l-white/10">
              <SheetHeader className="text-left border-b border-white/5 pb-4">
                  <Logo className="text-2xl text-white" />
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Button key={item.label} variant="ghost" className="justify-start text-white/80" asChild>
                    <Link href={item.href} className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
