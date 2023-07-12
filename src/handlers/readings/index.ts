import { Express, Request, Response } from "express";
import { constants } from "http2";

import { addReadingsToQueue } from "../../queues/readings.queue";
import { getReadings } from "../../database";
import { readingsParser } from "../../parsers/reading.parser";
import { getPowerReadings } from "./getPowerReadings";

export async function post(request: Request, response: Response) {
  await addReadingsToQueue(request.body);

  return response
    .status(constants.HTTP_STATUS_ACCEPTED)
    .json({ success: true });
}

export async function get(
  request: Request<{}, any, any, { from: string; to: string }>,
  response: Response,
) {
  if (!request.query.from) {
    return response.json({ success: false, error: "from is not defined" });
  }

  if (!request.query.to) {
    return response.json({ success: false, error: "to is not defined" });
  }

  try {
    const from = new Date(request.query.from);
    const to = new Date(request.query.to);

    const readings = await getReadings(from, to);

    const powers = getPowerReadings(from, to, readings);

    return response.json([...readings, ...powers]);
  } catch (e) {
    console.error("failed to get readings from database");
    console.error(e);

    return response.json({ success: false, error: e.message });
  }
}

export function addReadingHandlers(app: Express) {
  app.get("/data", get);
  app.post("/data", readingsParser, post);
}
