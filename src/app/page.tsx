
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, MapPin, Search, Phone, ArrowRight, Video, ScrollText, CalendarCheck, Hospital, BedDouble, HeartPulse } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import Logo from "@/components/layout/Logo";

export default function HomePage() {

  return (
    <div className="w-full space-y-24">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 relative rounded-xl overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-80"></div>
        <div className="container mx-auto px-4 relative z-10">
           <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-white">
            Find Care, Instantly.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Book doctor appointments, check hospital bed availability, and manage all your health records in one place.
          </p>
          <div className="max-w-2xl mx-auto bg-card p-4 rounded-lg shadow-lg">
            <form action="/search" method="GET">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  name="query"
                  placeholder="Search hospitals, clinics, doctors, or specialties..."
                  className="w-full h-14 pl-12 pr-32 rounded-md text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button type="submit" size="lg" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md">
                  Search
                </Button>
              </div>
            </form>
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
