
import { Phone, Mail, MapPin, Heart, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  
  const services = [
    { name: "Find Doctors", href: "/search" },
    { name: "Book Appointments", href: "/search" },
    { name: "Hospital Directory", href: "/hospitals" },
    { name: "Diagnostic Centers", href: "/diagnostics" },
    { name: "Emergency Services", href: "/hospitals?query=emergency" },
  ];

  const forProviders = [
    { name: "Join as Doctor", href: "/login" },
    { name: "Partner Hospital", href: "/contact" },
    { name: "Add Diagnostic Center", href: "/contact" },
    { name: "Provider Dashboard", href: "/login" },
  ];

  const support = [
    { name: "Help Center", href: "/contact" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/coming-soon" },
    { name: "Terms of Service", href: "/coming-soon" },
    { name: "FAQ", href: "/coming-soon" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, href: "https://www.facebook.com/share/14R1RFfq246/"},
    { name: "Twitter", icon: <Twitter className="h-5 w-5" />, href: "https://x.com/HealthSanjiwani?t=Tt-ckuhMIuOoAjVy459vAQ&s=09"},
    { name: "Instagram", icon: <Instagram className="h-5 w-5" />, href: "https://www.instagram.com/sanjiwanihealth_official?igsh=eXhqaDA4bzJwNHBi"},
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/sanjiwani-healthcare-6a348137a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"},
  ];

  return (
    <footer className="bg-card border-t dark:bg-gray-900/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Company Info */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 text-accent">
                <Image
                  src="/logo.jpg"
                  alt="Sanjiwani Health Logo"
                  width={72}
                  height={72}
                  className="rounded-full"
                />
                <div>
                    <h2 className="text-2xl font-bold font-headline">Sanjiwani</h2>
                    <p className="text-lg text-muted-foreground font-headline -mt-1">Health</p>
                </div>
            </Link>
            <p className="text-muted-foreground text-sm">
                Bridging the healthcare gap with trusted doctors, real-time hospital information, and seamless appointment booking. Your health, our priority.
            </p>
            <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary"/>
                    <span>Emergency: <strong>108</strong> | Support: <strong>+91 1800-123-4567</strong></span>
                </p>
                 <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary"/>
                    <a href="mailto:support@sanjiwanihealth.com" className="hover:text-primary">support@sanjiwanihealth.com</a>
                </p>
                 <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary"/>
                    <span>Pan India Healthcare Network</span>
                </p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-lg font-semibold font-headline text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Healthcare Providers */}
           <div>
            <h3 className="text-lg font-semibold font-headline text-foreground mb-4">For Healthcare Providers</h3>
            <ul className="space-y-2">
              {forProviders.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
           <div>
            <h3 className="text-lg font-semibold font-headline text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              {support.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p className="text-center sm:text-left mb-4 sm:mb-0">
                &copy; {new Date().getFullYear()} Sanjiwani Health. All rights reserved. | Built with <Heart className="inline h-4 w-4 text-red-500 fill-current"/> for better healthcare.
            </p>
            <div className="flex items-center gap-4">
                <span>Follow us:</span>
                {socialLinks.map(social => (
                    <a 
                        key={social.name} 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-muted-foreground hover:text-primary transition-colors" 
                        aria-label={social.name}
                    >
                        {social.icon}
                    </a>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
}
