import prisma from '../../config/prisma.js';

const PER_PAGE = 6;

export const getAll = async (req, res) => {
  try {
    const { developer, location, handover, page, initialPrice, finalPrice } = req.query;

    const currentPage = Math.max(Number(page || 1), 1);

    const options = {
      take: PER_PAGE,
      skip: (currentPage - 1) * PER_PAGE,
    };
    const countOptions = {};
    const allData = await prisma.realEstate.findMany();

    const initial = initialPrice ? parseInt(initialPrice) : 0;
    const final = finalPrice
      ? parseInt(finalPrice)
      : Math.max.apply(
          null,
          allData.map((realEstate) => realEstate.price)
        );

    options.where = {
      developer: { in: developer },
      location: { in: location },
      handover: { in: handover },
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

export const getMinMax = async (req, res) => {
  try {
    const realEstates = await prisma.realEstate.findMany();

    const onlyPrices = realEstates.map((realEstate) => realEstate.price);

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

export const getValues = async (req, res) => {
  try {
    const realEstates = await prisma.realEstate.findMany();

    const developers = [...new Set(realEstates.map((realEstate) => realEstate.developer))]
      .map((item, index) => ({ id: index + 1, name: item, value: item }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const locations = [...new Set(realEstates.map((realEstate) => realEstate.location))]
      .map((item, index) => ({ id: index + 1, name: item, value: item }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const handovers = [...new Set(realEstates.map((realEstate) => realEstate.handover))]
      .map((item, index) => ({ id: index + 1, name: item, value: item }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      developers,
      locations,
      handovers,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Can`t get real estate min and max values!',
      error,
    });
  }
};

export const create = async (req, res) => {
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

export const deleteById = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedRealEstate = await prisma.realEstate.delete({
      where: {
        id: id,
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

export const deleteAll = async (req, res) => {
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

export const createMany = async (req, res) => {
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
