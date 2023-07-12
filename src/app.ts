import express, { Express } from "express";
import helmet from "helmet";

import { setupHandlers } from "./handlers";

const app: Express = express();

app.use(helmet());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

setupHandlers(app);

export default app;
