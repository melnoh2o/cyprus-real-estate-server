import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import realEstateRouters from './src/routes/realEstate.js';
import developerRouters from './src/routes/developer.js';
import mailRouters from './src/routes/mail.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use('/api/real-estate', realEstateRouters);
app.use('/api/developer', developerRouters);
app.use('/api/mail', mailRouters);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
