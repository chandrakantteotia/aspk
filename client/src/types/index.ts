import { Timestamp } from 'firebase/firestore';

// ─── Auth & Users ───────────────────────────────────────────
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'superadmin' | 'admin' | 'editor' | 'member' | 'viewer';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── News ───────────────────────────────────────────────────
export interface NewsArticle {
  id?: string;
  title: string;
  slug: string;
  category: 'Press Release' | 'Announcement' | 'News' | 'Opinion' | 'Manifesto Update';
  date: Timestamp;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  authorPhotoUrl?: string;
  published: boolean;
  featured: boolean;
  tags: string[];
  readTime?: number;
  views?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Events ─────────────────────────────────────────────────
export interface PartyEvent {
  id?: string;
  title: string;
  slug: string;
  date: Timestamp;
  endDate?: Timestamp;
  location: string;
  address: string;
  district: string;
  type: 'Public Meet' | 'Workshop' | 'Campaign' | 'Rally' | 'Conference' | 'Online' | 'Other';
  description: string;
  imageUrl: string;
  registrationOpen: boolean;
  maxAttendees?: number;
  registeredCount?: number;
  featured: boolean;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Party Members ──────────────────────────────────────────
export interface PartyMember {
  id?: string;
  name: string;
  role: string;
  wing: 'National' | 'State' | 'District' | 'Youth Wing' | "Women's Wing" | 'Other';
  bio: string;
  photoUrl: string;
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Gallery ─────────────────────────────────────────────────
export interface GalleryItem {
  id?: string;
  title: string;
  type: 'Photo' | 'Video';
  category: string;
  mediaUrl: string;
  thumbnailUrl: string;
  description?: string;
  date: Timestamp;
  featured: boolean;
  order: number;
  tags: string[];
  createdAt: Timestamp;
}

// ─── Complaints ──────────────────────────────────────────────
export interface Complaint {
  id?: string;
  complaintId: string;
  name: string;
  phone: string;
  email?: string;
  category: string;
  description: string;
  location: string;
  district: string;
  attachmentUrl?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  response?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Donations ───────────────────────────────────────────────
export interface Donation {
  id?: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  method: 'UPI' | 'Bank Transfer' | 'Other';
  transactionId?: string;
  upiId?: string;
  status: 'Pending' | 'Verified' | 'Failed' | 'Refunded';
  panNumber?: string;
  address?: string;
  message?: string;
  receiptNumber?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Membership Applications ─────────────────────────────────
export interface MemberApplication {
  id?: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  email: string;
  phone: string;
  address: string;
  district: string;
  pincode: string;
  aadhaarNumber?: string;
  occupation: string;
  qualification: string;
  interest: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  photoUrl?: string;
  documentUrl?: string;
  remarks?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Contact Messages ─────────────────────────────────────────
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: Timestamp;
}

// ─── Announcements ────────────────────────────────────────────
export interface Announcement {
  id?: string;
  title: string;
  content: string;
  type: 'Info' | 'Success' | 'Warning' | 'Urgent';
  published: boolean;
  expiresAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Hero Slides ──────────────────────────────────────────────
export interface HeroSlide {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  order: number;
  active: boolean;
  createdAt: Timestamp;
}

// ─── Testimonials ─────────────────────────────────────────────
export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  photoUrl?: string;
  featured: boolean;
  createdAt: Timestamp;
}

// ─── Website Settings ─────────────────────────────────────────
export interface WebsiteSettings {
  id?: string;
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  donationUpiId?: string;
  donationQrUrl?: string;
  donationBankDetails?: string;
  metaDescription?: string;
  logoUrl?: string;
  updatedAt: Timestamp;
}

// ─── Newsletter ───────────────────────────────────────────────
export interface NewsletterSubscriber {
  id?: string;
  email: string;
  createdAt: Timestamp;
  active: boolean;
}

// ─── Manifesto ────────────────────────────────────────────────
export interface ManifestoPillar {
  id?: string;
  title: string;
  icon: string;
  summary: string;
  details: string;
  highlight: string;
  color: string;
  order: number;
  published: boolean;
  createdAt: Timestamp;
}

// ─── UI State Types ───────────────────────────────────────────
export interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

export interface FilterState {
  category?: string;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ─── Firebase Query Result ────────────────────────────────────
export interface FirestoreResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
