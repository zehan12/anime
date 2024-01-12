import { Server } from "http";
import app from "./app";

const PORT = 3000;

const server: Server = app.listen(PORT, (): void => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
