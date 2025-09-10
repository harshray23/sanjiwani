
import Link from 'next/link';
import Image from 'next/image';
import type { Doctor } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, GraduationCap } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="p-4 flex-row gap-4 items-start">
        <Image
          src={doctor.imageUrl}
          alt={doctor.name}
          width={80}
          height={80}
          className="rounded-full border-2 border-primary"
          data-ai-hint={doctor.dataAiHint}
        />
        <div className="flex-1">
          <CardTitle className="text-lg font-headline mb-1">{doctor.name}</CardTitle>
          <CardDescription>{doctor.specialty}</CardDescription>
           <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-300 text-yellow-300"/> {doctor.rating}
            </Badge>
            <span className="text-xs text-muted-foreground">({doctor.reviewCount} reviews)</span>
        </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="text-sm text-muted-foreground space-y-2">
            <p className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                    {Array.isArray(doctor.qualifications) 
                        ? doctor.qualifications.join(', ')
                        : doctor.qualifications
                    }
                </span>
            </p>
            <p className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{doctor.experience} years experience</span>
            </p>
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
