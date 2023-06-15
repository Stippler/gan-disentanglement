import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { space, direction, page, limit } = req.query;

  // calculate how many records to skip
  const skip = page > 1 ? (page - 1) * limit : 0;

  try {
    const walks = await prisma.walk.findMany({
      where: {
        space: space,
        direction: direction,
      },
      include: {
        attributes: {
          include: {
            steps: {
              orderBy: {
                intensity: 'asc',
              },
            },
          },
        },
      },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    res.status(200).json(walks);
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
};
