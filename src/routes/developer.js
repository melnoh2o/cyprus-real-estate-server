import express from 'express';

import { create, getAll } from '../controllers/developer.js';

const router = express.Router();

router.get('/get-all', getAll);
router.post('/create', create);

export default router;
