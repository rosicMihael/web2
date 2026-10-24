import express from "express";
import path from "path";
import oidc from "express-openid-connect";
import { auth as jwtAuth } from "express-oauth2-jwt-bearer";
import pageRouter from "./routes/pageRoutes.ts";
import apiRouter from "./routes/apiRoutes.ts";
const { auth } = oidc;
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "pug");

const port = parseInt(process.env.PORT ?? "4080", 10);
const hostname = process.env.HOSTNAME || "localhost";

const config = {
  authRequired: false,
  idpLogout: true,
  secret: process.env.OIDC_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.OIDC_CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  clientSecret: process.env.CLIENT_SECRET,
  routes: {
    logout: false as const,
  },
  authorizationParams: {
    response_type: "code",
    //scope: "openid profile email"
  },
};

const jwtConfig = {
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

app.use("/", pageRouter);
app.use("/api", jwtAuth(jwtConfig), apiRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
