
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getHospitalById } from '@/lib/data';
import type { Hospital, User } from '@/lib/types';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BedDouble, Building, Check, Clock, Hospital as HospitalIcon, Info, Loader2, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

function BedAvailabilityDetail({ label, available, total }: { label: string, available: number, total: number }) {
    const isAvailable = available > 0;
    return (
        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="font-medium flex items-center gap-2"><BedDouble className={`w-5 h-5 ${isAvailable ? 'text-green-500' : 'text-destructive'}`} /> {label}</span>
            <span className={`font-bold text-lg ${isAvailable ? 'text-green-600' : 'text-destructive'}`}>{available} <span className="text-sm font-normal text-muted-foreground">/ {total}</span></span>
        </div>
    )
}

export default function HospitalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [selectedBed, setSelectedBed] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchHospital = async () => {
            setIsLoading(true);
            const data = await getHospitalById(id);
            if (data) {
                setHospital(data);
            }
            setIsLoading(false);
        };
        fetchHospital();
        
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

    }, [id]);

    const handleBedSelection = (bedType: string) => {
        const bedInfo = hospital?.beds[bedType as keyof typeof hospital.beds];
        if (bedInfo && bedInfo.available > 0) {
            setSelectedBed(bedType);
        } else {
            toast({
                title: "Bed Not Available",
                description: `There are no available beds in the ${bedType} category.`,
                variant: "destructive"
            });
        }
    }

    const handleConfirmBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please log in to reserve a bed.",
            });
            router.push('/login');
            return;
        }

        if (!selectedBed) {
            toast({
                title: "Select a Bed Type",
                description: "Please choose a bed category to proceed.",
                variant: "destructive"
            });
            return;
        }

        setIsBooking(true);
        // Simulate booking process
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsBooking(false);

        toast({
            title: "Bed Reserved Successfully!",
            description: `Your ${selectedBed} bed at ${hospital?.name} has been reserved for the next 2 hours.`,
        });

        // Redirect to a confirmation page or dashboard
        router.push('/appointments');
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>;
    }

    if (!hospital) {
        return (
            <Card className="w-full max-w-2xl mx-auto text-center p-8">
                <CardTitle className="text-2xl text-destructive">Hospital Not Found</CardTitle>
                <CardDescription>The hospital you are looking for does not exist or could not be loaded.</CardDescription>
                <Button asChild className="mt-4"><a href="/hospitals">Go Back</a></Button>
            </Card>
        );
    }
    
    const bedTypes = Object.keys(hospital.beds).filter(type => hospital.beds[type as keyof typeof hospital.beds].total > 0);


    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <Card className="shadow-xl">
                 <CardHeader className="p-0">
                    <div className="w-full h-64 relative">
                        <Image
                            src={hospital.imageUrl || `https://picsum.photos/seed/${hospital.id}/1200/400`}
                            alt={hospital.name}
                            fill
                            className="object-cover rounded-t-lg"
                            data-ai-hint={hospital.dataAiHint || 'hospital building'}
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                         <div className="absolute bottom-0 left-0 p-6">
                            <h1 className="text-3xl md:text-4xl font-bold font-headline text-white">{hospital.name}</h1>
                             <p className="text-white/90 flex items-center gap-2 mt-1"><MapPin className="w-5 h-5"/> {hospital.location.address}</p>
                         </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="md:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold font-headline text-accent mb-3">Reserve a Bed</h2>
                             <form onSubmit={handleConfirmBooking} className="space-y-6">
                                <div className="space-y-4">
                                    <Label className="font-semibold text-base">1. Select Bed Type</Label>
                                    <RadioGroup value={selectedBed || ''} onValueChange={handleBedSelection} className="grid grid-cols-2 gap-4">
                                        {bedTypes.map(type => {
                                            const bed = hospital.beds[type as keyof typeof hospital.beds];
                                            const isDisabled = bed.available === 0;
                                            return (
                                                <div key={type}>
                                                    <RadioGroupItem value={type} id={type} className="sr-only" disabled={isDisabled} />
                                                    <Label htmlFor={type} className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${selectedBed === type ? 'border-primary bg-primary/10' : 'border-muted'} ${isDisabled ? 'cursor-not-allowed opacity-50 bg-muted/80' : ''}`}>
                                                        <BedDouble className="w-8 h-8 mb-2"/>
                                                        <span className="font-bold capitalize">{type}</span>
                                                        <span className={`text-sm ${isDisabled ? 'text-destructive' : 'text-muted-foreground'}`}>{bed.available} / {bed.total} beds</span>
                                                    </Label>
                                                </div>
                                            )
                                        })}
                                    </RadioGroup>
                                </div>

                                <div className="space-y-4">
                                    <Label className="font-semibold text-base">2. Patient Details</Label>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input placeholder="Patient's Full Name" required/>
                                        <Input placeholder="Patient's Age" type="number" required/>
                                     </div>
                                     <Input placeholder="Contact Number" type="tel" required/>
                                </div>
                                <Button type="submit" className="w-full h-12 text-lg" disabled={isBooking || !selectedBed}>
                                    {isBooking ? <Loader2 className="animate-spin mr-2"/> : <Check className="mr-2"/>}
                                    {isBooking ? "Reserving..." : "Confirm & Reserve Bed"}
                                </Button>
                                 <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2"><Info className="h-4 w-4"/>Your reservation is valid for 2 hours. Admission formalities must be completed at the hospital.</p>
                             </form>
                        </div>
                   </div>

                    <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-bold font-headline text-accent mb-3 flex items-center gap-2"><HospitalIcon /> About Hospital</h3>
                             <div className="text-sm text-muted-foreground space-y-2">
                                <p className="flex items-center gap-2"><Phone/> {hospital.contact}</p>
                                {hospital.specialties.slice(0,4).map(s => <p key={s} className="flex items-center gap-2"><Building/> {s}</p>)}
                            </div>
                        </div>

                         <Separator/>
                        
                        <div>
                            <h3 className="text-lg font-bold font-headline text-accent mb-3 flex items-center gap-2"><Clock/> Bed Status</h3>
                            <div className="space-y-2">
                                <BedAvailabilityDetail label="General Ward" available={hospital.beds.general.available} total={hospital.beds.general.total}/>
                                <BedAvailabilityDetail label="ICU" available={hospital.beds.icu.available} total={hospital.beds.icu.total}/>
                                <BedAvailabilityDetail label="Oxygen Beds" available={hospital.beds.oxygen.available} total={hospital.beds.oxygen.total}/>
                                <BedAvailabilityDetail label="Ventilator" available={hospital.beds.ventilator.available} total={hospital.beds.ventilator.total}/>
                            </div>
                             <p className="text-xs text-muted-foreground mt-2">Last updated: {new Date(hospital.lastUpdated).toLocaleTimeString()}</p>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

    