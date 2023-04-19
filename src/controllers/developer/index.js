import prisma from '../../config/prisma';

export const create = async (req, res) => {
  try {
    const newDeveloper = await prisma.developer.create({
      data: req.body,
    });

    res.json({ data: newDeveloper });
  } catch (error) {
    res.status(404).json({
      message: 'Can`t create developer!',
      error,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const developers = await prisma.developer.findMany();

    res.json(developers);
  } catch (error) {
    res.status(404).json({
      message: 'Can`t get all developers!',
      error,
    });
  }
};
