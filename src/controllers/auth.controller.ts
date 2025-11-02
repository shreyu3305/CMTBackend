import { Request, Response } from 'express';
import User from '../models/User';
import Pharmacy from '../models/Pharmacy';
import authService from '../services/auth.service';
import { createResponse, createError } from '../utils/helpers';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, role = 'user', pharmacyName, pharmacyAddress, phone } = req.body;

    if (!email || !password) {
      res.status(400).json(createError('VALIDATION_ERROR', 'Email and password are required'));
      return;
    }

    // If registering as pharmacist, require pharmacy details
    if (role === 'pharmacist') {
      if (!pharmacyName || !pharmacyAddress) {
        res.status(400).json(createError('VALIDATION_ERROR', 'Pharmacy name and address are required for pharmacist registration'));
        return;
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json(createError('CONFLICT', 'User already exists'));
      return;
    }

    const passwordHash = await authService.hashPassword(password);

    let pharmacyId = undefined;

    // Create pharmacy record if registering as pharmacist
    if (role === 'pharmacist' && pharmacyName && pharmacyAddress) {
      // Default coordinates (can be updated later)
      const pharmacy = new Pharmacy({
        name: pharmacyName,
        address: pharmacyAddress,
        latitude: 0, // Default, should be updated with actual location
        longitude: 0, // Default, should be updated with actual location
        phone: phone || email, // Use phone if provided, otherwise use email
        email: email.toLowerCase(),
        isVerified: false
      });

      await pharmacy.save();
      pharmacyId = pharmacy._id;
    }

    const user = new User({
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      role,
      pharmacyId
    });

    await user.save();

    res.status(201).json(createResponse({ 
      userId: user._id, 
      email: user.email,
      pharmacyId: pharmacyId?.toString() 
    }, 'User registered successfully'));
  } catch (error: any) {
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json(createError('VALIDATION_ERROR', 'Email and password are required'));
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json(createError('UNAUTHORIZED', 'Invalid credentials'));
      return;
    }

    const isValidPassword = await authService.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json(createError('UNAUTHORIZED', 'Invalid credentials'));
      return;
    }

    const payload = {
      userId: (user._id as any).toString(),
      email: user.email,
      roles: [user.role]
    };

    const accessToken = authService.generateAccessToken(payload);
    const refreshToken = authService.generateRefreshToken(payload);

    res.status(200).json(createResponse({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        pharmacyId: user.pharmacyId?.toString()
      }
    }, 'Login successful'));
  } catch (error: any) {
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json(createError('VALIDATION_ERROR', 'Refresh token is required'));
      return;
    }

    const payload = authService.verifyRefreshToken(refreshToken);
    const newAccessToken = authService.generateAccessToken(payload);

    res.status(200).json(createResponse({ accessToken: newAccessToken }, 'Token refreshed'));
  } catch (error: any) {
    res.status(401).json(createError('UNAUTHORIZED', 'Invalid refresh token'));
  }
};
