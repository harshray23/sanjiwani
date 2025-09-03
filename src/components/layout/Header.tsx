
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Stethoscope } from 'lucide-react';
import { UserNav } from './UserNav';
import { Suspense } from 'react';
import Logo from './Logo';

export function Header() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/hospitals', label: 'Find a Hospital' },
    { href: '/search', label: 'Find a Doctor/Clinic' },
    { href: '/appointments', label: 'My Appointments' },
  ];

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-primary hover:text-primary/90 transition-colors">
          <Logo className="h-10 w-10" />
          <h1 className="text-2xl font-bold font-headline hidden sm:block">Sanjiwani Health</h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="group">
              <Link href={item.href}>
                {item.label}
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-primary"></span>
              </Link>
            </Button>
          ))}
          <Suspense fallback={<Button>Login</Button>}>
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
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Button key={item.label} variant="ghost" className="justify-start text-lg" asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
