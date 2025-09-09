
"use client";

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchClinicsAndDoctors } from '@/lib/data';
import type { Clinic, Doctor } from '@/lib/types';
import { ClinicCard } from '@/components/ClinicCard';
import { DoctorCard } from '@/components/DoctorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { Badge } from '@/components/ui/badge';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<{ clinics: Clinic[]; doctors: Doctor[] }>({ clinics: [], doctors: [] });
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const data = await searchClinicsAndDoctors(query);
      setResults(data);
      setIsLoading(false);
    };
    fetchResults();
  }, [query]);
  
  const handleSearch = (e: React.FormEvent) => {
     e.preventDefault();
     // This will update the URL and trigger the useEffect
     window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  }

  const uniqueSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    results.doctors.forEach(doctor => specialties.add(doctor.specialty));
    return Array.from(specialties);
  }, [results.doctors]);

  const filteredDoctors = useMemo(() => {
    if (!activeSpecialty) {
      return results.doctors;
    }
    return results.doctors.filter(doctor => doctor.specialty === activeSpecialty);
  }, [results.doctors, activeSpecialty]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2 text-accent">Search Results</h1>
        <p className="text-lg text-muted-foreground">Find the best clinics and doctors for your needs.</p>
        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search again..."
            className="h-12 text-base"
          />
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <SearchIcon />}
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
           <Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" />
        </div>
      ) : (
        <Tabs defaultValue="doctors">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clinics">Clinics ({results.clinics.length})</TabsTrigger>
            <TabsTrigger value="doctors">Doctors ({results.doctors.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="clinics">
            {results.clinics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {results.clinics.map(clinic => <ClinicCard key={clinic.id} clinic={clinic} />)}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No clinics found matching your search.</p>
            )}
          </TabsContent>
          <TabsContent value="doctors">
            <div className="my-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-primary"/>
                    <h3 className="text-md font-semibold text-accent">Filter by Specialization</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={!activeSpecialty ? 'default' : 'outline'}
                        onClick={() => setActiveSpecialty(null)}
                        size="sm"
                    >
                        All
                    </Button>
                    {uniqueSpecialties.map(specialty => (
                        <Button
                            key={specialty}
                            variant={activeSpecialty === specialty ? 'default' : 'outline'}
                            onClick={() => setActiveSpecialty(specialty)}
                            size="sm"
                        >
                            {specialty}
                        </Button>
                    ))}
                </div>
            </div>
             {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredDoctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />)}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                {activeSpecialty 
                    ? `No doctors found for the specialization "${activeSpecialty}".`
                    : "No doctors found matching your search."
                }
              </p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>}>
            <SearchResults />
        </Suspense>
    )
}
