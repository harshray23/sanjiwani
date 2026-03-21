
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Search, Phone, ArrowRight, Video, ScrollText, CalendarCheck, Hospital, BedDouble, HeartPulse, Building, Lightbulb, Target, Eye, Rocket, CheckCircle, FlaskConical, Shield, Star, Microscope, ShieldCheck, Coins } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ['/h1.jpg', '/h2.jpg', '/h3.jpg', '/img_hospital.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);


  const quickAccessLinks = [
    { href: '/search', label: 'Find Doctors', description: 'Consult with verified specialists', icon: <Stethoscope className="h-8 w-8 text-orange-500"/>, hoverClass: 'hover-orange' },
    { href: '/hospitals', label: 'Hospitals', description: 'Real-time bed availability', icon: <Hospital className="h-8 w-8 text-blue-500"/>, hoverClass: 'hover-blue' },
    { href: '/diagnostics', label: 'Diagnostics', description: 'Book lab tests & health checkups', icon: <Microscope className="h-8 w-8 text-green-500"/>, hoverClass: 'hover-green' },
    { href: '/emergency', label: 'Emergency', description: '24/7 emergency services', icon: <HeartPulse className="h-8 w-8 text-red-500"/>, hoverClass: 'hover-red' },
  ];
  
  const stats = [
      { value: '14', label: 'Verified Doctors', icon: <Shield className="h-8 w-8 text-primary"/>},
      { value: 'Avalanche', label: 'Trust Layer', icon: <ShieldCheck className="h-8 w-8 text-primary"/>},
      { value: '200+', label: 'Appointments Daily', icon: <CalendarCheck className="h-8 w-8 text-primary"/>},
      { value: '4.8/5', label: 'Patient Rating', icon: <Star className="h-8 w-8 text-primary fill-primary"/>},
  ]

  const quote = "We don’t use blockchain for storing healthcare data—that would be inefficient. Instead, we use Avalanche as a verification layer to ensure that critical hospital data like ICU beds and blood availability cannot be tampered with. This creates trust in a system where misinformation can cost lives.";

  return (
    <div className="w-full space-y-20">
      {/* Hero Section */}
      <section className="relative w-full h-auto md:h-[80vh] flex flex-col items-center justify-center text-center text-white rounded-xl overflow-hidden py-12 md:py-0">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt="A team of doctors collaborating"
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
            priority={index === 0}
            data-ai-hint="doctors team technology"
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
              Your Health Journey <br/> <span className="text-orange-400">Powered by Trust</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Find trusted doctors and real-time hospital availability verified on the **Avalanche Blockchain**. Quality healthcare, anchored in truth.
            </p>
             <div className="max-w-2xl mx-auto bg-white/90 dark:bg-card/80 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-2xl transition-all duration-300 hover:shadow-primary/40 hover:shadow-2xl hover:-translate-y-1">
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
                <Card key={stat.label} className="bg-white/20 dark:bg-card/30 backdrop-blur-md border-white/30 text-white transition-all duration-300 hover:bg-white/30 hover:scale-105 hover:shadow-lg">
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
                    <Link href="/emergency">Emergency Verification</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Trust & Incentives Section */}
      <section id="blockchain-layer" className="py-16 text-center animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-4">Verification Layer</div>
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 text-accent">The Avalanche Trust Protocol</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            We use Avalanche to create a tamper-proof audit trail of healthcare data. In high-stakes medical emergencies, misinformation is fatal.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 text-left border-accent/20 bg-accent/5">
              <ShieldCheck className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-2xl font-bold mb-2">Immutable Verification</h3>
              <p className="text-muted-foreground">
                When a hospital updates its ICU bed count, a cryptographic hash is anchored to Avalanche. This ensures that availability data cannot be faked or retroactively changed.
              </p>
            </Card>
            <Card className="p-8 text-left border-primary/20 bg-primary/5">
              <Coins className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Incentive Rewards</h3>
              <p className="text-muted-foreground">
                Patients and community contributors who provide real-time updates on facility status or donate blood are rewarded with Sanjeevani Points, powered by Avalanche smart contracts.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Running Text Animation Section */}
       <div className="bg-primary/10 text-primary-foreground dark:text-primary-foreground font-semibold overflow-hidden whitespace-nowrap relative h-10 flex items-center">
        <div className="absolute flex">
            <p className="animate-marquee py-2 text-primary">
                <span className="mx-16 uppercase tracking-widest">{quote}</span>
            </p>
             <p className="animate-marquee py-2 text-primary" aria-hidden="true">
                <span className="mx-16 uppercase tracking-widest">{quote}</span>
            </p>
        </div>
      </div>
      
       {/* How It Works Section */}
      <section id="how-it-works" className="py-16 text-center animate-fade-in-up">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 text-accent">How It Works</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">A seamless experience designed to get you the right care, right when you need it.</p>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start">
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
              <p className="text-muted-foreground">Search for hospitals or doctors. Filter by specialty and Avalanche-verified availability.</p>
            </div>
             <div className="relative flex flex-col items-center">
              <div className="bg-primary/10 text-primary rounded-full p-5 mb-4 border-4 border-background shadow-lg z-10">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-headline">2. Trust the Proof</h3>
              <p className="text-muted-foreground">Check the blockchain anchor to confirm the data is current and tamper-proof.</p>
            </div>
             <div className="relative flex flex-col items-center">
              <div className="bg-primary/10 text-primary rounded-full p-5 mb-4 border-4 border-background shadow-lg z-10">
                <Coins className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-headline">3. Verify & Earn</h3>
              <p className="text-muted-foreground">Visit the clinic and earn community rewards for verifying the resource availability.</p>
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
              <p className="text-lg text-muted-foreground">To create a transparent and accessible healthcare ecosystem where decentralized trust empowers individuals to find care without misinformation.</p>
            </div>
             <div className="text-center md:text-left">
              <div className="inline-block bg-accent/10 text-accent p-3 rounded-full mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
              <h2 className="text-3xl font-bold font-headline text-accent mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground">To bridge the critical information gap in healthcare using the Avalanche blockchain as a verification layer, saving lives through data integrity.</p>
            </div>
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
            Ready to integrate Avalanche into your medical facility? Our team is looking for pilot hospitals to join our decentralized trust network.
          </p>
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
