
"use client";

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getClinics } from '@/lib/data';
import type { ClinicDetails, DoctorDetails } from '@/lib/types';
import { ClinicCard } from '@/components/ClinicCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon, Filter, Building, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function ClinicSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [allClinics, setAllClinics] = useState<ClinicDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const allClinicsData = await getClinics();
      setAllClinics(allClinicsData);
      setIsLoading(false);
    };
    fetchResults();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // This is for client-side filtering, so we don't need to push to router
    // The filtering is handled by the `filteredClinics` memo
  };

  const uniqueSpecialties = useMemo(() => {
      const specialties = new Set<string>();
      allClinics.forEach(clinic => {
          clinic.doctors.forEach(doctor => {
              specialties.add(doctor.specialization);
          });
      });
      return Array.from(specialties).sort();
  }, [allClinics]);

  const filteredClinics = useMemo(() => {
    let results = allClinics;

    if (verifiedOnly) {
      results = results.filter(clinic => clinic.verified);
    }
    
    if (activeSpecialty) {
        results = results.filter(clinic => 
            clinic.doctors.some(doctor => doctor.specialization === activeSpecialty)
        );
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (lowerCaseQuery) {
        results = results.filter(clinic => 
            clinic.name.toLowerCase().includes(lowerCaseQuery) ||
            clinic.address.toLowerCase().includes(lowerCaseQuery)
        );
    }

    return results;
  }, [allClinics, searchQuery, verifiedOnly, activeSpecialty]);


  return (
    <div className="w-full max-w-7xl mx-auto py-8">
       <Card className="mb-8 shadow-lg bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
            <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-4">
                <Building className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-3xl font-headline text-accent">Find a Clinic</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">Search for clinics by name, location, or available specialists.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by clinic name or location..."
                    className="h-12 text-base"
                />
                <Button type="submit" size="lg" disabled={isLoading}>
                    <SearchIcon />
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
           <div className="my-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="verified-filter"
                  checked={verifiedOnly}
                  onCheckedChange={setVerifiedOnly}
                />
                <Label htmlFor="verified-filter">Show Verified Only</Label>
              </div>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                          <Stethoscope className="mr-2 h-4 w-4"/>
                          {activeSpecialty || "Filter by Specialty"}
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                      <DropdownMenuLabel>Filter by Specialty</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={activeSpecialty || "All"} onValueChange={(value) => setActiveSpecialty(value === "All" ? null : value)}>
                          <DropdownMenuRadioItem value="All">All Specialties</DropdownMenuRadioItem>
                          {uniqueSpecialties.map(specialty => (
                              <DropdownMenuRadioItem key={specialty} value={specialty}>
                                  {specialty}
                              </DropdownMenuRadioItem>
                          ))}
                      </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
              </DropdownMenu>
              {(verifiedOnly || activeSpecialty) && (
                <Button 
                    variant="ghost" 
                    onClick={() => {
                        setVerifiedOnly(false);
                        setActiveSpecialty(null);
                    }}
                >
                    Clear Filters
                </Button>
              )}
            </div>
          {filteredClinics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClinics.map(clinic => (
                <ClinicCard key={clinic.id} clinic={clinic} />
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-muted-foreground bg-card rounded-lg shadow-md">
                {searchQuery || verifiedOnly || activeSpecialty
                    ? `No clinics found matching your criteria.`
                    : "No clinics found."
                }
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ClinicsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>}>
            <ClinicSearch />
        </Suspense>
    );
}
