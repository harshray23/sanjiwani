
"use client";

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchClinicsAndDoctors, comprehensiveSpecialties } from '@/lib/data';
import type { Clinic, Doctor } from '@/lib/types';
import { ClinicCard } from '@/components/ClinicCard';
import { DoctorCard } from '@/components/DoctorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<{ clinics: Clinic[]; doctors: Doctor[] }>({ clinics: [], doctors: [] });
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeDoctorSpecialty, setActiveDoctorSpecialty] = useState<string | null>(null);
  const [activeClinicSpecialty, setActiveClinicSpecialty] = useState<string | null>(null);

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
     window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  }

  const filteredDoctors = useMemo(() => {
    if (!activeDoctorSpecialty) {
      return results.doctors;
    }
    return results.doctors.filter(doctor => doctor.specialty === activeDoctorSpecialty);
  }, [results.doctors, activeDoctorSpecialty]);
  
  const filteredClinics = useMemo(() => {
    if (!activeClinicSpecialty) {
        return results.clinics;
    }
    return results.clinics.filter(clinic => clinic.specialties.includes(activeClinicSpecialty));
  }, [results.clinics, activeClinicSpecialty]);

  const doctorSpecialtyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    comprehensiveSpecialties.forEach(spec => counts[spec] = 0);
    results.doctors.forEach(doctor => {
        if (counts[doctor.specialty] !== undefined) {
            counts[doctor.specialty]++;
        }
    });
    return counts;
  }, [results.doctors]);

  const clinicSpecialtyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    comprehensiveSpecialties.forEach(spec => counts[spec] = 0);
    results.clinics.forEach(clinic => {
        clinic.specialties.forEach(spec => {
            if (counts[spec] !== undefined) {
                counts[spec]++;
            }
        });
    });
    return counts;
  }, [results.clinics]);


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
            <TabsTrigger value="clinics">Clinics ({filteredClinics.length})</TabsTrigger>
            <TabsTrigger value="doctors">Doctors ({filteredDoctors.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="clinics">
            <div className="my-6">
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4"/>
                                {activeClinicSpecialty || "Filter by Specialization"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                            <DropdownMenuLabel>Filter by Specialization</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={activeClinicSpecialty || "All"} onValueChange={(value) => setActiveClinicSpecialty(value === "All" ? null : value)}>
                                <DropdownMenuRadioItem value="All">All ({results.clinics.length})</DropdownMenuRadioItem>
                                {comprehensiveSpecialties.map(specialty => (
                                    <DropdownMenuRadioItem key={specialty} value={specialty}>
                                        {specialty} ({clinicSpecialtyCounts[specialty] || 0})
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {activeClinicSpecialty && (
                        <Button variant="ghost" onClick={() => setActiveClinicSpecialty(null)}>Clear Filter</Button>
                    )}
                </div>
            </div>
            {filteredClinics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredClinics.map(clinic => <ClinicCard key={clinic.id} clinic={clinic} />)}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                {activeClinicSpecialty
                    ? `No clinics found for the specialization "${activeClinicSpecialty}".`
                    : "No clinics found matching your search."
                }
              </p>
            )}
          </TabsContent>
          <TabsContent value="doctors">
            <div className="my-6">
                <div className="flex items-center gap-4">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4"/>
                                {activeDoctorSpecialty || "Filter by Specialization"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                            <DropdownMenuLabel>Filter by Specialization</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={activeDoctorSpecialty || "All"} onValueChange={(value) => setActiveDoctorSpecialty(value === "All" ? null : value)}>
                                <DropdownMenuRadioItem value="All">All ({results.doctors.length})</DropdownMenuRadioItem>
                                {comprehensiveSpecialties.map(specialty => (
                                    <DropdownMenuRadioItem key={specialty} value={specialty}>
                                        {specialty} ({doctorSpecialtyCounts[specialty] || 0})
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {activeDoctorSpecialty && (
                        <Button variant="ghost" onClick={() => setActiveDoctorSpecialty(null)}>Clear Filter</Button>
                    )}
                </div>
            </div>
             {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredDoctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />)}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                {activeDoctorSpecialty 
                    ? `No doctors found for the specialization "${activeDoctorSpecialty}".`
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
