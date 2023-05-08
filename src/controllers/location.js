import prisma from '../../config/prisma.js';

export const create = async (req, res) => {
  try {
    const { location, area, isArchive, thumbUrl, description, images } = req.body;
    const newLocation = await prisma.location.create({
      data: {
        location,
        area,
        isArchive,
        thumbUrl,
        description,
        images: {
          createMany: {
            data: images,
          },
        },
      },
    });

    res.json({ data: newLocation });
  } catch (error) {
    res.status(404).json({
      message: 'Can`t create location!',
      error,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      include: {
        images: true,
      },
    });

    res.json(locations);
  } catch (error) {
    res.status(404).json({
      message: 'Can`t get all locations!',
      error,
    });
  }
};
