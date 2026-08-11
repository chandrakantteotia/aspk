import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  type QueryConstraint,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';

function assertFirestoreEnabled() {
  if (!db) {
    throw new Error('Firestore is not configured for this environment.');
  }
}

// ─── Generic CRUD helpers ─────────────────────────────────────

/** Get a single document by ID */
export async function getDocument<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  assertFirestoreEnabled();
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

/** Get all documents in a collection */
export async function getCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  assertFirestoreEnabled();
  const ref = collection(db, collectionName);
  const q = query(ref, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
}

/** Add a new document (auto-ID) */
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<string> {
  assertFirestoreEnabled();
  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Set a document with a specific ID */
export async function setDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  assertFirestoreEnabled();
  const ref = doc(db, collectionName, id);
  await setDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

/** Update a document */
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  assertFirestoreEnabled();
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  } as DocumentData);
}

/** Delete a document */
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  assertFirestoreEnabled();
  const ref = doc(db, collectionName, id);
  await deleteDoc(ref);
}

/** Subscribe to a collection in real-time */
export function subscribeToCollection<T>(
  collectionName: string,
  callback: (data: T[]) => void,
  constraints: QueryConstraint[] = []
): Unsubscribe {
  assertFirestoreEnabled();
  const ref = collection(db, collectionName);
  const q = query(ref, ...constraints);
  return onSnapshot(q, snap => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
    callback(data);
  });
}

/** Subscribe to a single document */
export function subscribeToDocument<T>(
  collectionName: string,
  id: string,
  callback: (data: T | null) => void
): Unsubscribe {
  assertFirestoreEnabled();
  const ref = doc(db, collectionName, id);
  return onSnapshot(ref, snap => {
    if (!snap.exists()) return callback(null);
    callback({ id: snap.id, ...snap.data() } as T);
  });
}

// ─── Paginated queries ────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export async function getPaginatedCollection<T>(
  collectionName: string,
  pageSize: number,
  constraints: QueryConstraint[] = [],
  lastDocument?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedResult<T>> {
  assertFirestoreEnabled();
  const ref = collection(db, collectionName);
  const allConstraints = [
    ...constraints,
    limit(pageSize + 1),
    ...(lastDocument ? [startAfter(lastDocument)] : []),
  ];
  const q = query(ref, ...allConstraints);
  const snap = await getDocs(q);
  const hasMore = snap.docs.length > pageSize;
  const docs = hasMore ? snap.docs.slice(0, -1) : snap.docs;
  return {
    data: docs.map(d => ({ id: d.id, ...d.data() } as T)),
    lastDoc: docs[docs.length - 1] ?? null,
    hasMore,
  };
}

// ─── Collection-specific helpers ─────────────────────────────

export { where, orderBy, limit, startAfter };

/** Firestore collections enum */
export const COLLECTIONS = {
  USERS: 'users',
  ADMINS: 'admins',
  ROLES: 'roles',
  PARTY_MEMBERS: 'partyMembers',
  GALLERY: 'gallery',
  EVENTS: 'events',
  NEWS: 'news',
  COMPLAINTS: 'complaints',
  DONATIONS: 'donations',
  CONTACT_MESSAGES: 'contactMessages',
  ANNOUNCEMENTS: 'announcements',
  MANIFESTO: 'manifesto',
  HERO_SLIDES: 'heroSlides',
  WEBSITE_SETTINGS: 'websiteSettings',
  TESTIMONIALS: 'testimonials',
  NEWSLETTER: 'newsletterSubscribers',
  MEMBER_APPLICATIONS: 'memberApplications',
} as const;
