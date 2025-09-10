

import Link from 'next/link';
import Image from 'next/image';
import type { DoctorProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, GraduationCap } from 'lucide-react';

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="p-4 flex-row gap-4 items-start">
        <Image
          src={`https://i.pravatar.cc/80?u=${doctor.uid}`}
          alt={doctor.name}
          width={80}
          height={80}
          className="rounded-full border-2 border-primary object-cover"
        />
        <div className="flex-1">
          <CardTitle className="text-lg font-headline mb-1">Dr. {doctor.name}</CardTitle>
          <CardDescription>{doctor.specialization}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="text-sm text-muted-foreground space-y-2">
            <p className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                    License: {doctor.licenseNo}
                </span>
            </p>
            <p className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Verified: {doctor.verified ? 'Yes' : 'No'}</span>
            </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/doctors/${doctor.uid}`}>Book Appointment</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
