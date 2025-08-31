
"use client";

import { useEffect, useState } from 'react';
import { getClinicById } from '@/lib/mock-data';
import type { Clinic } from '@/lib/types';
import Image from 'next/image';
import { DoctorCard } from '@/components/DoctorCard';
import { Loader2, MapPin, Phone, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

export default function ClinicDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchClinic = async () => {
      setIsLoading(true);
      const data = await getClinicById(id);
      if (data) {
        setClinic(data);
      }
      setIsLoading(false);
    };
    fetchClinic();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>;
  }

  if (!clinic) {
    return <div className="text-center py-12">Clinic not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-card p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row gap-6">
                    <Image
                        src={clinic.imageUrl}
                        alt={clinic.name}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover w-full md:w-1/3"
                        data-ai-hint={clinic.dataAiHint}
                    />
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold font-headline mb-2">{clinic.name}</h1>
                        <div className="flex items-center gap-4 text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/> {clinic.rating.toFixed(1)}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="h-5 w-5"/> {clinic.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Phone className="h-5 w-5"/> {clinic.contact.phone}
                            </span>
                        </div>
                        <p className="mb-4 text-foreground/80">{clinic.about}</p>
                        <div className="flex flex-wrap gap-2">
                            {clinic.specialties.map(specialty => (
                                <Badge key={specialty} variant="outline">{specialty}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold font-headline mb-6">Doctors at {clinic.name}</h2>
                {clinic.doctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {clinic.doctors.map(doctor => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    <p>No doctors listed for this clinic yet.</p>
                )}
            </div>
        </div>

        <div className="lg:col-span-1">
            {/* Placeholder for map or other info */}
            <div className="sticky top-24">
                <div className="bg-card p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Location</h3>
                     <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Map Placeholder</p>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{clinic.contact.address}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
