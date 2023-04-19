import express from 'express';

import {
  create,
  createMany,
  deleteAll,
  deleteById,
  getAll,
  getMinMax,
  getValues,
} from '../../controllers/real-estate';

const router = express.Router();

router.get('/get-all', getAll);
router.get('/get-min-max', getMinMax);
router.get('/get-values', getValues);
router.post('/create', create);
router.post('/create-many', createMany);
router.delete('/delete', deleteById);
router.delete('/delete-all', deleteAll);

export default router;
