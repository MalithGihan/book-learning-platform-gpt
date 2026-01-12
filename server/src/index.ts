import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { connectDB } from "./config/db";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function start() {
  const port = Number(process.env.SERVER_PORT || 4000);
  await connectDB(process.env.MONGO_URI || "");

  const app = createApp();
  app.listen(port, () => console.log(`-----------Run on--------> http://localhost:${port}`));
}

start().catch((e) => {
  console.error("-----------Failed--------> Start failed:", e);
  process.exit(1);
});
