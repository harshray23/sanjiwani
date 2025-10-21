

"use client";

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchClinicsAndDoctors, comprehensiveSpecialties } from '@/lib/data';
import type { ClinicDetails, DoctorDetails } from '@/lib/types';
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
  const router = useRouter();
  const query = searchParams.get('query') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<{ clinics: ClinicDetails[]; doctors: DoctorDetails[] }>({ clinics: [], doctors: [] });
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeDoctorSpecialty, setActiveDoctorSpecialty] = useState<string | null>(null);
  const [activeClinicFilter, setActiveClinicFilter] = useState<string | null>(null);

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
     router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  }

  const filteredClinics = useMemo(() => {
    if (!activeClinicFilter) {
      return results.clinics;
    }
    if (activeClinicFilter === 'verified') {
      return results.clinics.filter(clinic => clinic.verified);
    }
    return results.clinics;
  }, [results.clinics, activeClinicFilter]);

  const filteredDoctors = useMemo(() => {
    if (!activeDoctorSpecialty) {
      return results.doctors;
    }
    return results.doctors.filter(doctor => doctor.specialization === activeDoctorSpecialty);
  }, [results.doctors, activeDoctorSpecialty]);

  const doctorSpecialtyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const specialties = new Set(results.doctors.map(d => d.specialization));
    specialties.forEach(spec => {
      counts[spec] = results.doctors.filter(d => d.specialization === spec).length;
    });
    return counts;
  }, [results.doctors]);

  const sortedSpecialties = useMemo(() => {
    return Object.keys(doctorSpecialtyCounts).sort((a,b) => a.localeCompare(b));
  },[doctorSpecialtyCounts])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2 text-accent">Search Results</h1>
        <p className="text-lg text-muted-foreground">Find the best clinics and doctors for your needs.</p>
        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors, specialties, or clinics..."
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
                              {activeClinicFilter ? 'Verified Clinics' : "Filter Clinics"}
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64">
                          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup value={activeClinicFilter || "all"} onValueChange={(value) => setActiveClinicFilter(value === "all" ? null : value)}>
                              <DropdownMenuRadioItem value="all">All ({results.clinics.length})</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="verified">
                                  Verified ({results.clinics.filter(c => c.verified).length})
                              </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                  </DropdownMenu>
                  {activeClinicFilter && (
                      <Button variant="ghost" onClick={() => setActiveClinicFilter(null)}>Clear Filter</Button>
                  )}
              </div>
            </div>
            {filteredClinics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredClinics.map(clinic => <ClinicCard key={clinic.id} clinic={clinic} />)}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                No clinics found matching your criteria.
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
                                {sortedSpecialties.map(specialty => (
                                    doctorSpecialtyCounts[specialty] > 0 &&
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
