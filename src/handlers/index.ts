import { addReadingHandlers } from "./readings";
import { Express } from "express";

export function setupHandlers(app: Express) {
  addReadingHandlers(app);
}
