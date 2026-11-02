import express from "express";
import path from "path";
import pageRouter from "./routes/pageRoutes.ts";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "pug");

const port = parseInt(process.env.PORT ?? "4080", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";

app.use("/", pageRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
