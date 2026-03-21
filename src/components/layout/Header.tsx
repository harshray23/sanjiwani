"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Stethoscope, FlaskConical, ChevronDown, Building, Hospital, FileText, Trophy, Activity } from 'lucide-react';
import { UserNav } from './UserNav';
import { Suspense } from 'react';
import Image from 'next/image';
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
    { href: '/triage', label: 'AI Triage', icon: <Activity className="h-4 w-4 mr-1.5 text-primary"/> },
    { href: '/appointments', label: 'My Appointments' },
    { href: '/records', label: 'Health Vault', icon: <FileText className="h-4 w-4 mr-1.5"/> },
    { href: '/rewards', label: 'Rewards', icon: <Trophy className="h-4 w-4 mr-1.5 text-yellow-500 fill-yellow-500"/> },
  ];

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-accent hover:text-accent/90 transition-colors">
            <Image
              src="/logo.jpg"
              alt="Sanjeevani Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold font-headline hidden sm:block">Sanjeevani</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <Button key={item.label} variant="ghost" asChild className="group">
                <Link href={item.href} className="flex items-center">
                  {item.icon}
                  {item.label}
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                </Link>
              </Button>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="group">
                      Our Services
                      <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {serviceItems.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Suspense fallback={<Button disabled>Loading...</Button>}>
              <UserNav />
            </Suspense>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <Suspense>
              <UserNav />
            </Suspense>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="sr-only">
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>Main navigation links for Sanjeevani.</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Button key={item.label} variant="ghost" className="justify-start text-lg" asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Link>
                    </Button>
                  ))}
                  <div className="border-t pt-4">
                      <h3 className="px-3 text-sm font-semibold text-muted-foreground">Our Services</h3>
                      <div className="mt-2 space-y-2">
                          {serviceItems.map((item) => (
                              <Button key={item.label} variant="ghost" className="justify-start text-lg w-full" asChild>
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
        </div>
      </header>
    </div>
  );
}
