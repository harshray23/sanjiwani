
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Search, Phone, ArrowRight, Video, ScrollText, CalendarCheck, Hospital, BedDouble, HeartPulse, Building, Lightbulb, Target } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import Logo from "@/components/layout/Logo";

export default function HomePage() {

  const quickLinks = [
    { href: '/hospitals', label: 'Hospitals', icon: <Hospital /> },
    { href: '/search', label: 'Doctors', icon: <Stethoscope /> },
    { href: '/appointments', label: 'Appointments', icon: <CalendarCheck /> },
    { href: '/search?query=clinic', label: 'Clinics', icon: <Building /> },
  ];

  return (
    <div className="w-full space-y-24">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50">
         <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-8 items-center">
           <div className="text-left animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-primary">
              Find Care, Instantly.
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-xl">
              Book doctor appointments, check hospital bed availability, and manage all your health records in one place.
            </p>
           </div>
           <div className="relative h-64 md:h-96">
                <Image
                    src="https://picsum.photos/seed/hero/600/400"
                    alt="Healthcare professional assisting a patient"
                    fill
                    className="object-contain"
                    data-ai-hint="doctor patient illustration"
                />
            </div>
        </div>
      </section>

      {/* Search & Quick Links Section */}
      <section className="container mx-auto px-4 -mt-36 relative z-20">
          <div className="max-w-3xl mx-auto bg-card p-4 rounded-full shadow-2xl">
            <form action="/search" method="GET">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  name="query"
                  placeholder="Search hospitals, clinics, doctors, specialties..."
                  className="w-full h-16 pl-14 pr-32 rounded-full text-lg border-2 border-transparent focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 hover:shadow-inner"
                />
                <Button type="submit" size="lg" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full h-12 px-8 glow-on-hover">
                  Find Care Now
                </Button>
              </div>
            </form>
          </div>
           <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {quickLinks.map((link) => (
              <Button key={link.href} asChild variant="outline" size="lg" className="h-16 text-base bg-card hover:bg-muted transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border-primary/20">
                <Link href={link.href} className="flex flex-col md:flex-row items-center justify-center gap-2">
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>
      </section>
      
       {/* Problem vs Solution Section */}
      <section id="problem-solution" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 p-8 text-center md:text-left">
              <CardHeader className="p-0">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <Lightbulb className="h-10 w-10 text-red-500" />
                  <CardTitle className="text-2xl font-headline text-red-700 dark:text-red-400">The Problem</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-red-800 dark:text-red-300">Patients and their families face immense stress struggling to find real-time information on hospital bed and doctor availability during emergencies.</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 p-8 text-center md:text-left">
              <CardHeader className="p-0">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <Target className="h-10 w-10 text-green-500" />
                  <CardTitle className="text-2xl font-headline text-green-700 dark:text-green-400">Our Solution</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-green-800 dark:text-green-300">Sanjiwani Health provides a reliable, centralized platform that connects patients to hospitals instantly, showing verified availability to save precious time.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-muted rounded-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
              A Seamless Experience
            </h2>
             <p className="text-lg text-muted-foreground mt-2">From finding emergency care to managing your health journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <Hospital className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">1. Find a Hospital or Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Search for top hospitals and specialists. Check real-time bed availability in emergencies.</p>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <BedDouble className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">2. Book Your Slot or Bed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Book a consultation slot or reserve a hospital bed instantly with a secure online payment.</p>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                   <HeartPulse className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">3. Manage Your Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Upload prescriptions for cashback, set medicine reminders, and manage all your records.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
              Comprehensive Healthcare, All in One Place
            </h2>
            <p className="text-lg text-muted-foreground mt-2">Access a full suite of healthcare services from anywhere, anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-accent/10 p-4 rounded-full w-fit mb-4">
                  <Video className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline text-xl">Video & In-Person Consults</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Connect with doctors via secure video calls or book in-person appointments at clinics and hospitals.</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-accent/10 p-4 rounded-full w-fit mb-4">
                  <ScrollText className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline text-xl">E-Prescriptions & Cashback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Receive digital prescriptions and upload them after your visit to earn cashback and medicine discounts.</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-accent/10 p-4 rounded-full w-fit mb-4">
                  <CalendarCheck className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline text-xl">Smart Health Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Get automated reminders for appointments and medications. Keep all your health records in one secure place.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="py-16 text-center bg-muted rounded-lg">
        <div className="container mx-auto px-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Phone className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 text-primary">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have questions, feedback, or need assistance? Our team is ready to help. Reach out to us today!
          </p>
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
