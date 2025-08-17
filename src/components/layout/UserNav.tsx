
"use client"

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Loader2, LogOut, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
        router.push('/login');
    } catch (error) {
        console.error('Logout error:', error);
        toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive'});
    }
  }

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Login / Sign Up</Link>
      </Button>
    );
  }

  const getInitials = (email: string) => {
    const parts = email.split('@');
    return parts[0][0].toUpperCase();
  }

  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
             <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
            <AvatarFallback>{user.email ? getInitials(user.email) : 'U'}</AvatarFallback>
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
             <Link href="/appointments">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Appointments</span>
            </Link>
          </DropdownMenuItem>
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
