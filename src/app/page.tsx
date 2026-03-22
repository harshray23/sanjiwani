
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  ShieldCheck, 
  Link as LinkIcon, 
  Calendar, 
  Star, 
  Mic, 
  Brain, 
  Zap, 
  Shield, 
  Coins, 
  Activity, 
  SearchCheck, 
  CheckCircle2, 
  FlaskConical, 
  MapPin, 
  Eye, 
  Rocket, 
  Sparkles,
  Globe,
  ArrowRight
} from "lucide-react";
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
    <div className="w-full min-h-screen relative overflow-x-hidden bg-black">
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

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-20 px-4 flex flex-col items-center justify-center text-center">
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

      {/* The Avalanche Trust Protocol Section */}
      <section className="relative z-10 py-32 px-4 bg-black/60 backdrop-blur-md overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-orange-500/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto space-y-20 relative">
          {/* Section Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 border border-white/10 bg-white/5 text-sm font-bold tracking-widest uppercase text-white split-border-container">
              <span className="text-accent">Verification</span> 
              <span className="text-orange-400">Layer</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white font-headline leading-tight">
              The Avalanche <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Trust Protocol</span>
            </h2>
            <p className="text-xl text-white/60 font-medium">Securing Healthcare with Blockchain Integrity</p>
          </div>

          {/* Cards Grid with Connection Line */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 relative">
            {/* The Glowing Pulse Line (Desktop only) */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[300px] h-32 items-center justify-center z-0 pointer-events-none">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_20px_rgba(0,242,255,0.8)] opacity-50" />
                <div className="absolute w-full flex justify-center">
                    <svg className="w-full h-16 text-accent opacity-80" viewBox="0 0 200 40">
                        <path d="M0 20 L60 20 L70 5 L80 35 L90 20 L110 20 L120 5 L130 35 L140 20 L200 20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="200" className="animate-draw-pulse" />
                    </svg>
                </div>
                <div className="absolute w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_rgba(0,242,255,1)] animate-ping" />
            </div>

            {/* Card 1: Immutable Verification */}
            <div className="glass-morphism neon-glow-cyan p-10 rounded-[2.5rem] space-y-8 relative z-10 group hover:scale-[1.02] transition-transform duration-500">
              <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,242,255,0.1)] relative">
                <Shield className="h-12 w-12 text-accent" />
                <LinkIcon className="h-6 w-6 text-accent absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-accent/50" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black text-white">Immutable Verification</h3>
                <p className="text-white/70 text-lg leading-relaxed font-medium">
                  When a hospital updates its ICU bed count, a cryptographic hash is anchored to Avalanche. 
                  This ensures that availability data cannot be faked or retroactively changed.
                </p>
              </div>
            </div>

            {/* Card 2: Incentive Rewards */}
            <div className="glass-morphism neon-glow-cyan p-10 rounded-[2.5rem] space-y-8 relative z-10 group hover:scale-[1.02] transition-transform duration-500">
              <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,242,255,0.1)] relative">
                <Coins className="h-12 w-12 text-accent" />
                <Zap className="h-6 w-6 text-orange-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black text-white">Incentive Rewards</h3>
                <p className="text-white/70 text-lg leading-relaxed font-medium">
                  Patients and community contributors who provide real-time updates on facility status or donate blood are rewarded with Sanjeevani Points, powered by Avalanche smart contracts.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="text-center pt-8">
            <Button variant="outline" className="rounded-full border-none split-border h-16 px-12 text-xl font-black text-white transition-all hover:scale-105">
              Explore Trust Layer
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-32 px-4 bg-[#050a15] overflow-hidden">
        {/* Hexagonal Grid Background Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00f2ff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        
        <div className="max-w-7xl mx-auto space-y-20 relative">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-headline text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              How It Works
            </h2>
            <p className="text-xl text-white/60 font-medium">Your Intelligent Care Journey</p>
          </div>

          <div className="relative">
            {/* The Wavy Care Path Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none z-0">
              <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
                <path 
                  d="M0,50 C150,50 250,20 400,20 C550,20 650,80 800,80 C950,80 1050,50 1200,50" 
                  fill="none" 
                  stroke="url(#care-path-gradient)" 
                  strokeWidth="3" 
                  strokeDasharray="10,10"
                  className="animate-flow-dash"
                />
                <defs>
                  <linearGradient id="care-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Floating AI Node on Path */}
              <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/50 rounded-full blur-xl animate-pulse" />
                  <div className="relative glass-morphism rounded-full p-3 border border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                    <Brain className="h-6 w-6 text-purple-400" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="space-y-6 group">
                <div className="relative mx-auto w-48 h-48">
                  {/* Radar Animation */}
                  <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping" />
                  <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="glass-morphism rounded-full p-10 border-cyan-500/50 shadow-[0_0_30px_rgba(0,242,255,0.2)] group-hover:neon-glow-cyan transition-all duration-500">
                      <Search className="h-12 w-12 text-cyan-400" />
                    </div>
                  </div>
                </div>
                <Card className="glass-morphism border-cyan-500/20 rounded-[2rem] p-8 text-center space-y-4 group-hover:neon-glow-cyan transition-all duration-500">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-black text-cyan-400">01</span>
                    <h3 className="text-xl font-bold text-white">Find Your Care</h3>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Search for hospitals or doctors. Filter by specialty and Avalanche-verified availability.
                  </p>
                </Card>
              </div>

              {/* Step 2 */}
              <div className="space-y-6 group">
                <div className="relative mx-auto w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/40 transition-colors" />
                      <div className="relative glass-morphism rounded-[2.5rem] p-10 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)] group-hover:neon-glow-orange transition-all duration-500">
                        <ShieldCheck className="h-12 w-12 text-orange-400" />
                        {/* Connecting Hexagon bits */}
                        <div className="absolute -top-2 -left-2 h-4 w-4 bg-orange-500 rounded-sm rotate-45 animate-pulse" />
                        <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-orange-500 rounded-sm rotate-45 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
                <Card className="glass-morphism border-orange-500/20 rounded-[2rem] p-8 text-center space-y-4 group-hover:neon-glow-orange transition-all duration-500">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-black text-orange-400">02</span>
                    <h3 className="text-xl font-bold text-white">Trust the Proof</h3>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Check the blockchain anchor to confirm the data is current and tamper-proof.
                  </p>
                </Card>
              </div>

              {/* Step 3 */}
              <div className="space-y-6 group">
                <div className="relative mx-auto w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Floating Coins Effect */}
                      <div className="absolute -top-4 right-0 animate-bounce delay-100">
                        <Coins className="h-6 w-6 text-yellow-400 opacity-50" />
                      </div>
                      <div className="absolute top-8 -left-4 animate-bounce delay-300">
                        <Coins className="h-4 w-4 text-yellow-400 opacity-30" />
                      </div>
                      
                      <div className="relative glass-morphism rounded-full p-10 border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.2)] group-hover:neon-glow-purple transition-all duration-500">
                        <div className="relative">
                          <CheckCircle2 className="h-12 w-12 text-purple-400" />
                          <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                            <Coins className="h-4 w-4 text-black" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Card className="glass-morphism border-purple-500/20 rounded-[2rem] p-8 text-center space-y-4 group-hover:neon-glow-purple transition-all duration-500">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-black text-purple-400">03</span>
                    <h3 className="text-xl font-bold text-white">Verify & Earn</h3>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Visit the clinic and earn community rewards for verifying the resource availability.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="relative z-10 py-32 px-4 bg-black/40 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[150px] opacity-50" />
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse delay-700" />
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse delay-300" />
            
            {/* Geometric Mandala Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4 opacity-10">
                <svg width="600" height="600" viewBox="0 0 200 200" className="text-accent fill-none stroke-current stroke-[0.5]">
                    <path d="M100 10 L110 40 L140 50 L110 60 L100 90 L90 60 L60 50 L90 40 Z" />
                    <circle cx="100" cy="100" r="80" strokeDasharray="2 2" />
                    <circle cx="100" cy="100" r="60" />
                    <circle cx="100" cy="100" r="40" strokeDasharray="4 4" />
                </svg>
            </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-24 relative">
          {/* Shloka Header */}
          <div className="text-center space-y-10">
            <div className="space-y-4">
                <h2 className="text-2xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-300 to-orange-500 drop-shadow-[0_0_15px_rgba(251,146,60,0.4)] leading-relaxed">
                    धर्मार्थकाममोक्षाणां स्वास्थ्यं मूलमुत्तमम् । <br/>
                    स्वस्थस्य कुशलं श्रेय: स्वास्थ्यं सर्वार्थसाधनम् ॥
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto rounded-full" />
            </div>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto italic font-medium leading-relaxed">
                Health is the supreme foundation for achieving the four goals of life: <br/>
                <span className="text-white font-bold not-italic">Righteousness, Prosperity, Desire, and Liberation.</span>
            </p>
          </div>

          {/* Vision/Mission Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* Vision Card */}
            <div className="glass-morphism rounded-[2rem] p-10 space-y-6 relative group overflow-hidden border-white/5 hover:border-accent/30 transition-all duration-500">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-[60px] group-hover:bg-accent/20 transition-colors" />
                
                <div className="relative w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:neon-glow-cyan transition-all duration-500">
                    <div className="absolute inset-0 bg-accent/5 rounded-2xl animate-pulse" />
                    <Eye className="h-10 w-10 text-accent relative z-10" />
                </div>

                <div className="space-y-4 relative z-10">
                    <h3 className="text-3xl font-black text-white font-headline">Our Vision</h3>
                    <p className="text-lg text-white/60 leading-relaxed font-medium">
                        To create a transparent and accessible healthcare ecosystem where decentralized trust empowers individuals to find care without misinformation.
                    </p>
                </div>
            </div>

            {/* Mission Card */}
            <div className="glass-morphism rounded-[2rem] p-10 space-y-6 relative group overflow-hidden border-white/5 hover:border-orange-400/30 transition-all duration-500">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] group-hover:bg-orange-500/20 transition-colors" />
                
                <div className="relative w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:neon-glow-orange transition-all duration-500">
                    <div className="absolute inset-0 bg-orange-500/5 rounded-2xl animate-pulse" />
                    <Rocket className="h-10 w-10 text-orange-400 relative z-10" />
                </div>

                <div className="space-y-4 relative z-10">
                    <h3 className="text-3xl font-black text-white font-headline">Our Mission</h3>
                    <p className="text-lg text-white/60 leading-relaxed font-medium">
                        To bridge the critical information gap in healthcare using the Avalanche blockchain as a verification layer, saving lives through data integrity.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL JOIN CTA SECTION */}
      <section className="relative z-10 py-32 px-4 bg-black/20 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="relative glass-morphism rounded-full p-6 border border-cyan-500/50 shadow-[0_0_40px_rgba(0,242,255,0.3)]">
              <div className="relative">
                <Globe className="h-16 w-16 text-cyan-400" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400/20 rounded-full p-2">
                  <span className="text-[10px] font-black text-cyan-400">AI</span>
                </div>
                <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-1 animate-bounce">
                  <Zap className="h-4 w-4 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-black font-headline text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 leading-tight">
            Join the Future of Trusted Healthcare
          </h2>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium">
            Ready to integrate decentralized trust? Join pilot hospitals on the Avalanche blockchain and build the network.
          </p>

          <div className="pt-6">
            <Button asChild size="lg" className="btn-gradient-orange rounded-full h-16 px-12 text-xl font-black neon-glow-orange hover:scale-105 transition-all">
              <Link href="/login">Join the Network</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Decorative Star/Flare in corner */}
      <div className="fixed bottom-8 right-8 z-20 pointer-events-none opacity-40">
        <Zap className="h-12 w-12 text-white fill-white animate-pulse" />
      </div>

      <style jsx global>{`
        @keyframes draw-pulse {
          to {
            stroke-dashoffset: -400;
          }
        }
        @keyframes flow-dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        .animate-draw-pulse {
          stroke-dashoffset: 0;
          animation: draw-pulse 4s linear infinite;
        }
        .animate-flow-dash {
          stroke-dashoffset: 0;
          animation: flow-dash 10s linear infinite;
        }
        .split-border {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
        .split-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: inherit;
          background: linear-gradient(to right, #00f2ff, #ff8c00);
          -webkit-mask: 
             linear-gradient(#fff 0 0) content-box, 
             linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
