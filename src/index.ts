import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma';

dotenv.config();

const app: Express = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get('/getAll', async (req: Request, res: Response) => {
  try {
    const { developer, location, handover, take } = req.query;

    const realEstates = await prisma.realEstate.findMany({
      take: Number(take as unknown as number),
      where: {
        developer: { in: developer as string },
        location: { in: location as string },
        handover: { in: handover as string },
      },
    });

    res.json(realEstates);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
