
"use client";

import { 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Search,
  Calendar,
  Hospital,
  Microscope,
  Navigation,
  UserPlus,
  Building,
  Activity,
  Gauge,
  HelpCircle,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Star,
  Zap,
  Globe,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export function Footer() {
  
  const services = [
    { name: "Find Doctors", href: "/search", icon: <Search className="h-4 w-4" /> },
    { name: "Book Appointments", href: "/search", icon: <Calendar className="h-4 w-4" /> },
    { name: "Hospital Directory", href: "/hospitals", icon: <Hospital className="h-4 w-4" /> },
    { name: "Diagnostic Centers", href: "/diagnostics", icon: <Microscope className="h-4 w-4" /> },
    { name: "Emergency Services", href: "/hospitals?query=emergency", icon: <Navigation className="h-4 w-4" /> },
  ];

  const forProviders = [
    { name: "Join as Doctor", href: "/login", icon: <UserPlus className="h-4 w-4" /> },
    { name: "Partner Hospital", href: "/login", icon: <Building className="h-4 w-4" /> },
    { name: "Add Diagnostic Center", href: "/contact", icon: <Activity className="h-4 w-4" /> },
    { name: "Provider Dashboard", href: "/login", icon: <Gauge className="h-4 w-4" /> },
  ];

  const support = [
    { name: "Help Center", href: "/contact", icon: <HelpCircle className="h-4 w-4" /> },
    { name: "Contact Us", href: "/contact", icon: <MessageCircle className="h-4 w-4" /> },
    { name: "Privacy Policy", href: "/privacy", icon: <ShieldAlert className="h-4 w-4" /> },
    { name: "Terms of Service", href: "/terms", icon: <FileText className="h-4 w-4" /> },
    { name: "FAQ", href: "/faq", icon: <HelpCircle className="h-4 w-4" /> },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-4 w-4" />, href: "https://www.facebook.com/share/14R1RFfq246/"},
    { name: "Twitter", icon: <Twitter className="h-4 w-4" />, href: "https://x.com/HealthSanjiwani?t=Tt-ckuhMIuOoAjVy459vAQ&s=09"},
    { name: "Instagram", icon: <Instagram className="h-4 w-4" />, href: "https://www.instagram.com/sanjiwanihealth_official?igsh=eXhqaDA4bzJwNHBi"},
    { name: "LinkedIn", icon: <Linkedin className="h-4 w-4" />, href: "https://www.linkedin.com/in/sanjiwani-healthcare-6a348137a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"},
  ];

  return (
    <footer className="relative z-10 bg-black/80 backdrop-blur-2xl border-t border-white/5 pt-20 pb-12 overflow-hidden">
      {/* Signature Gradient Divider Top */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-purple-600 opacity-80" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Company Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block group">
                <Logo className="text-3xl" />
            </Link>
            <p className="text-white/60 text-base max-w-sm leading-relaxed font-medium">
                Trusted Healthcare. Verified by Technology.
            </p>
            
            <div className="space-y-4 pt-4">
                <div className="inline-flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-2 border border-white/5 shadow-inner">
                    <Phone className="h-4 w-4 text-cyan-400"/>
                    <span className="text-sm font-bold text-white/90 uppercase tracking-wider">Emergency: <span className="text-cyan-400">108</span></span>
                </div>
                
                <div className="flex flex-col gap-3 text-sm text-white/50 font-medium">
                    <a href="mailto:healthsanjeevani@gmail.com" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                        <Mail className="h-4 w-4" />
                        healthsanjeevani@gmail.com
                    </a>
                    <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4" />
                        Pan India Healthcare Network
                    </div>
                </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-black font-headline text-white uppercase tracking-widest">Services</h3>
            <ul className="space-y-4">
              {services.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex items-center gap-3 text-white/50 hover:text-cyan-400 transition-all duration-300 text-sm font-bold">
                    <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-cyan-400/10 transition-colors">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Providers */}
           <div className="lg:col-span-3 space-y-6">
            <h3 className="text-lg font-black font-headline text-white uppercase tracking-widest">For Healthcare Providers</h3>
            <ul className="space-y-4">
              {forProviders.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex items-center gap-3 text-white/50 hover:text-purple-400 transition-all duration-300 text-sm font-bold">
                    <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-purple-400/10 transition-colors">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
           <div className="lg:col-span-3 space-y-6">
            <h3 className="text-lg font-black font-headline text-white uppercase tracking-widest">Support</h3>
            <ul className="space-y-4">
              {support.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex items-center gap-3 text-white/50 hover:text-purple-400 transition-all duration-300 text-sm font-bold">
                    <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-purple-400/10 transition-colors">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM METRICS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-t border-white/5">
            <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 group-hover:neon-glow-cyan transition-all">
                    <ShieldCheck className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-sm font-black text-white/80 uppercase tracking-tighter">Blockchain Verified</span>
            </div>
            <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-xl bg-purple-400/10 border border-purple-400/20 group-hover:neon-glow-purple transition-all">
                    <Hospital className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-sm font-black text-white/80 uppercase tracking-tighter">200+ Partner Hospitals</span>
            </div>
            <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-xl bg-purple-400/10 border border-purple-400/20 group-hover:neon-glow-purple transition-all">
                    <Star className="h-5 w-5 text-purple-400 fill-purple-400" />
                </div>
                <span className="text-sm font-black text-white/80 uppercase tracking-tighter">4.8 Patient Rating</span>
            </div>
        </div>
        
        {/* FINAL BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-sm text-white/40 font-medium">
                &copy; {new Date().getFullYear()} Sanjiwani. All rights reserved. | Built with <Heart className="inline h-4 w-4 text-red-500 fill-current mx-1"/> for better healthcare.
            </div>
            
            <div className="flex items-center gap-3">
                {socialLinks.map(social => (
                    <a 
                        key={social.name} 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-10 h-10 rounded-xl glass-morphism border-white/10 flex items-center justify-center text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 hover:neon-glow-cyan transition-all duration-300"
                        aria-label={social.name}
                    >
                        {social.icon}
                    </a>
                ))}
                
                {/* Decorative Flare in Footer Corner */}
                <div className="ml-4 opacity-40">
                    <Sparkles className="h-8 w-8 text-white/20" />
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
