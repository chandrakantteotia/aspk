import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { complaints, contactMessages, createComplaintId, createReceiptNumber, dashboardSummary, donations, eventItems, members, newsItems, newsletterEntries } from './store.js';
import type { Complaint } from './store.js';

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') ?? ['http://localhost:5173'],
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_request: Request, response: Response) => {
  response.json({ ok: true, service: 'aspk4hapur-api', timestamp: new Date().toISOString() });
});

app.get('/api/content/home', (_request: Request, response: Response) => {
  response.json({
    stats: dashboardSummary,
    news: newsItems,
    events: eventItems,
    members
  });
});

app.get('/api/news', (_request: Request, response: Response) => {
  response.json(newsItems);
});

app.get('/api/events', (_request: Request, response: Response) => {
  response.json(eventItems);
});

app.get('/api/members', (_request: Request, response: Response) => {
  response.json(members);
});

app.get('/api/dashboard/summary', (_request: Request, response: Response) => {
  response.json({
    ...dashboardSummary,
    openComplaints: complaints.filter((item: Complaint) => item.status !== 'Closed').length,
    donationsLogged: donations.length,
    messagesReceived: contactMessages.length,
    newsletterSubscribers: newsletterEntries.length
  });
});

app.post('/api/auth/login', authLimiter, async (request: Request, response: Response) => {
  const { email, password } = request.body as { email?: string; password?: string };

  if (!email || !password) {
    return response.status(400).json({ message: 'Email and password are required.' });
  }

  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const valid = email === 'admin@aspk4hapur.in' && (await bcrypt.compare(password, adminPasswordHash));

  if (!valid) {
    return response.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ sub: email, role: 'super-admin' }, process.env.JWT_SECRET ?? 'dev-secret', { expiresIn: '8h' });

  return response.json({
    token,
    user: {
      email,
      role: 'super-admin'
    }
  });
});

app.post('/api/complaints', async (request: Request, response: Response) => {
  const payload = request.body as Record<string, string | undefined>;
  const requiredFields = ['fullName', 'mobileNumber', 'email', 'state', 'district', 'address', 'category', 'description'];
  const missing = requiredFields.filter((field) => !payload[field]);

  if (missing.length > 0) {
    return response.status(400).json({ message: 'Missing required complaint fields.', missing });
  }

  const complaint = {
    id: crypto.randomUUID(),
    complaintId: createComplaintId(),
    fullName: payload.fullName!,
    mobileNumber: payload.mobileNumber!,
    email: payload.email!,
    state: payload.state!,
    district: payload.district!,
    address: payload.address!,
    category: payload.category!,
    description: payload.description!,
    imageFileName: payload.imageFileName,
    documentFileName: payload.documentFileName,
    status: 'Submitted' as const,
    createdAt: new Date().toISOString()
  };

  complaints.unshift(complaint);
  return response.status(201).json({ complaint, message: 'Complaint submitted successfully.' });
});

app.get('/api/complaints/:complaintId', (request: Request, response: Response) => {
  const complaint = complaints.find((item: Complaint) => item.complaintId === request.params.complaintId);

  if (!complaint) {
    return response.status(404).json({ message: 'Complaint not found.' });
  }

  return response.json(complaint);
});

app.patch('/api/admin/complaints/:complaintId/status', (request: Request, response: Response) => {
  const { status } = request.body as { status?: string };
  const complaint = complaints.find((item: Complaint) => item.complaintId === request.params.complaintId);

  if (!complaint) {
    return response.status(404).json({ message: 'Complaint not found.' });
  }

  if (!status || !['Submitted', 'In Review', 'Resolved', 'Closed'].includes(status)) {
    return response.status(400).json({ message: 'Invalid complaint status.' });
  }

  complaint.status = status as typeof complaint.status;
  return response.json({ complaint });
});

app.post('/api/donations', (request: Request, response: Response) => {
  const { fullName, email, amount, method } = request.body as { fullName?: string; email?: string; amount?: number; method?: string };

  if (!fullName || !email || !amount || !method) {
    return response.status(400).json({ message: 'Missing donation fields.' });
  }

  const donation = {
    id: crypto.randomUUID(),
    receiptNumber: createReceiptNumber(),
    fullName,
    email,
    amount: Number(amount),
    method: method as 'UPI' | 'QR' | 'Razorpay' | 'Bank Transfer',
    status: 'Verified' as const,
    createdAt: new Date().toISOString()
  };

  donations.unshift(donation);
  return response.status(201).json({ donation, message: 'Donation recorded successfully.' });
});

app.post('/api/contact', (request: Request, response: Response) => {
  const { fullName, email, subject, message } = request.body as { fullName?: string; email?: string; subject?: string; message?: string };

  if (!fullName || !email || !subject || !message) {
    return response.status(400).json({ message: 'Missing contact form fields.' });
  }

  const entry = {
    id: crypto.randomUUID(),
    fullName,
    email,
    subject,
    message,
    createdAt: new Date().toISOString()
  };

  contactMessages.unshift(entry);
  return response.status(201).json({ message: 'Message received.', entry });
});

app.post('/api/newsletter', (request: Request, response: Response) => {
  const { email } = request.body as { email?: string };

  if (!email) {
    return response.status(400).json({ message: 'Email is required.' });
  }

  const entry = {
    id: crypto.randomUUID(),
    email,
    createdAt: new Date().toISOString()
  };

  newsletterEntries.unshift(entry);
  return response.status(201).json({ message: 'Subscribed successfully.', entry });
});

app.post('/api/join', (request: Request, response: Response) => {
  const payload = request.body as Record<string, string | undefined>;
  const { fullName, mobileNumber, email, state, district } = payload;

  if (!fullName || !mobileNumber || !email || !state || !district) {
    return response.status(400).json({ message: 'Missing membership fields.' });
  }

  return response.status(201).json({
    membershipId: `MBR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    message: 'Membership application received.'
  });
});

app.use((_request: Request, response: Response) => {
  response.status(404).json({ message: 'API route not found.' });
});

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ message: 'Internal server error.' });
});

export default app;
