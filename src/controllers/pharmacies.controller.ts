import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth.middleware';
import Pharmacy from '../models/Pharmacy';
import Medicine from '../models/Medicine';
import { createResponse, createError } from '../utils/helpers';

export const getAllPharmacies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicineName } = req.query;
    
    // If searching by medicine name, find pharmacies that have this medicine
    if (medicineName && typeof medicineName === 'string') {
      const searchTerm = medicineName.trim();
      console.log('Searching for medicine:', searchTerm);
      
      // First, let's check all medicines to see what we have
      const allMedicines = await Medicine.find({});
      console.log('All medicines in DB:', allMedicines.map((m: any) => ({ name: m.name, pharmacyId: m.pharmacyId?.toString() })));
      
      // Find all medicines matching the name (case-insensitive regex)
      const medicines = await Medicine.find({
        name: { $regex: searchTerm, $options: 'i' },
        pharmacyId: { $exists: true, $ne: null }
      });
      
      console.log('Found medicines matching "' + searchTerm + '":', medicines.length);
      medicines.forEach((m: any) => {
        console.log(`  - ${m.name} (pharmacyId: ${m.pharmacyId?.toString()})`);
      });
      
      // Get unique pharmacy IDs from medicines (use string comparison for uniqueness)
      const pharmacyIdStrings = medicines
        .map((med: any) => med.pharmacyId?.toString())
        .filter(Boolean);
      const uniquePharmacyIdStrings = [...new Set(pharmacyIdStrings)];
      
      console.log('Unique pharmacy ID strings:', uniquePharmacyIdStrings.length, uniquePharmacyIdStrings);
      
      if (uniquePharmacyIdStrings.length > 0) {
        // Convert to ObjectIds for query
        const objectIds = uniquePharmacyIdStrings.map((idStr: string) => 
          new mongoose.Types.ObjectId(idStr)
        );
        
        const pharmacies = await Pharmacy.find({
          _id: { $in: objectIds }
        });
        
        console.log('Found pharmacies:', pharmacies.length);
        res.status(200).json(createResponse(pharmacies));
      } else {
        console.log('No pharmacies found for medicine:', medicineName);
        res.status(200).json(createResponse([]));
      }
    } else {
      // Return all pharmacies if no medicine search
      const pharmacies = await Pharmacy.find();
      res.status(200).json(createResponse(pharmacies));
    }
  } catch (error: any) {
    console.error('Error in getAllPharmacies:', error);
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};

export const getPharmacyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pharmacy = await Pharmacy.findById(id);

    if (!pharmacy) {
      res.status(404).json(createError('NOT_FOUND', 'Pharmacy not found'));
      return;
    }

    res.status(200).json(createResponse(pharmacy));
  } catch (error: any) {
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};

export const createPharmacy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, latitude, longitude, phone, email, isVerified, openHours } = req.body;

    if (!name || !address || !latitude || !longitude) {
      res.status(400).json(createError('VALIDATION_ERROR', 'Name, address, and coordinates are required'));
      return;
    }

    const pharmacy = new Pharmacy({ name, address, latitude, longitude, phone, email, isVerified, openHours });
    await pharmacy.save();
    res.status(201).json(createResponse(pharmacy));
  } catch (error: any) {
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};

export const updatePharmacy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, address, phone, email, isVerified, openHours, latitude, longitude } = req.body;

    // Get current user
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(createError('UNAUTHORIZED', 'Authentication required'));
      return;
    }

    // Find user to check their pharmacyId
    const User = (await import('../models/User')).default;
    const user = await User.findById(userId);
    
    console.log('Update pharmacy - User:', { userId, userRole: user?.role, userPharmacyId: user?.pharmacyId?.toString(), requestedPharmacyId: id });
    
    if (!user) {
      res.status(401).json(createError('UNAUTHORIZED', 'User not found'));
      return;
    }

    // Check if user owns this pharmacy (pharmacists can only update their own pharmacy)
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      res.status(404).json(createError('NOT_FOUND', 'Pharmacy not found'));
      return;
    }

    // Check if user is pharmacist and owns this pharmacy
    const isOwner = user.pharmacyId && user.pharmacyId.toString() === id;
    
    if (!isOwner) {
      res.status(403).json(createError('FORBIDDEN', 'You can only update your own pharmacy'));
      return;
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (openHours !== undefined) updateData.openHours = openHours;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;

    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    res.status(200).json(createResponse(updatedPharmacy));
  } catch (error: any) {
    console.error('Error updating pharmacy:', error);
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};
