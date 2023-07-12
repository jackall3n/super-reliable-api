import { addReading, ReadingInput } from "../database";
import Queue from "bull";

const readingsQueue = new Queue<ReadingInput>(
  "readings:create",
  process.env.REDIS_URL as string,
);

export function addReadingToQueue(reading: ReadingInput) {
  readingsQueue.add(reading);
}

export function addReadingsToQueue(readings: ReadingInput[]) {
  for (const reading of readings) {
    addReadingToQueue(reading);
  }
}

readingsQueue.process(async (job, done) => {
  console.log('processing reading', job.id)

  await addReading(job.data);

  done();
});
