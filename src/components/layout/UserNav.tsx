

"use client"

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Loader2, LogOut, User as UserIcon, LayoutDashboard, Building, Hospital, Shield, FlaskConical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/data';

const avatarColors = [
  'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 
  'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

const getAvatarColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % avatarColors.length);
    return avatarColors[index];
};


export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if(currentUser) {
          const profile = await getUserProfile(currentUser.uid);
          setUserRole(profile?.role || 'customer');
      } else {
          setUserRole(null);
      }
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
    const parts = email.split('@');
    return parts[0][0].toUpperCase();
  }
  
  const fallbackColor = user.email ? getAvatarColor(user.email) : 'bg-gray-500';
  
  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
             <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
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
         {userRole === 'customer' && (
            <>
              <DropdownMenuItem asChild>
                  <Link href="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                  </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                  <Link href="/appointments">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>My Appointments</span>
                  </Link>
              </DropdownMenuItem>
            </>
         )}
         {userRole === 'doctor' && (
             <DropdownMenuItem asChild>
                <Link href="/dashboard/doctor">
                    <LayoutDashboard className="mr-2 h-4 w-4"/>
                    <span>Doctor Dashboard</span>
                </Link>
             </DropdownMenuItem>
         )}
         {userRole === 'clinic' && (
             <DropdownMenuItem asChild>
                <Link href="/dashboard/clinic">
                    <Building className="mr-2 h-4 w-4"/>
                    <span>Clinic Dashboard</span>
                </Link>
             </DropdownMenuItem>
         )}
         {userRole === 'hospital' && (
             <DropdownMenuItem asChild>
                <Link href="/dashboard/hospital">
                    <Hospital className="mr-2 h-4 w-4"/>
                    <span>Hospital Dashboard</span>
                </Link>
             </DropdownMenuItem>
         )}
         {userRole === 'diagnostics_centres' && (
             <DropdownMenuItem asChild>
                <Link href="/dashboard/diagnostics">
                    <FlaskConical className="mr-2 h-4 w-4"/>
                    <span>Diagnostics Dashboard</span>
                </Link>
             </DropdownMenuItem>
         )}
          {userRole === 'admin' && (
             <DropdownMenuItem asChild>
                <Link href="/dashboard/admin">
                    <Shield className="mr-2 h-4 w-4"/>
                    <span>Admin Dashboard</span>
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

    