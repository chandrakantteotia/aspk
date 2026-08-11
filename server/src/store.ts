import { randomUUID } from 'node:crypto';

export type ComplaintStatus = 'Submitted' | 'In Review' | 'Resolved' | 'Closed';

export type Complaint = {
  id: string;
  complaintId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  state: string;
  district: string;
  address: string;
  category: string;
  description: string;
  imageFileName?: string;
  documentFileName?: string;
  status: ComplaintStatus;
  createdAt: string;
};

export type Donation = {
  id: string;
  receiptNumber: string;
  fullName: string;
  email: string;
  amount: number;
  method: 'UPI' | 'QR' | 'Razorpay' | 'Bank Transfer';
  status: 'Pending' | 'Verified';
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type NewsletterEntry = {
  id: string;
  email: string;
  createdAt: string;
};

export type UserRole = 'super-admin' | 'editor' | 'content-manager';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export type DashboardSummary = {
  visitors: string;
  complaints: number;
  donations: string;
  members: number;
};

export type NewsItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  date: string;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
};

export type MemberProfile = {
  id: string;
  name: string;
  role: string;
  level: 'National' | 'State' | 'District' | 'Youth Wing' | "Women's Wing";
  bio: string;
  image: string;
};

export const dashboardSummary: DashboardSummary = {
  visitors: '12.4k',
  complaints: 148,
  donations: '₹8.4L',
  members: 14250
};

export const newsItems: NewsItem[] = [
  {
    id: randomUUID(),
    title: 'New district outreach model announced for village-first governance',
    category: 'Press Release',
    summary: 'ASPK4Hapur introduced a field-led program to improve local issue resolution, public feedback, and transparent reporting.',
    date: '09 Aug 2026'
  },
  {
    id: randomUUID(),
    title: 'Youth leadership summit to be held this month',
    category: 'Announcement',
    summary: 'A state-wide leadership summit will bring together youth wing delegates, entrepreneurs, and educators.',
    date: '06 Aug 2026'
  }
];

export const eventItems: EventItem[] = [
  { id: randomUUID(), title: 'People First Town Hall', date: '14 Aug 2026', location: 'Hapur City Auditorium', type: 'Public Meet' },
  { id: randomUUID(), title: 'Women Empowerment Workshop', date: '18 Aug 2026', location: 'District Training Hall', type: 'Workshop' },
  { id: randomUUID(), title: 'Youth Membership Drive', date: '22 Aug 2026', location: 'All Blocks', type: 'Campaign' }
];

export const members: MemberProfile[] = [
  {
    id: randomUUID(),
    name: 'Dr. Arvind Chauhan',
    role: 'National President',
    level: 'National',
    bio: 'A policy-first leader focused on grassroots organization, civic accountability, and strategic growth.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: randomUUID(),
    name: 'Seema Rathi',
    role: 'State President',
    level: 'State',
    bio: 'Leads campaign planning, women-focused outreach, and district-level governance reviews.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: randomUUID(),
    name: 'Ayesha Khan',
    role: 'Youth Wing Lead',
    level: 'Youth Wing',
    bio: 'Builds volunteer pipelines, leadership labs, and digital community outreach.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80'
  }
];

export const complaints: Complaint[] = [];
export const donations: Donation[] = [];
export const contactMessages: ContactMessage[] = [];
export const newsletterEntries: NewsletterEntry[] = [];

export function createComplaintId() {
  return `CMP-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export function createReceiptNumber() {
  return `RCT-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}
