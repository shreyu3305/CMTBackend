import { Router } from 'express';
import * as pharmaciesController from '../controllers/pharmacies.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', pharmaciesController.getAllPharmacies);
router.get('/:id', pharmaciesController.getPharmacyById);
router.post('/', authenticate, authorize('PHARMACIST', 'ADMIN'), pharmaciesController.createPharmacy);
router.put('/:id', authenticate, pharmaciesController.updatePharmacy);

export default router;
