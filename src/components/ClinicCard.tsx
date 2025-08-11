
import Link from 'next/link';
import Image from 'next/image';
import type { Clinic } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';

interface ClinicCardProps {
  clinic: Clinic;
}

export function ClinicCard({ clinic }: ClinicCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="p-0">
        <Image
          src={clinic.imageUrl}
          alt={clinic.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
          data-ai-hint={clinic.dataAiHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-2 truncate">{clinic.name}</CardTitle>
        <CardDescription className="flex items-center text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          {clinic.location}
        </CardDescription>
        <div className="flex items-center gap-2 mb-4">
            <Badge variant="default" className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-300 text-yellow-300"/> {clinic.rating}
            </Badge>
        </div>
        <div>
          {clinic.specialties.slice(0, 3).map(specialty => (
            <Badge key={specialty} variant="secondary" className="mr-1 mb-1">{specialty}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/clinics/${clinic.id}`}>View Doctors</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
