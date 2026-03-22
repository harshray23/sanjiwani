"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Stethoscope, FlaskConical, ChevronDown, Building, Hospital, FileText, Trophy, Activity } from 'lucide-react';
import { UserNav } from './UserNav';
import { Suspense } from 'react';
import Logo from './Logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Header() {
  const serviceItems = [
    { href: '/search', label: 'Find Doctors', icon: <Stethoscope className="h-4 w-4"/> },
    { href: '/clinics', label: 'Find Clinics', icon: <Building className="h-4 w-4"/> },
    { href: '/hospitals', label: 'Find Hospitals', icon: <Hospital className="h-4 w-4"/> },
    { href: '/diagnostics', label: 'Find Diagnostics', icon: <FlaskConical className="h-4 w-4"/> },
  ];

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/appointments', label: 'My Appointments' },
    { href: '/records', label: 'Health Vault' },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="bg-white/95 backdrop-blur-md border shadow-lg rounded-full w-full max-w-6xl h-16 flex items-center justify-between px-8 pointer-events-auto transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Logo className="text-xl sm:text-2xl" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="text-[#0f4c5c] font-semibold hover:bg-transparent hover:text-primary">
              <Link href={item.href}>
                {item.label}
              </Link>
            </Button>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-[#0f4c5c] font-semibold hover:bg-transparent hover:text-primary group">
                    Our Services
                    <ChevronDown className="ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl mt-2">
              {serviceItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                    {item.icon}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-4">
            <Suspense fallback={<Button disabled size="sm" className="rounded-full">Loading...</Button>}>
              <UserNav />
            </Suspense>
          </div>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <Suspense>
            <UserNav />
          </Suspense>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#0f4c5c]">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="rounded-l-3xl">
              <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Main navigation links for Sanjiwani.</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Button key={item.label} variant="ghost" className="justify-start text-lg text-[#0f4c5c] font-semibold" asChild>
                    <Link href={item.href}>
                      {item.label}
                    </Link>
                  </Button>
                ))}
                <div className="border-t pt-4">
                    <h3 className="px-3 text-sm font-semibold text-muted-foreground uppercase">Our Services</h3>
                    <div className="mt-2 space-y-2">
                        {serviceItems.map((item) => (
                            <Button key={item.label} variant="ghost" className="justify-start text-lg w-full text-[#0f4c5c]" asChild>
                                <Link href={item.href} className="flex items-center gap-2">
                                    {item.icon}
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}