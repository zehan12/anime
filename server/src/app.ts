import express, { Express, Request, Response, Router } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from backend");
});

export default app;