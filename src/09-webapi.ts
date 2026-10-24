import express from 'express'
import cors from 'cors'
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer'; //claimCheck, scopeIncludesAny, ...

const app = express();
app.use(cors());

const authServer = 'https://fer-web2.eu.auth0.com';

const checkJwt = auth({
  audience: 'FER-Web2 WebAPI',
  issuerBaseURL: `${authServer}`,
});
app.use(checkJwt);

app.get('/protected', /*requiredScopes('read:protected'),*/ async function (req, res) { //403 if uncommented and scope is missing
  const accesstoken = req.auth!.token; //because of app.use(checkJwt)
  
  try{
    const userInfoResponse = await fetch(`${authServer}/userinfo`, {
      headers : {
        Authorization : `Bearer ${accesstoken}`
      }
    });
    if (!userInfoResponse.ok) {
      throw new Error(`userinfo returned ${userInfoResponse.status}`);
    }
    const user = await userInfoResponse.json();    
    res.json(user);               
  }
  catch(err) {
    console.log(err);
    res.status(502).send("Could not get user info");
  } 
});

const hostname = '127.0.0.1';
const port = 4091; 
app.listen(port, hostname, () => {
  console.log(`Web API running at http://${hostname}:${port}/`);
});