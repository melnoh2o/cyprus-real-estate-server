import express from 'express';

import { letterToUs, sentMail } from '../controllers/mail.js';

const router = express.Router();

router.post('/sent', sentMail);
router.post('/letter', letterToUs);

export default router;
