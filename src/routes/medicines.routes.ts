import { Router } from 'express';
import * as medicinesController from '../controllers/medicines.controller';

const router = Router();

router.get('/', medicinesController.getAllMedicines);
router.post('/', medicinesController.createMedicine);
router.put('/:id', medicinesController.updateMedicine);
router.delete('/:id', medicinesController.deleteMedicine);

export default router;
