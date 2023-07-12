import { PrismaClient, Reading } from "@prisma/client";

const prisma = new PrismaClient();

export type ReadingInput = Pick<Reading, "name" | "value" | "time">;

/**
 * Store a reading in the database
 */
export async function addReading(reading: ReadingInput): Promise<Reading> {
  return await prisma.reading.create({
    data: {
      name: reading.name,
      value: reading.value,
      time: reading.time,
    },
  });
}

/**
 * Retrieve a readings from the database using the given date range
 */
export async function getReadings(from: Date, to: Date): Promise<Reading[]> {
  return await prisma.reading.findMany({
    select: {
      name: true,
      time: true,
      value: true,
    },
    where: {
      time: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      time: "asc",
    }
  });
}

/**
 * Retrieve a reading from the database using the given id
 */
export async function getReading(id: number): Promise<Reading | null> {
  try {
    return await prisma.reading.findFirst({
      where: {
        id,
      },
    });
  } catch (e) {
    console.error("failed to get reading from database");
    console.error(e);

    throw e;
  }
}
