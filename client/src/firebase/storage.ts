import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type StorageReference,
} from 'firebase/storage';
import { storage } from './config';

function assertStorageEnabled() {
  if (!storage) {
    throw new Error('Storage is not configured for this environment.');
  }
}

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  error?: string;
}

/** Upload a file with progress tracking */
export function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    assertStorageEnabled();
    const storageRef: StorageReference = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({ progress });
      },
      error => {
        onProgress?.({ progress: 0, error: error.message });
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onProgress?.({ progress: 100, downloadURL });
        resolve(downloadURL);
      }
    );
  });
}

const IMGBB_API_KEY = '90446f02592a920ee69ff7fb0c128c17';

function uploadImageToImgBBWithProgress(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress?.({ progress });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            const url = response.data.url;
            onProgress?.({ progress: 100, downloadURL: url });
            resolve(url);
          } else {
            const err = response.error?.message || 'Failed to upload image';
            onProgress?.({ progress: 0, error: err });
            reject(new Error(err));
          }
        } catch (e) {
          reject(e);
        }
      } else {
        const err = `HTTP Error: ${xhr.status}`;
        onProgress?.({ progress: 0, error: err });
        reject(new Error(err));
      }
    };

    xhr.onerror = () => {
      onProgress?.({ progress: 0, error: 'Network error occurred' });
      reject(new Error('Network error occurred'));
    };

    xhr.send(formData);
  });
}

/** Upload an image to the gallery folder (Now uses ImgBB) */
export function uploadGalleryImage(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  return uploadImageToImgBBWithProgress(file, onProgress);
}

/** Upload member photo (Now uses ImgBB) */
export function uploadMemberPhoto(
  file: File,
  memberId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  return uploadImageToImgBBWithProgress(file, onProgress);
}

/** Upload membership application documents */
export function uploadApplicationDoc(
  file: File,
  applicantId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  // Documents (like PDFs) still go to Firebase Storage since ImgBB is images only
  const timestamp = Date.now();
  const ext = file.name.split('.').pop();
  const path = `applications/${applicantId}/${timestamp}.${ext}`;
  return uploadFile(file, path, onProgress);
}

/** Upload hero/news images (Now uses ImgBB) */
export function uploadContentImage(
  file: File,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  return uploadImageToImgBBWithProgress(file, onProgress);
}

/** Delete a file by its storage URL */
export async function deleteFile(url: string): Promise<void> {
  if (url.includes('ibb.co')) {
    // ImgBB image, deletion not supported without delete token.
    return;
  }
  assertStorageEnabled();
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
}

/** Get optimized image URL with size params */
export function getOptimizedImageUrl(
  url: string,
  width = 800,
  quality = 80
): string {
  if (!url || url.startsWith('blob:')) return url;
  if (url.includes('unsplash.com')) {
    return `${url.split('?')[0]}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }
  return url;
}
