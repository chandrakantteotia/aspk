import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook, Twitter, Instagram, Youtube, Linkedin,
  Mail, Phone, MapPin
} from 'lucide-react';
import partyLogo from '@/images/logo.png';
import footerLogo from '@/images/footerlogo.png';

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
    <footer className="bg-[#f3f4f6] text-slate-800 border-t border-slate-200/80" role="contentinfo">
      <div className="container-padded py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* ── Brand Column ── */}
          <div className="lg:col-span-5 pr-0 lg:pr-12">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={footerLogo} alt="ASPK4Hapur Logo" className="h-9 sm:h-11 w-11 object-contain shrink-0" />
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-[var(--color-primary)]">
                आजाद समाज पार्टी (काशीराम)
              </span>
            </Link>
            <p className="font-serif italic text-slate-600 text-base md:text-lg mb-8 leading-relaxed">
              A people-first political movement committed to transparent governance, social justice, and building a prosperous Hapur.
            </p>

            <div className="flex items-center gap-3 mb-8">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-colors shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="space-y-3">
              <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-3 text-sm text-slate-600 hover:text-[var(--color-primary)] transition-colors font-medium">
                <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                +91 XXXX-XXX-XXX
              </a>
              <a href="mailto:contact@aspk4hapur.in" className="flex items-center gap-3 text-sm text-slate-600 hover:text-[var(--color-primary)] transition-colors font-medium">
                <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                contact@aspk4hapur.in
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                Hapur, Uttar Pradesh, India
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6">The Party</h4>
            <ul className="space-y-3.5">
              {footerLinks.party.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm font-medium text-slate-600 hover:text-[var(--color-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6">Get Involved</h4>
            <ul className="space-y-3.5">
              {footerLinks.engage.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm font-medium text-slate-600 hover:text-[var(--color-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-3.5">
              {footerLinks.resources.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm font-medium text-slate-600 hover:text-[var(--color-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <div className="container-padded">
        <div className="h-[1px] w-full bg-slate-200" />
      </div>

      {/* ── Bottom Bar ── */}
      <div className="container-padded py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-medium text-slate-500 text-center md:text-left">
          © {new Date().getFullYear()} ASPK4Hapur. All rights reserved.
        </p>
        <p className="text-xs font-medium text-slate-500 text-center">
          Made with ❤️ for the people of Hapur
        </p>
        <div className="flex items-center gap-6">
          <Link to="#" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link to="#" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
