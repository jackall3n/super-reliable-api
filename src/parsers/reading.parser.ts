import { ReadingMetric } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ReadingInput } from "../database";
import { date, number, object, string } from "yup";

const readingSchema = object({
  name: string().oneOf(Object.values(ReadingMetric)).required(),
  time: date()
    .transform((_, value) => new Date(Number(value) * 1000))
    .required(),
  value: number().required().positive().typeError("value must be a number"),
});

/**
 * Parse a single line of a reading, return an error if it fails
 * @param line
 */
export function parseLine(line: string) {
  const [time, name, value] = line.split(" ");

  const reading = readingSchema.validateSync({
    name,
    time,
    value,
  });

  return reading;
}

/**
 * Parse a string of readings, return an error if it fails
 * @param body
 */
export function parse(body: unknown): ReadingInput[] {
  if (typeof body !== "string") {
    throw new Error("body is not a string");
  }

  const readings = body.split("\n");

  return readings.map((reading, index): ReadingInput => {
    try {
      return parseLine(reading);
    } catch (e) {
      console.error(`failed to parse reading ${index}`);
      console.error(e);

      throw new Error(`readings[${index}] is invalid: ${e.message}`);
    }
  });
}

/**
 * Check if string is valid metric
 * @param metric
 */
export function isValidMetric(metric: string): metric is ReadingMetric {
  return Object.values(ReadingMetric).includes(metric as ReadingMetric);
}

/**
 * Parse readings from request body
 * @param request
 * @param response
 * @param next
 */
export function readingsParser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    request.body = parse(request.body);
  } catch (e) {
    console.error("failed to parse readings");
    console.error(e);

    return response.json({ success: false, error: e.message });
  }

  next();
}
