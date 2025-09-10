import Link from 'next/link';
import Image from 'next/image';
import type { DoctorDetails } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, GraduationCap, BadgeCheck } from 'lucide-react';
import { getClinicById } from '@/lib/data';
import { useEffect, useState } from 'react';

interface DoctorCardProps {
  doctor: DoctorDetails;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [clinicName, setClinicName] = useState<string | null>(null);

  useEffect(() => {
    if (doctor.clinicId) {
      getClinicById(doctor.clinicId).then(clinic => {
        if (clinic) {
          setClinicName(clinic.name);
        }
      });
    }
  }, [doctor.clinicId]);


  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="p-4 flex-row gap-4 items-start">
        <Image
          src={doctor.imageUrl || `https://i.pravatar.cc/80?u=${doctor.id}`}
          alt={doctor.name || 'Doctor profile picture'}
          width={80}
          height={80}
          className="rounded-full border-2 border-primary object-cover"
        />
        <div className="flex-1">
          <CardTitle className="text-lg font-headline mb-1">Dr. {doctor.name}</CardTitle>
          <CardDescription>{doctor.specialization}</CardDescription>
           {doctor.verified ? (
            <Badge variant="default" className="mt-2 bg-green-100 text-green-800 border-green-200">
                <BadgeCheck className="h-4 w-4 mr-1"/>
                Verified
            </Badge>
           ) : (
            <Badge variant="destructive" className="mt-2">
                Not Verified
            </Badge>
           )}
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
             {clinicName && (
               <p className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{clinicName}</span>
              </p>
            )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/doctors/${doctor.id}`}>Book Appointment</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
