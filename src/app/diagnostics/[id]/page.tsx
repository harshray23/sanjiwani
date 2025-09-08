
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDiagnosticsCentreById } from '@/lib/data';
import type { DiagnosticsCentre, DiagnosticTest } from '@/lib/types';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, IndianRupee, Microscope, BookMarked, FlaskConical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';

export default function DiagnosticsCentrePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [centre, setCentre] = useState<DiagnosticsCentre | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState<DiagnosticTest | null>(null);
    const { toast } = useToast();
    
    useEffect(() => {
        if (!id) return;
        const fetchCentre = async () => {
            setIsLoading(true);
            const data = await getDiagnosticsCentreById(id);
            if (data) {
                setCentre(data);
            }
            setIsLoading(false);
        };
        fetchCentre();
    }, [id]);

    const handleBookNow = (test: DiagnosticTest) => {
        // In a real app, this would likely go to a booking/payment page
        toast({
            title: "Booking Initiated",
            description: `You have selected to book the "${test.name}" test.`,
        });
        // For now, just a toast message
        setSelectedTest(test);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>;
    }

    if (!centre) {
        return <div className="text-center py-12">Diagnostics Centre not found.</div>;
    }

    return (
        <div className="container mx-auto py-8">
            {/* Header Card */}
            <Card className="mb-8 shadow-lg">
                 <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 h-52 md:h-auto relative">
                      <Image
                          src={centre.imageUrl}
                          alt={centre.name}
                          fill
                          className="rounded-lg object-cover"
                          data-ai-hint={centre.dataAiHint}
                      />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-4xl font-bold font-headline text-accent mb-2">{centre.name}</h1>
                        <div className="flex items-center gap-4 text-muted-foreground mb-4">
                            <Badge variant="default" className="flex items-center gap-1 text-base p-2">
                                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300"/> {centre.rating.toFixed(1)}
                            </Badge>
                             <span className="flex items-center gap-2">
                                <MapPin className="h-5 w-5"/> {centre.location}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2"><Phone/> {centre.contact.phone}</p>
                            <p className="flex items-center gap-2"><Mail/> {centre.contact.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tests Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline text-accent flex items-center gap-2">
                        <Microscope/> Available Tests
                    </CardTitle>
                    <CardDescription>Select a test to book your appointment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Test Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {centre.tests.map((test) => (
                                <TableRow key={test.id} className={selectedTest?.id === test.id ? 'bg-primary/10' : ''}>
                                    <TableCell className="font-medium">{test.name}</TableCell>
                                    <TableCell>{test.category}</TableCell>
                                    <TableCell className="text-right font-semibold">₹{test.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => handleBookNow(test)} size="sm">
                                           <FlaskConical className="mr-2 h-4 w-4"/> Book Now
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
