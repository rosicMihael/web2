import express from 'express';
import path from 'path'
import oidc from 'express-openid-connect';
import pageRouter from './routes/pageRoutes.ts';
import apiRouter from './routes/apiRoutes.ts';
const { auth } = oidc;
import dotenv from 'dotenv'
dotenv.config()

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set('view engine', 'pug');

const port = parseInt(process.env.PORT ?? '4080', 10);
const hostname = process.env.HOSTNAME || 'localhost'; // must match the callback URL registered in Auth0

const config = { 
  authRequired : false,
  idpLogout : true, //logout not only from the app, but also from identity provider
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  clientSecret: process.env.CLIENT_SECRET,
  routes: {
    logout: false as const // library registers GET /logout only; POST is used instead (see below)
  },
  authorizationParams: {
    response_type: 'code' ,
    //scope: "openid profile email"   
   },
};
// auth router attaches /login and /callback routes to the baseURL (/logout is disabled in routes)
app.use(auth(config));

app.use('/', pageRouter);
app.use('/api', apiRouter);

// logout changes state (removes session), so POST is used instead of GET
// (otherwise any page could log the user out with a link or redirect - logout CSRF)

app.listen(port, hostname, () => {    
  console.log(`Server running at http://${hostname}:${port}/`);
});