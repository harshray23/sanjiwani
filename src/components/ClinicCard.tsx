
import Link from 'next/link';
import Image from 'next/image';
import type { ClinicDetails } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, BadgeCheck } from 'lucide-react';

interface ClinicCardProps {
  clinic: ClinicDetails;
}

export function ClinicCard({ clinic }: ClinicCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="p-0">
        <Image
          src={clinic.imageUrl || `https://picsum.photos/seed/${clinic.id}/400/200`}
          alt={clinic.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
          data-ai-hint={clinic.dataAiHint || 'clinic building'}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-2 truncate">{clinic.name}</CardTitle>
        <CardDescription className="flex items-center text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          {clinic.address}
        </CardDescription>
        <div className="flex items-center gap-2 mb-4">
            {clinic.verified ? (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    <BadgeCheck className="h-4 w-4 mr-1"/>
                    Verified
                </Badge>
            ) : (
                <Badge variant="destructive">
                    Not Verified
                </Badge>
            )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/clinics/${clinic.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
