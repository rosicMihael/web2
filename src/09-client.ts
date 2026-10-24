import express from 'express'
import path from 'path'
import dotenv from 'dotenv';

dotenv.config()
const app = express();
app.set("views", path.join(import.meta.dirname, "views"));
app.set('view engine', 'pug');
app.use(express.static(path.join(import.meta.dirname, "public"))); //css and js are served as separate files (not included in pug)

app.get('/', function (req, res) {    
    res.render('index-spa');
});

app.get("/auth_config.json", (req, res) => {
  res.json({
    "domain": "fer-web2.eu.auth0.com",
    "clientId": process.env.SPA_CLIENT_ID,
    "audience" : 'FER-Web2 WebAPI'
  });
});

const hostname = 'localhost'; // must match the callback URL registered in Auth0
const port = 4092;
app.listen(port, hostname, () => {    
  console.log(`Server running at http://${hostname}:${port}/`);
});