import { Request, Response } from 'express';

import prisma from '../../config/prisma';

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

export const getAll = async (req: Request, res: Response) => {
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
      data: realEstates,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Can`t get real estate!',
      error,
    });
  }
};

export const getMinMax = async (req: Request, res: Response) => {
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
    res.status(404).json({
      message: 'Can`t get real estate min and max values!',
      error,
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const newRealEstate = await prisma.realEstate.create({
      data: req.body,
    });

    res.json({ data: newRealEstate });
  } catch (error) {
    res.status(404).json({
      message: 'Can`t create real estate!',
      error,
    });
  }
};

export const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const deletedRealEstate = await prisma.realEstate.delete({
      where: {
        id: id as string,
      },
    });

    res.json({ data: deletedRealEstate });
  } catch (error) {
    res.status(404).json({
      message: 'Can`t delete real estate!',
      error,
    });
  }
};

export const deleteAll = async (req: Request, res: Response) => {
  try {
    await prisma.realEstate.deleteMany({});

    res.json({ message: 'All data deleted!' });
  } catch (error) {
    res.status(404).json({
      message: 'Can`t delete many real estate!',
      error,
    });
  }
};

export const createMany = async (req: Request, res: Response) => {
  try {
    const newRealEstates = await prisma.realEstate.createMany({
      data: req.body,
      skipDuplicates: true,
    });

    res.json({ data: newRealEstates });
  } catch (error) {
    res.status(404).json({
      message: 'Can`t create many real estate!',
      error,
    });
  }
};
