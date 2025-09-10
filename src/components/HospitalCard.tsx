
"use client";

import type { Hospital } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { BedDouble, MapPin, Phone, Star, Zap, MapIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';

interface HospitalCardProps {
  hospital: Hospital;
}

function BedInfo({ label, available, total }: { label: string; available: number; total: number }) {
  const percentage = total > 0 ? (available / total) * 100 : 0;
  const isAvailable = available > 0;
  
  return (
    <div className="text-sm">
        <div className="flex items-center justify-between mb-1">
            <span className="text-muted-foreground">{label}</span>
            <span className={`font-semibold ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {available} / {total}
            </span>
        </div>
        <Progress value={percentage} className={`h-2 ${!isAvailable ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`} />
    </div>
  );
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  const { toast } = useToast();
  const totalAvailableBeds = 
    (hospital.beds?.icu?.available || 0) + 
    (hospital.beds?.oxygen?.available || 0) + 
    (hospital.beds?.ventilator?.available || 0) + 
    (hospital.beds?.general?.available || 0);

  let lastUpdatedText = "N/A";
  if (hospital.lastUpdated) {
    const date = hospital.lastUpdated instanceof Timestamp 
                  ? hospital.lastUpdated.toDate()
                  : typeof hospital.lastUpdated === 'string' 
                    ? new Date(hospital.lastUpdated)
                    // This handles the case where it might be a Firestore-like object but not a Timestamp instance
                    : (hospital.lastUpdated as any).toDate ? (hospital.lastUpdated as any).toDate()
                    : new Date(hospital.lastUpdated);

    if (date instanceof Date && !isNaN(date.valueOf())) { 
        lastUpdatedText = format(date, "PPp");
    }
  }

  const handleViewOnMap = () => {
    let query = '';
    if (hospital.location?.coordinates?.latitude && hospital.location?.coordinates?.longitude) {
      query = `${hospital.location.coordinates.latitude},${hospital.location.coordinates.longitude}`;
    } else if (hospital.location?.address) {
      query = encodeURIComponent(hospital.location.address);
    }

    if (query) {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(mapUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Location Unavailable",
        description: `Map location for ${hospital.name} is not available.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
      <CardHeader className="p-0 relative">
        <Image
          src={hospital.imageUrl || `https://picsum.photos/seed/hospital/600/400`}
          alt={hospital.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={hospital.dataAiHint || (hospital.name.toLowerCase().includes("children") ? "children hospital" : "hospital building")}
        />
        {hospital.rating !== undefined && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" /> {hospital.rating.toFixed(1)}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-1 truncate" title={hospital.name}>{hospital.name}</CardTitle>
        
        <CardDescription className="text-sm text-muted-foreground mb-2 flex items-start">
          <MapPin className="w-4 h-4 mr-1 shrink-0 mt-0.5" /> 
          {hospital.location?.address || 'Address not available'}
        </CardDescription>
        
        {hospital.contact && (
          <CardDescription className="text-sm text-muted-foreground mb-3 flex items-center">
            <Phone className="w-4 h-4 mr-1 shrink-0" /> {hospital.contact}
          </CardDescription>
        )}

        {hospital.emergencyAvailable !== undefined && (
           <CardDescription className={`text-sm mb-3 flex items-center font-medium ${hospital.emergencyAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <Zap className="w-4 h-4 mr-1 shrink-0" /> Emergency: {hospital.emergencyAvailable ? "Available" : "Not Available"}
          </CardDescription>
        )}

        <div className="mb-3">
          {(hospital.specialties || []).slice(0, 3).map(spec => (
            <Badge key={spec} variant="secondary" className="mr-1 mb-1 capitalize">{spec}</Badge>
          ))}
          {(hospital.specialties || []).length > 3 && <Badge variant="secondary">+{hospital.specialties.length - 3} more</Badge>}
        </div>

        {hospital.beds && (
          <div className="space-y-3 border-t border-b py-3 my-3">
            <h4 className="text-sm font-semibold mb-2 text-foreground">Bed Availability:</h4>
            <BedInfo label="ICU" available={hospital.beds.icu?.available || 0} total={hospital.beds.icu?.total || 0} />
            <BedInfo label="Oxygen" available={hospital.beds.oxygen?.available || 0} total={hospital.beds.oxygen?.total || 0} />
            <BedInfo label="Ventilator" available={hospital.beds.ventilator?.available || 0} total={hospital.beds.ventilator?.total || 0} />
            <BedInfo label="General" available={hospital.beds.general?.available || 0} total={hospital.beds.general?.total || 0} />
          </div>
        )}
        
         <p className="text-xs text-muted-foreground">Last Updated: {lastUpdatedText}</p>
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 dark:bg-muted/50 border-t flex flex-col items-stretch space-y-2">
        <Button 
          className="w-full" 
          asChild 
          disabled={totalAvailableBeds === 0}
          variant={totalAvailableBeds > 0 ? "default" : "secondary"}
        >
          <Link href={`/hospitals/${hospital.id}`}> 
            <BedDouble className="w-4 h-4 mr-2" /> 
            {totalAvailableBeds > 0 ? `Reserve a Bed (${totalAvailableBeds} available)` : 'Check Availability Details'}
          </Link>
        </Button>
         <Button variant="outline" className="w-full" onClick={handleViewOnMap}>
          <MapIcon className="w-4 h-4 mr-2" /> View on Map
        </Button>
      </CardFooter>
    </Card>
  );
}

    