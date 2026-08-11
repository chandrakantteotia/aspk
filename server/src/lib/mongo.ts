import mongoose from 'mongoose';

export async function connectMongo(uri?: string) {
  if (!uri) {
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000
  });

  return true;
}
