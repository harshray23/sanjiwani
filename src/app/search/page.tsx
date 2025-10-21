

"use client";

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchClinicsAndDoctors, comprehensiveSpecialties } from '@/lib/data';
import type { ClinicDetails, DoctorDetails } from '@/lib/types';
import { DoctorCard } from '@/components/DoctorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon, Filter, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeDoctorSpecialty, setActiveDoctorSpecialty] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      // We still call the combined search but only use the doctors part
      const data = await searchClinicsAndDoctors(query);
      setDoctors(data.doctors);
      setIsLoading(false);
    };
    fetchResults();
  }, [query]);
  
  const handleSearch = (e: React.FormEvent) => {
     e.preventDefault();
     router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  }

  const filteredDoctors = useMemo(() => {
    if (!activeDoctorSpecialty) {
      return doctors;
    }
    return doctors.filter(doctor => doctor.specialization === activeDoctorSpecialty);
  }, [doctors, activeDoctorSpecialty]);

  const doctorSpecialtyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const specialties = new Set(doctors.map(d => d.specialization));
    specialties.forEach(spec => {
      counts[spec] = doctors.filter(d => d.specialization === spec).length;
    });
    return counts;
  }, [doctors]);

  const sortedSpecialties = useMemo(() => {
    return Object.keys(doctorSpecialtyCounts).sort((a,b) => a.localeCompare(b));
  },[doctorSpecialtyCounts])

  return (
    <div className="container mx-auto py-8">
       <Card className="mb-8 shadow-lg bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
            <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-4">
                <Stethoscope className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-3xl font-headline text-accent">Find a Doctor</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">Search for verified specialists and book appointments.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-2xl mx-auto">
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name or specialty..."
                className="h-12 text-base"
              />
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <SearchIcon />}
              </Button>
            </form>
        </CardContent>
       </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
           <Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" />
        </div>
      ) : (
        <div>
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
                                <DropdownMenuRadioItem value="All">All ({doctors.length})</DropdownMenuRadioItem>
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
          </div>
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
