import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma';

dotenv.config();

const app: Express = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 8000;

const PER_PAGE = 6;

interface Options {
  take: number;
  skip: number;
  where?: any;
  orderBy?: any;
}

interface CountOptions {
  where?: any;
  orderBy?: any;
}

app.get('/getAll', async (req: Request, res: Response) => {
  try {
    const { developer, location, handover, page, initialPrice, finalPrice } = req.query;

    const currentPage = Math.max(Number(page || 1), 1);

    const options: Options = {
      take: PER_PAGE as number,
      skip: ((currentPage - 1) * PER_PAGE) as number,
    };
    const countOptions: CountOptions = {};
    const allData = await prisma.realEstate.findMany();

    const initial: number = initialPrice ? parseInt(initialPrice as string) : 0;
    const final: number = finalPrice
      ? parseInt(finalPrice as string)
      : Math.max.apply(
          null,
          allData.map<number>((realEstate) => realEstate.price)
        );

    options.where = {
      developer: { in: developer as string },
      location: { in: location as string },
      handover: { in: handover as string },
      price: {
        gte: initial,
        lte: final,
      },
    };
    options.orderBy = {
      price: 'asc',
    };
    countOptions.where = options.where;
    countOptions.orderBy = options.orderBy;

    const realEstates = await prisma.realEstate.findMany(options);

    const totalQuantity = await prisma.realEstate.count(countOptions);

    const totalPages = Math.ceil(totalQuantity / PER_PAGE);

    res.json({
      totalPages,
      currentPage,
      totalQuantity: totalQuantity,
      content: realEstates,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
});

app.get('/getMinMax', async (req: Request, res: Response) => {
  try {
    const realEstates = await prisma.realEstate.findMany();

    const onlyPrices = realEstates.map<number>((realEstate) => realEstate.price);

    const max = function () {
      return Math.max.apply(null, onlyPrices);
    };

    const min = function () {
      return Math.min.apply(null, onlyPrices);
    };

    res.json({ min: min(), max: max() });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
});

app.post('/createRealEstate', async (req: Request, res: Response) => {
  try {
    const realEstate = await prisma.realEstate.create({
      data: req.body,
    });

    res.json(realEstate);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
});

app.post('/createDeveloper', async (req: Request, res: Response) => {
  try {
    const developer = await prisma.developer.create({
      data: req.body,
    });

    res.json(developer);
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong, ${error}`,
    });
  }
});

app.post('/createLocation', async (req: Request, res: Response) => {
  try {
    const location = await prisma.location.create({
      data: req.body,
    });

    res.json(location);
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong, ${error}`,
    });
  }
});

app.post('/createHandover', async (req: Request, res: Response) => {
  try {
    const handover = await prisma.handover.create({
      data: req.body,
    });

    res.json(handover);
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong, ${error}`,
    });
  }
});

app.post('/createManyRealEstate', async (req: Request, res: Response) => {
  try {
    const createMany = await prisma.realEstate.createMany({
      data: req.body,
      skipDuplicates: true,
    });

    res.json(createMany);
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong, ${error}`,
    });
  }
});

app.get('/getAllLocations', async (req: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany();

    res.json(locations);
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong, ${error}`,
    });
  }
});

app.get('/getAllDevelopers', async (req: Request, res: Response) => {
  try {
    const developers = await prisma.developer.findMany();

    res.json(developers);
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong, ${error}`,
    });
  }
});

app.get('/getAllHandovers', async (req: Request, res: Response) => {
  try {
    const handovers = await prisma.handover.findMany();

    res.json(handovers);
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong, ${error}`,
    });
  }
});

app.delete('/deleteAllRealEstate', async (req: Request, res: Response) => {
  try {
    await prisma.realEstate.deleteMany({});

    res.json({ message: 'All data deleted!' });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong, ${error}`,
    });
  }
});

app.delete('/deleteRealEstate', async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const deletedRealEstate = await prisma.realEstate.delete({
      where: {
        id: id as string,
      },
    });

    res.json({ message: `Real estate with ${id} data deleted!`, data: deletedRealEstate });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong, ${error}`,
    });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
