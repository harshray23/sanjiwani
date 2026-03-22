"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Search, ArrowRight, Hospital, Shield, Star, ShieldCheck, HeartPulse, UserPlus, CalendarCheck } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '14', label: 'verified doctors', icon: null },
    { value: '32', label: 'partner hospitals', icon: <UserPlus className="h-6 w-6 text-[#0f4c5c]" /> },
    { value: '200+', label: 'appointments daily', icon: null },
    { value: '4.8/5', label: 'patient rating', icon: null },
  ];

  const scrollingText = "SANJIWANI IS A MODERN AI-POWERED WEB APP DEDICATED TO SIMPLIFYING HEALTHCARE ACCESS";

  return (
    <div className="w-full min-h-screen bg-[#e8f5f3]">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen pt-32 pb-20 px-4 md:px-8 lg:px-16 overflow-hidden">
        {/* Background Decorative elements could go here if needed, but the teal bg is key */}
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <div className="w-full lg:w-3/5 space-y-8 z-10 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-[#0f4c5c] leading-[1.1] tracking-tight font-headline">
                YOUR HEALTH JOURNEY <br/>
                STARTS HERE
              </h1>
              <p className="text-lg md:text-xl text-[#0f4c5c]/80 max-w-2xl leading-relaxed">
                find trusted doctors, book appointments instantly, and get real-time hospital 
                availability. quality healthcare is just a click away.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl bg-white rounded-full p-1.5 shadow-xl border-4 border-[#7abdb4]/30">
              <form action="/search" method="GET" className="relative flex items-center">
                <div className="flex-1 flex items-center px-6">
                  <div className="w-10 h-10 rounded-full bg-[#7abdb4] flex items-center justify-center mr-3 shrink-0">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <Input
                    name="query"
                    placeholder="Search Doctors, Hospitals, Or Specialties."
                    className="border-none focus-visible:ring-0 text-[#0f4c5c] placeholder:text-[#0f4c5c]/40 text-lg h-14 bg-transparent"
                  />
                </div>
                <Button type="submit" size="lg" className="bg-[#7abdb4] hover:bg-[#69a89f] text-white rounded-full h-14 px-10 text-xl font-bold">
                  Search
                </Button>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-white text-[#7abdb4] hover:bg-white/90 rounded-xl h-14 px-8 text-lg font-bold shadow-md">
                <Link href="/search">Book Appointment</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-2 border-white hover:bg-white/10 rounded-xl h-14 px-8 text-lg font-bold">
                <Link href="/emergency">Emergency Verification</Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/40 backdrop-blur-sm rounded-[2rem] p-6 flex flex-col items-center justify-center text-center gap-2 border border-white/50 shadow-sm transition-transform hover:scale-105 duration-300">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner mb-2 shrink-0">
                    {stat.icon || <div className="w-6 h-6 rounded-full bg-white border-2 border-[#0f4c5c]" />}
                  </div>
                  <p className="text-4xl font-black text-[#0f4c5c]">{stat.value}</p>
                  <p className="text-[10px] uppercase font-bold text-[#0f4c5c]/60 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Doctor Image */}
          <div className="w-full lg:w-2/5 relative flex justify-end">
            <div className="relative w-full max-w-[500px] aspect-[4/5] z-0">
              <Image
                src="https://picsum.photos/seed/healthcare-hero/800/1000"
                alt="Smiling healthcare professional"
                fill
                className="object-cover rounded-[3rem] shadow-2xl"
                priority
                data-ai-hint="asian doctor stethoscope"
              />
              {/* Overlays or decorative shapes could be added here to match the mockup's flair */}
            </div>
          </div>
        </div>
      </section>

      {/* Running Text Banner */}
      <div className="w-full bg-[#0f4c5c] py-6 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee">
          <p className="text-2xl md:text-4xl font-black text-white px-4 tracking-wider uppercase opacity-90">
            {scrollingText} &nbsp;&bull;&nbsp; {scrollingText} &nbsp;&bull;&nbsp;
          </p>
          <p className="text-2xl md:text-4xl font-black text-white px-4 tracking-wider uppercase opacity-90">
            {scrollingText} &nbsp;&bull;&nbsp; {scrollingText} &nbsp;&bull;&nbsp;
          </p>
        </div>
      </div>

      {/* Other sections below remain but are styled to fit the new aesthetic */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-[#0f4c5c] mb-12 font-headline uppercase tracking-tight">The Avalanche Trust Protocol</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 text-left border-[#7abdb4]/20 bg-[#e8f5f3]/30 rounded-3xl shadow-lg">
              <ShieldCheck className="h-12 w-12 text-[#7abdb4] mb-4" />
              <h3 className="text-2xl font-black text-[#0f4c5c] mb-2 uppercase">Immutable Verification</h3>
              <p className="text-[#0f4c5c]/70 leading-relaxed">
                When a hospital updates its ICU bed count, a cryptographic hash is anchored to Avalanche. This ensures that availability data cannot be faked or retroactively changed.
              </p>
            </Card>
            <Card className="p-8 text-left border-primary/20 bg-primary/5 rounded-3xl shadow-lg">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-black text-[#0f4c5c] mb-2 uppercase">Incentive Rewards</h3>
              <p className="text-[#0f4c5c]/70 leading-relaxed">
                Patients and community contributors who provide real-time updates on facility status or donate blood are rewarded with Sanjeevani Points, powered by Avalanche smart contracts.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}