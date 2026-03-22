
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShieldCheck, Link as LinkIcon, Calendar, Star, Mic, Brain } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { value: '14', label: 'Verified Doctors', icon: <ShieldCheck className="h-6 w-6 text-accent" /> },
    { value: 'Avalanche', label: 'Trust Layer', icon: <LinkIcon className="h-6 w-6 text-accent" /> },
    { value: '200+', label: 'Appointments Daily', icon: <Calendar className="h-6 w-6 text-orange-500" /> },
    { value: '4.8/5', label: 'Patient Rating', icon: <Star className="h-6 w-6 text-yellow-400 fill-current" /> },
  ];

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[#020817]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
      </div>

      <section className="relative z-10 pt-40 pb-20 px-4 flex flex-col items-center justify-center text-center">
        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-1000">
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none text-white font-headline">
              Your Health Journey <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Powered by AI Trust Layer</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Find trusted doctors and real-time hospital availability verified on the <br/>
              <span className="text-white font-bold">**Avalanche Blockchain**</span>. Quality healthcare, anchored in truth.
            </p>
          </div>

          {/* Glowing Search Bar */}
          <div className="relative group max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-orange-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <form onSubmit={handleSearch} className="relative glass-morphism rounded-full p-2 flex items-center gap-2">
              <div className="flex-1 flex items-center px-4">
                <Brain className="h-6 w-6 text-accent mr-3" />
                <div className="h-6 w-px bg-white/10 mr-3" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, hospitals, or symptoms..."
                  className="bg-transparent border-none focus-visible:ring-0 text-white text-lg h-12 placeholder:text-white/30"
                />
              </div>
              <Button type="button" size="icon" variant="ghost" className="rounded-full text-white/50 hover:text-accent">
                <Mic className="h-5 w-5" />
              </Button>
              <Button type="submit" size="icon" className="bg-accent text-black rounded-full h-12 w-12 neon-glow-cyan hover:scale-105 transition-transform">
                <Search className="h-6 w-6" />
              </Button>
            </form>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 animate-in fade-in duration-1000 delay-500">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-morphism rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/15 transition-all duration-300 group cursor-default">
                <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-white/40 font-bold">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-12 animate-in fade-in duration-1000 delay-700">
            <Button asChild size="lg" className="btn-gradient-orange rounded-full h-14 px-10 text-xl font-black neon-glow-orange">
              <Link href="/search">Book Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass-morphism border-red-500/50 text-white hover:bg-red-500/10 rounded-full h-14 px-10 text-xl font-black">
              <Link href="/emergency">Emergency Verification</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Decorative Elements Footer */}
      <div className="fixed bottom-8 right-8 z-20 pointer-events-none opacity-20">
        <Image src="/logo.jpg" alt="Watermark" width={100} height={100} className="grayscale invert" />
      </div>
    </div>
  );
}
