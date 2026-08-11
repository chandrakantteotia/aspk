import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, firebaseEnabled } from './config';
import type { UserProfile } from '@/types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/** Sign up with email and password */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  if (!firebaseEnabled || !auth || !db) {
    throw new Error('Firebase is not configured for this environment.');
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  // Create user profile in Firestore
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    email,
    displayName,
    role: 'member',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return credential.user;
}

/** Sign in with email and password */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  if (!firebaseEnabled || !auth) {
    throw new Error('Firebase is not configured for this environment.');
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/** Sign in with Google — uses redirect to avoid COOP popup issues */
export async function signInWithGoogle(): Promise<void> {
  if (!firebaseEnabled || !auth) {
    throw new Error('Firebase is not configured.');
  }
  await signInWithRedirect(auth, googleProvider);
}

/** Call this on the login page mount to get the result after redirect */
export async function getGoogleRedirectResult(): Promise<User | null> {
  if (!firebaseEnabled || !auth || !db) return null;
  try {
    const result = await getRedirectResult(auth);
    if (!result?.user) return null;
    const user = result.user;
    // Create Firestore profile if first login
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'member',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch {
      // Firestore write failed — still return user so auth works
    }
    return user;
  } catch (err: any) {
    // 400 / auth/null-user are normal when no redirect is pending — ignore silently
    if (
      err?.code === 'auth/null-user' ||
      err?.code === 'auth/no-auth-event' ||
      err?.message?.includes('400') ||
      err?.status === 400
    ) {
      return null;
    }
    return null;
  }
}

/** Sign out */
export async function signOut(): Promise<void> {
  if (!firebaseEnabled || !auth) {
    return;
  }

  await firebaseSignOut(auth);
}

/** Send password reset email */
export async function resetPassword(email: string): Promise<void> {
  if (!firebaseEnabled || !auth) {
    throw new Error('Firebase is not configured for this environment.');
  }

  await sendPasswordResetEmail(auth, email);
}

/** Get user profile from Firestore */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!firebaseEnabled || !db) return null;

  try {
    // Race against a 5s timeout so we never hang the admin loader
    const fetchPromise = getDoc(doc(db, 'users', uid));
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('profile_timeout')), 5000)
    );

    const userSnap = await Promise.race([fetchPromise, timeoutPromise]) as any;
    if (!userSnap?.exists?.()) return null;
    return userSnap.data() as UserProfile;
  } catch {
    return null;
  }
}

/** Check if user is admin */
export async function isUserAdmin(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  return profile?.role === 'admin' || profile?.role === 'superadmin' || profile?.role === 'editor';
}

/** Subscribe to auth state changes */
export function onAuthChange(callback: (user: User | null) => void) {
  if (!firebaseEnabled || !auth) {
    queueMicrotask(() => callback(null));
    return () => undefined;
  }

  return onAuthStateChanged(auth, callback);
}
