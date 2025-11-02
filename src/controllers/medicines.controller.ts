import { Request, Response } from 'express';
import Medicine from '../models/Medicine';
import { createResponse, createError } from '../utils/helpers';

export const getAllMedicines = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pharmacyId } = req.query;
    const query = pharmacyId ? { pharmacyId } : {};
    const medicines = await Medicine.find(query);
    res.status(200).json(createResponse(medicines));
  } catch (error: any) {
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};

export const createMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, quantity, pharmacyId } = req.body;

    if (!name) {
      res.status(400).json(createError('VALIDATION_ERROR', 'Medicine name is required'));
      return;
    }

    const medicine = new Medicine({ name, quantity, pharmacyId });
    await medicine.save();
    res.status(201).json(createResponse(medicine));
  } catch (error: any) {
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};

export const updateMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, quantity } = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { name, quantity },
      { new: true }
    );

    if (!medicine) {
      res.status(404).json(createError('NOT_FOUND', 'Medicine not found'));
      return;
    }

    res.status(200).json(createResponse(medicine));
  } catch (error: any) {
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};

export const deleteMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      res.status(404).json(createError('NOT_FOUND', 'Medicine not found'));
      return;
    }

    res.status(200).json(createResponse({ success: true }));
  } catch (error: any) {
    res.status(500).json(createError('INTERNAL_ERROR', error.message));
  }
};
