
"use client"

import * as React from "react";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Loader2, LogOut, User as UserIcon, LayoutDashboard, Building, Hospital, Shield, FlaskConical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

const avatarColors = [
  'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 
  'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

const getAvatarColor = (str: string) => {
    if (!str) return avatarColors[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % avatarColors.length);
    return avatarColors[index];
};


export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // MOCK: Check localStorage for a logged-in user
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    // MOCK: Clear localStorage and redirect
    localStorage.removeItem('mockUser');
    setUser(null);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/login');
  }

  if (isLoading) {
    return <div className="w-24 h-10 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Login / Sign Up</Link>
      </Button>
    );
  }

  const getInitials = (email: string) => {
    if (!email) return 'U';
    const parts = email.split('@');
    return parts[0][0].toUpperCase();
  }
  
  const fallbackColor = user.email ? getAvatarColor(user.email) : 'bg-gray-500';
  
  const dashboardLinks: Record<string, {href: string, label: string, icon: React.ReactNode}> = {
    doctor: { href: '/dashboard/doctor', label: 'Doctor Dashboard', icon: <LayoutDashboard /> },
    clinic: { href: '/dashboard/clinic', label: 'Clinic Dashboard', icon: <Building /> },
    hospital: { href: '/dashboard/hospital', label: 'Hospital Dashboard', icon: <Hospital /> },
    diagnostics_centres: { href: '/dashboard/diagnostics', label: 'Diagnostics Dashboard', icon: <FlaskConical /> },
    admin: { href: '/dashboard/admin', label: 'Admin Dashboard', icon: <Shield /> },
  }

  const userDashboard = user.role ? dashboardLinks[user.role] : null;

  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={`${fallbackColor} text-white font-bold`}>
                {user.email ? getInitials(user.email) : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Logged In</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
              <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
              </Link>
          </DropdownMenuItem>

          {user.role === 'patient' && (
              <DropdownMenuItem asChild>
                  <Link href="/appointments">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>My Appointments</span>
                  </Link>
              </DropdownMenuItem>
          )}

          {userDashboard && (
            <DropdownMenuItem asChild>
                <Link href={userDashboard.href}>
                    {React.cloneElement(userDashboard.icon as React.ReactElement, { className: 'mr-2 h-4 w-4' })}
                    <span>{userDashboard.label}</span>
                </Link>
            </DropdownMenuItem>
          )}
        
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
