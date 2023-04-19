import express from 'express';

import {
  createMany,
  create,
  deleteAll,
  deleteById,
  getAll,
  getMinMax,
  getValues,
} from '../controllers/realEstate.js';

const router = express.Router();

router.get('/get-all', getAll);
router.get('/get-min-max', getMinMax);
router.get('/get-values', getValues);
router.post('/create', create);
router.post('/create-many', createMany);
router.delete('/delete', deleteById);
router.delete('/delete-all', deleteAll);

export default router;
