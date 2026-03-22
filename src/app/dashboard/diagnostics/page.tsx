"use client";

import { useEffect, useState } from 'react';
import { getDiagnosticsCentreById, getTestAppointmentsForCentre } from '@/lib/data';
import type { DiagnosticsCentre, TestAppointment, User as AppUser } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { UserPlus, Download, Upload, PlusCircle, Pencil, Trash2, LogIn, ShieldAlert, Activity, Loader2 } from "lucide-react";
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useUser } from '@/firebase';

const DiagnosticsDashboard = () => {
  const { user: userProfile, loading: authLoading } = useUser();
  const [centre, setCentre] = useState<DiagnosticsCentre | null>(null);
  const [appointments, setAppointments] = useState<TestAppointment[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
        if (authLoading) return;

        if (userProfile && userProfile.role === 'diagnostics_centres') {
            try {
                // Mock: Assume user's diagnostics centre is their UID
                const centreId = userProfile.uid; 
                const [centreData, appointmentData] = await Promise.all([
                  getDiagnosticsCentreById(centreId),
                  getTestAppointmentsForCentre(centreId)
                ]);
                
                setCentre(centreData || null);
                setAppointments(appointmentData || []);
            } catch(error) {
                console.error("Error fetching diagnostics data:", error);
                toast({ title: "Error", description: "Could not load diagnostics data.", variant: "destructive"});
                setCentre(null);
            } finally {
                setIsDataLoading(false);
            }
        } else {
            setCentre(null);
            setIsDataLoading(false);
        }
    };
    fetchData();
  }, [userProfile, authLoading, toast]);
  
  const handleAction = (action: string, entity: string, id: string) => {
    toast({
        title: "Action Mocked",
        description: `This would ${action} the ${entity} with ID: ${id}.`,
    });
  }

  const getStatusBadgeVariant = (status: TestAppointment['status']) => {
    switch (status) {
      case 'Report Ready': return 'default';
      case 'Completed': return 'secondary';
      case 'Scheduled': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
  }

  if (authLoading || isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Diagnostics Dashboard...</p>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== 'diagnostics_centres') {
    return (
      <div className="text-center p-8">
        <Card className="max-w-md mx-auto p-8 mt-20">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold font-headline text-destructive">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">
              You must be logged in as a diagnostics centre administrator.
            </p>
            <Button asChild className="mt-6">
              <Link href="/login"><LogIn className="mr-2"/>Go to Login</Link>
            </Button>
        </Card>
      </div>
    );
  }

  if (!centre) {
     return (
         <div className="text-center p-8">
            <Card className="max-w-md mx-auto p-8 mt-20">
                <h2 className="text-2xl font-bold font-headline text-destructive">Profile Not Found</h2>
                <p className="mt-2 text-muted-foreground">We couldn't find a diagnostics centre profile associated with your account.</p>
                <Button asChild className="mt-6" variant="outline">
                    <Link href="/">Back to Home</Link>
                </Button>
            </Card>
        </div>
    )
  }

  return (
    <div className="py-12 w-full max-w-7xl mx-auto">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-bold font-headline text-accent">Diagnostics Dashboard</h1>
        <p className="text-lg text-muted-foreground">Managing {centre.name}</p>
      </div>

       <Tabs defaultValue="appointments">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
          <TabsTrigger value="tests">Available Tests ({centre.tests?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="reports">Test Reports</TabsTrigger>
          <TabsTrigger value="staff">Manage Staff ({centre.pathologists?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="profile">Centre Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Patient Appointments</CardTitle>
                    <CardDescription>Manage all scheduled tests for your centre.</CardDescription>
                </CardHeader>
                <CardContent>
                    {appointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Test Booked</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map(app => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium">{app.patientName}</TableCell>
                                        <TableCell>{app.test?.name ?? 'Test'}</TableCell>
                                        <TableCell>{format(new Date(app.date), 'PPp')}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No appointments found.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="tests">
             <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="font-headline">Manage Available Tests</CardTitle>
                        <CardDescription>Add, view, or remove diagnostic tests offered.</CardDescription>
                    </div>
                    <Button onClick={() => handleAction('add', 'test', '')}><PlusCircle className="mr-2"/> Add New Test</Button>
                </CardHeader>
                <CardContent>
                     {centre.tests && centre.tests.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Test Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {centre.tests.map(test => (
                                    <TableRow key={test.id}>
                                        <TableCell className="font-medium">{test.name}</TableCell>
                                        <TableCell>{test.category}</TableCell>
                                        <TableCell className="text-right">₹{test.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleAction('edit', 'test', test.id)}><Pencil className="h-4 w-4"/></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleAction('remove', 'test', test.id)}><Trash2 className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                     ) : (
                        <p className="text-center text-muted-foreground py-8">No tests available.</p>
                     )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="reports">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Manage Test Reports</CardTitle>
                    <CardDescription>View completed tests and upload patient reports.</CardDescription>
                </CardHeader>
                <CardContent>
                    {appointments.filter(a => a.status === 'Completed' || a.status === 'Report Ready').length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Test</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.filter(a => a.status === 'Completed' || a.status === 'Report Ready').map(app => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium">{app.patientName}</TableCell>
                                        <TableCell>{app.test?.name ?? 'Test'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {app.reportUrl ? (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={app.reportUrl} target="_blank"><Download className="mr-2 h-4 w-4"/> View Report</Link>
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" size="sm" onClick={() => handleAction('upload report for', 'appointment', app.id)}>
                                                    <Upload className="mr-2 h-4 w-4"/> Upload Report
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No reports pending or ready.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="staff">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="font-headline">Manage Staff</CardTitle>
                        <CardDescription>Add or remove pathologists and technicians.</CardDescription>
                    </div>
                     <Button onClick={() => handleAction('add', 'staff member', '')}><UserPlus className="mr-2"/> Add Staff Member</Button>
                </CardHeader>
                <CardContent>
                    {centre.pathologists && centre.pathologists.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Qualifications</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {centre.pathologists.map(staff => (
                                    <TableRow key={staff.id}>
                                        <TableCell className="font-medium flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={staff.imageUrl}/>
                                                <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {staff.name}
                                        </TableCell>
                                        <TableCell>{staff.qualifications?.join(', ') ?? 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleAction('edit', 'staff', staff.id)}><Pencil className="h-4 w-4"/></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleAction('remove', 'staff', staff.id)}><Trash2 className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No staff listed.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="profile">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Centre Profile</CardTitle>
                    <CardDescription>Update your diagnostics centre's public details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-2">
                             <label className="font-semibold">Centre Image</label>
                             <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                                {centre.imageUrl ? (
                                    <Image 
                                        src={centre.imageUrl} 
                                        alt={centre.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <Activity className="h-12 w-12 text-muted-foreground" />
                                )}
                             </div>
                              <Button className="w-full mt-2" variant="outline" onClick={() => toast({title: "Feature coming soon!"})}>
                                <Upload className="mr-2 h-4 w-4"/>
                                Upload New Photo
                            </Button>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                             <div className="space-y-2">
                                <label className="font-semibold">Centre Name</label>
                                <Input defaultValue={centre.name} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-semibold">Contact Phone</label>
                                <Input defaultValue={centre.contact?.phone ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-semibold">Contact Email</label>
                                <Input defaultValue={centre.contact?.email ?? ''} />
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => toast({title: 'Profile Updated!'})}>Update Information</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagnosticsDashboard;
