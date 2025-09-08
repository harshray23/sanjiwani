

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Search, Phone, ArrowRight, Video, ScrollText, CalendarCheck, Hospital, BedDouble, HeartPulse, Building, Lightbulb, Target, Eye, Rocket, CheckCircle, FlaskConical, Shield, Star } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import Logo from "@/components/layout/Logo";

export default function HomePage() {

  const quickLinks = [
    { href: '/hospitals', label: 'Hospitals', icon: <Hospital className="h-6 w-6"/> },
    { href: '/search', label: 'Doctors', icon: <Stethoscope className="h-6 w-6"/> },
    { href: '/diagnostics', label: 'Labs', icon: <FlaskConical className="h-6 w-6"/> },
    { href: '/search?query=clinic', label: 'Clinics', icon: <Building className="h-6 w-6"/> },
  ];
  
  const stats = [
      { value: '5000+', label: 'Verified Doctors', icon: <Shield className="h-8 w-8 text-primary"/>},
      { value: '200+', label: 'Partner Hospitals', icon: <Hospital className="h-8 w-8 text-primary"/>},
      { value: '1000+', label: 'Appointments Daily', icon: <CalendarCheck className="h-8 w-8 text-primary"/>},
      { value: '4.8/5', label: 'Patient Rating', icon: <Star className="h-8 w-8 text-primary fill-primary"/>},
  ]

  return (
    <div className="w-full space-y-12">
      {/* Hero Section */}
      <section className="relative w-full h-auto md:h-[80vh] flex flex-col items-center justify-center text-center text-white rounded-xl overflow-hidden py-12 md:py-0">
        <Image
            src="/img_hospital.jpg"
            alt="A team of doctors collaborating around a futuristic medical interface"
            fill
            className="object-cover"
            priority
            data-ai-hint="doctors team technology"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
              Your Health Journey <br/> <span className="text-orange-400">Starts Here</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Find trusted doctors, book appointments instantly, and get real-time hospital availability. Quality healthcare is just a click away.
            </p>
             <div className="max-w-2xl mx-auto bg-white/90 dark:bg-card/80 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-2xl">
                <form action="/search" method="GET" className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    name="query"
                    placeholder="Search doctors, hospitals, or specialties..."
                    className="w-full h-12 md:h-14 pl-12 pr-28 md:pr-32 rounded-full text-base md:text-lg border-2 border-transparent focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 hover:shadow-inner text-foreground"
                    />
                    <Button type="submit" size="lg" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full h-10 md:h-12 px-4 md:px-8 glow-on-hover">
                    Search
                    </Button>
                </form>
            </div>
             <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {stats.map((stat) => (
                <Card key={stat.label} className="bg-white/20 dark:bg-card/30 backdrop-blur-md border-white/30 text-white">
                    <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                        {stat.icon}
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm font-light text-white/80">{stat.label}</p>
                    </CardContent>
                </Card>
                ))}
            </div>
             <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="h-12 text-base px-10">
                    <Link href="/search">Book Appointment</Link>
                </Button>
                 <Button asChild size="lg" variant="outline" className="h-12 text-base px-10 bg-white/90 text-primary border-primary hover:bg-white hover:text-primary">
                    <Link href="/hospitals">Find Emergency Care</Link>
                </Button>
            </div>
        </div>
      </section>
      
       {/* How It Works Section */}
      <section id="how-it-works" className="py-16 text-center animate-fade-in-up">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 text-accent">How It Works</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">A seamless experience designed to get you the right care, right when you need it. In just three simple steps.</p>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start">
             {/* Dashed lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
                <svg width="100%" height="100%" className="overflow-visible">
                    <line x1="0" y1="0" x2="100%" y2="0" strokeWidth="2" strokeDasharray="8 8" className="stroke-primary/50" />
                </svg>
            </div>
            
            <div className="relative flex flex-col items-center">
              <div className="bg-primary/10 text-primary rounded-full p-5 mb-4 border-4 border-background shadow-lg z-10">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-headline">1. Find Your Care</h3>
              <p className="text-muted-foreground">Search for hospitals, clinics, or doctors. Filter by specialty and real-time availability.</p>
            </div>
             <div className="relative flex flex-col items-center">
              <div className="bg-primary/10 text-primary rounded-full p-5 mb-4 border-4 border-background shadow-lg z-10">
                <CalendarCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-headline">2. Book Instantly</h3>
              <p className="text-muted-foreground">Select a time slot or reserve a hospital bed with a secure, one-time online payment.</p>
            </div>
             <div className="relative flex flex-col items-center">
              <div className="bg-primary/10 text-primary rounded-full p-5 mb-4 border-4 border-background shadow-lg z-10">
                <HeartPulse className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-headline">3. Manage & Recover</h3>
              <p className="text-muted-foreground">Access e-prescriptions, set medicine reminders, and get cashback on your visit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Section */}
       <section id="mission-vision" className="py-16 bg-muted rounded-lg animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
               <div className="inline-block bg-accent/10 text-accent p-3 rounded-full mb-4">
                  <Eye className="h-8 w-8" />
                </div>
              <h2 className="text-3xl font-bold font-headline text-accent mb-4">Our Vision</h2>
              <p className="text-lg text-muted-foreground">To create a transparent and accessible healthcare ecosystem where every individual has the power to find and receive the best possible care, instantly and without hassle.</p>
            </div>
             <div className="text-center md:text-left">
              <div className="inline-block bg-accent/10 text-accent p-3 rounded-full mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
              <h2 className="text-3xl font-bold font-headline text-accent mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground">To bridge the critical information gap in healthcare by providing a real-time, reliable platform that connects patients with hospitals and doctors, saving lives and reducing stress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section id="problem-solution" className="py-16 animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 p-6 md:p-8 text-center md:text-left">
              <CardHeader className="p-0">
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                    <Lightbulb className="h-10 w-10 text-red-500" />
                  </div>
                  <CardTitle className="text-2xl font-headline text-red-700 dark:text-red-400">The Problem</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-base md:text-lg text-red-800 dark:text-red-300">Patients and their families face immense stress struggling to find real-time information on hospital bed and doctor availability during emergencies.</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 p-6 md:p-8 text-center md:text-left">
              <CardHeader className="p-0">
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 mb-4">
                   <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                    <Target className="h-10 w-10 text-green-500" />
                  </div>
                  <CardTitle className="text-2xl font-headline text-green-700 dark:text-green-400">Our Solution</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-base md:text-lg text-green-800 dark:text-green-300">Sanjiwani Health provides a reliable, centralized platform that connects patients to hospitals <span className="font-semibold text-green-600 dark:text-green-300">instantly</span>, showing verified availability to save precious time.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="py-16 text-center bg-muted rounded-lg animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Phone className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 text-accent">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have questions, feedback, or need assistance? Our team is ready to help. We are also looking for pilot hospitals and partners to join us in transforming healthcare.
          </p>
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
