import React, { useState, useEffect } from "react";
import { config } from "../../config/config";
import { PublicClientApplication } from "@azure/msal-browser";
//import "core-js/stable";
import "regenerator-runtime/runtime"; 

export const AuthComponent = () => {
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const publicClientApplication = new PublicClientApplication({
    auth: {
      clientId: config.appId,
      redirectUri: config.redirectURI
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: true,
    },
  });

  useEffect(() => {});

     const logIn=  async() =>{
    try {
      await publicClientApplication.loginPopup(config.scopes);
      setIsAuthenticated((preIsAuthenticated) => (preIsAuthenticated = true));
    } catch (err) {
      setIsAuthenticated((preIsAuthenticated) => (preIsAuthenticated = false));
      setError((preError) => (preError = err)); 
    }
  }

  const logOut = () => {
    publicClientApplication.logout();
  };

  return (
    <div>
      {isAuthenticated ? <p>Sei connesso</p> : <button onClick={logIn}>Login</button>}
      {isAuthenticated && <button onClick={logOut}>LogOut</button>}
    </div>
  );
};
