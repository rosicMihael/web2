import express from "express";
import path from "path";
import pageRouter from "./routes/pageRoutes.ts";
import apiRouter from "./routes/apiRouter.ts";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(import.meta.dirname, "public")));

const port = parseInt(process.env.PORT ?? "4080", 10);
const hostname = process.env.HOSTNAME || "localhost";

app.use("/", pageRouter);
app.use("/api", apiRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
