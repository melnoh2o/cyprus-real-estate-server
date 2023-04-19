import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import realEstateRouters from './routes/real-estate';
import developerRouters from './routes/developer';
import mailRouters from './routes/mail';

dotenv.config();

const app: Express = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use('/api/real-estate', realEstateRouters);
app.use('/api/developer', developerRouters);
app.use('/api/mail', mailRouters);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
