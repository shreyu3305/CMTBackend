import { Router } from 'express';
import authRoutes from './auth.routes';
import medicinesRoutes from './medicines.routes';
import pharmaciesRoutes from './pharmacies.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/medicines', medicinesRoutes);
router.use('/pharmacies', pharmaciesRoutes);

export default router;
