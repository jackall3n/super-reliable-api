import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.reading.create({
    data: {
      name: "Voltage",
      value: 20,
      time: new Date('2022-10-14T12:00:00'), // My Birthday
    },
  });

  await prisma.reading.create({
    data: {
      name: "Current",
      value: 10,
      time: new Date('2022-10-14T16:00:00'),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
