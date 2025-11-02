import mongoose from 'mongoose';

export const createResponse = <T>(data: T, message?: string) => {
  return {
    ok: true,
    data,
    error: null,
    meta: {
      requestId: new mongoose.Types.ObjectId().toString(),
      timestamp: new Date().toISOString(),
      message
    }
  };
};

export const createError = (code: string, message: string, details?: any) => {
  return {
    ok: false,
    error: {
      code,
      message,
      details
    },
    data: null,
    meta: {
      requestId: new mongoose.Types.ObjectId().toString(),
      timestamp: new Date().toISOString()
    }
  };
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const calculateConfidenceScore = (
  recencyHours: number,
  verificationCount: number,
  reporterReputation: number,
  distanceKm: number
): number => {
  const recencyScore = Math.max(0, 1 - recencyHours / 168); // Decay over 7 days
  const verificationScore = Math.min(1, verificationCount / 3); // Max at 3 verifications
  const distanceScore = distanceKm < 2 ? 1 : Math.max(0, 1 - (distanceKm - 2) / 20);
  
  return Math.round(
    (recencyScore * 0.4 + verificationScore * 0.3 + reporterReputation * 0.2 + distanceScore * 0.1) * 100
  );
};

