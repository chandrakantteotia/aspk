import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook, Twitter, Instagram, Youtube, Linkedin,
  Mail, Phone, MapPin, ArrowRight
} from 'lucide-react';

const footerLinks = {
  party: [
    { label: 'About ASPK4Hapur', href: '/about' },
    { label: 'Our Manifesto', href: '/manifesto' },
    { label: 'Leadership Team', href: '/party-members' },
    { label: 'Party History', href: '/about#history' },
    { label: 'Media Gallery', href: '/gallery' },
  ],
  engage: [
    { label: 'Join the Party', href: '/join' },
    { label: 'Volunteer', href: '/join#volunteer' },
    { label: 'Donate', href: '/donate' },
    { label: 'File a Complaint', href: '/complaints' },
    { label: 'Contact Us', href: '/contact' },
  ],
  resources: [
    { label: 'Latest News', href: '/news' },
    { label: 'Upcoming Events', href: '/events' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Announcements', href: '/announcements' },
    { label: 'Admin Login', href: '/login' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter/X' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white" role="contentinfo">
      <div className="container-padded py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* ── Brand Column ── */}
          <div className="lg:col-span-5 pr-0 lg:pr-12">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🏛️</span>
              <div className="font-display font-bold text-2xl tracking-tight">
                <span className="text-white">ASPK</span>
                <span className="font-serif italic text-white/70 ml-1">4Hapur</span>
              </div>
            </Link>
            <p className="font-serif italic text-[var(--color-gold)] text-lg mb-8">
              A people-first political movement committed to transparent governance and building a prosperous Hapur.
            </p>
            
            <div className="flex items-center gap-3 mb-10">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="space-y-4">
              <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-3 text-[15px] text-white/60 hover:text-[var(--color-gold)] transition-colors">
                <Phone className="w-4 h-4" />
                +91 XXXX-XXX-XXX
              </a>
              <a href="mailto:contact@aspk4hapur.in" className="flex items-center gap-3 text-[15px] text-white/60 hover:text-[var(--color-gold)] transition-colors">
                <Mail className="w-4 h-4" />
                contact@aspk4hapur.in
              </a>
              <div className="flex items-center gap-3 text-[15px] text-white/60">
                <MapPin className="w-4 h-4" />
                Hapur, Uttar Pradesh, India
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-bold text-white/40 uppercase tracking-widest mb-6">The Party</h4>
            <ul className="space-y-4">
              {footerLinks.party.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-[15px] text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-bold text-white/40 uppercase tracking-widest mb-6">Get Involved</h4>
            <ul className="space-y-4">
              {footerLinks.engage.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-[15px] text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-3">
            <h4 className="text-[13px] font-bold text-white/40 uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-[15px] text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <div className="container-padded">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
      </div>

      {/* ── Bottom Bar ── */}
      <div className="container-padded py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[14px] text-white/40 text-center md:text-left">
          © {new Date().getFullYear()} ASPK4Hapur. All rights reserved.
        </p>
        <p className="text-[14px] text-white/40 text-center">
          Made with ❤️ for the people of Hapur
        </p>
        <div className="flex items-center gap-6">
          <Link to="#" className="text-[14px] text-white/40 hover:text-white/80 transition-colors">Privacy</Link>
          <Link to="#" className="text-[14px] text-white/40 hover:text-white/80 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
