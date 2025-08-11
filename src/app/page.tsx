
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, MapPin, Calendar, Search, Sparkles, Phone, ArrowRight } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

export default function HomePage() {

  return (
    <div className="w-full space-y-24">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-primary">
            Find Care, Instantly.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Book doctor appointments with ease. Get priority service and discounts on medicines for a small platform fee.
          </p>
          <div className="max-w-2xl mx-auto bg-card p-4 rounded-lg shadow-lg">
            <form action="/search" method="GET">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  name="query"
                  placeholder="Search by clinic, doctor, or specialty..."
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
             <p className="text-lg text-muted-foreground mt-2">Get from searching to seated in just 3 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">1. Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Find the right doctor or clinic for you by specialty and location.</p>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">2. Book & Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Choose a convenient slot and pay the consultation & platform fee securely.</p>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                   <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">3. Get Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Receive a priority token and enjoy discounts on medicines at the clinic.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="video-tour" className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
           <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 text-primary">
                Discover Our Services
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                See how HospConnect is revolutionizing the way you access healthcare. Our platform is designed to be simple, transparent, and patient-focused.
              </p>
              <Button asChild size="lg">
                <Link href="/search">Find a Doctor Now <ArrowRight className="ml-2 h-5 w-5"/></Link>
              </Button>
           </div>
           <div className="aspect-video bg-muted rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
             {/* You can replace this with an <iframe /> from YouTube/Vimeo or a <video /> tag */}
             <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Your video will be displayed here.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="py-16 text-center bg-primary/5 rounded-lg">
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
          <Button asChild size="lg" variant="outline" className="bg-card">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
