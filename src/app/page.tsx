
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Link as LinkIcon, Calendar, Star, Mic, Brain, Zap } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
    { value: '14', label: 'Verified Doctors', icon: <ShieldCheck className="h-6 w-6 text-accent" />, glow: 'cyan' },
    { value: 'Avalanche', label: 'Trust Layer', icon: <LinkIcon className="h-6 w-6 text-accent" />, glow: 'cyan' },
    { value: '200+', label: 'Appointments Daily', icon: <Calendar className="h-6 w-6 text-orange-500" />, glow: 'orange' },
    { value: '4.8/5', label: 'Patient Rating', icon: <Star className="h-6 w-6 text-yellow-400 fill-current" />, glow: 'orange' },
  ];

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-black">
      {/* Immersive Background Image */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/h3.jpg" 
          alt="Healthcare Background" 
          fill 
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <section className="relative z-10 pt-48 pb-20 px-4 flex flex-col items-center justify-center text-center">
        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-1000">
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight text-white font-headline drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              Your Health Journey <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Powered by AI Trust Layer</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
              Find trusted doctors and real-time hospital availability verified on the <br/>
              <span className="text-white font-bold border-b border-accent/50 pb-1">Avalanche Blockchain</span>. Quality healthcare, anchored in truth.
            </p>
          </div>

          {/* Glowing Search Bar */}
          <div className="relative group max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <form onSubmit={handleSearch} className="relative glass-morphism neon-glow-cyan rounded-full p-2 flex items-center gap-2">
              <div className="flex-1 flex items-center px-4">
                <div className="p-2 rounded-full bg-accent/10 mr-3">
                    <Brain className="h-6 w-6 text-accent" />
                </div>
                <div className="h-6 w-px bg-white/10 mr-3" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, hospitals, or symptoms..."
                  className="bg-transparent border-none focus-visible:ring-0 text-white text-lg h-12 placeholder:text-white/40"
                />
              </div>
              <Button type="button" size="icon" variant="ghost" className="rounded-full text-white/50 hover:text-accent">
                <Mic className="h-5 w-5" />
              </Button>
              <Button type="submit" size="icon" className="bg-accent text-black rounded-full h-12 w-12 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.5)]">
                <Search className="h-6 w-6" />
              </Button>
            </form>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto pt-8 animate-in fade-in duration-1000 delay-500">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className={cn(
                    "glass-morphism rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group cursor-default",
                    stat.glow === 'cyan' ? 'neon-glow-cyan' : 'neon-glow-orange'
                )}
              >
                <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-white/50 font-bold">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-12 animate-in fade-in duration-1000 delay-700">
            <Button asChild size="lg" className="btn-gradient-orange rounded-full h-14 px-10 text-xl font-black neon-glow-orange hover:scale-105 transition-transform">
              <Link href="/search">Book Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass-morphism neon-glow-red border-red-500/50 text-white hover:bg-red-500/10 rounded-full h-14 px-10 text-xl font-black transition-transform hover:scale-105">
              <Link href="/emergency">Emergency Verification</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Decorative Star/Flare in corner as seen in UI */}
      <div className="fixed bottom-8 right-8 z-20 pointer-events-none opacity-40">
        <Zap className="h-12 w-12 text-white fill-white animate-pulse" />
      </div>
    </div>
  );
}
