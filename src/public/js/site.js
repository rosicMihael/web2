
let auth0Client = null; // auth0 is the global object exposed by auth0-spa-js
const fetchAuthConfig = () => fetch("/auth_config.json");
const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();    
  
    auth0Client = await auth0.createAuth0Client({
      domain: config.domain,
      clientId: config.clientId,
      cacheLocation: 'localstorage', //default is memory
      authorizationParams: {
        audience: config.audience,
        redirect_uri: window.location.origin,
        scope: "openid profile email read:protected"   
      }
    });
  };

const login = async () => {
    await auth0Client.loginWithRedirect();
};

const logout = async () => {
    await auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    });
};

window.onload = async () => {
    document.getElementById('btnGetData').addEventListener("click", getdata);
    document.getElementById('btnLogout').addEventListener("click", logout);
    document.getElementById('btnLogin').addEventListener("click", login);

    await configureClient();
  
    const isAuthenticated = await auth0Client.isAuthenticated();
    updateUI();
    if (isAuthenticated) {
        // show the gated content
        return;
    }

    //must be included to handle redirect!
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        await auth0Client.handleRedirectCallback();
        
        updateUI();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
  };

  const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    document.getElementById('btnLogin').style.display = isAuthenticated ? "none" : "block" ;
    document.getElementById('btnLogout').style.display = isAuthenticated ? "block" : "none" ;
  }

const serverUri = "http://127.0.0.1:4091";

const getdata = async () => {
    try {    
      // Get the access token from the Auth0 client
      const token = await auth0Client.getTokenSilently();      
  
      // Make the call to the API, setting the token
      // in the Authorization header
      const response = await fetch(`${serverUri}/protected`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) { // e.g. 401 (invalid token) or 403 (missing scope)
        document.getElementById('content').innerHTML = `${response.status} : ${await response.text()}`;
        return;
      }

      // Fetch the JSON result
      const responseData = await response.json();
  
      document.getElementById('content').innerHTML = JSON.stringify(responseData);        
  
  } catch (e) {
      // Display errors in the console
      document.getElementById('content').innerHTML = e;     
    }
  };


