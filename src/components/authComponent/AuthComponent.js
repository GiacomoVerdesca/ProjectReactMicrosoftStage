import React, { useState, useEffect } from "react";
import { config } from "../../config/config";
import {
  PublicClientApplication,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
//import "core-js/stable";
import "regenerator-runtime/runtime";

export const AuthComponent = () => {
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState();
  const interactionRequiredAuthError = new InteractionRequiredAuthError();
  const publicClientApplication = new PublicClientApplication({
    auth: {
      clientId: config.appId,
      redirectUri: config.redirectURI,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: true,
    },
  });

  useEffect(() => { });

  const logIn = async () => {
    try {
      const authResult = await publicClientApplication.loginPopup(
        config.scopes
      );
      setIsAuthenticated((preIsAuthenticated) => (preIsAuthenticated = true));
      sessionStorage.setItem("msalAccount", authResult.account.username);
    } catch (err) {
      setIsAuthenticated((preIsAuthenticated) => (preIsAuthenticated = false));
      setError((preError) => (preError = err));
    }
  };

  const logOut = () => {
    publicClientApplication.logout();
    sessionStorage.removeItem('token');
  };

  //token
  const getToken = async () => {
    let account = sessionStorage.getItem("msalAccount");
    if (!account) {
      throw new Error(
        "User account missing from session. Please sign out and sign in again."
      );
    }

    try {
      const silentRequest = {
        scopes: config.scopes,
        account: publicClientApplication.getAccountByUsername(account),
      };
      const silentResult = await publicClientApplication.acquireTokenSilent(
        silentRequest
      );
      sessionStorage.setItem('token', silentResult.accessToken);
      setToken(preToken => preToken = silentResult.accessToken);
      // return silentResult.accessToken;
    } catch (silentError) {
      if (interactionRequiredAuthError) {
        const interactiveResult = await publicClientApplication.acquireTokenPopup(
          config.scopes
        );
        return interactiveResult.accessToken;
      } else {
        throw silentError;
      }
    }
  };

  console.log('Tokennn=====>', token)

  return (
    <div>
      {isAuthenticated ? (
        <p>Sei connesso</p>
      ) : (
          <button onClick={logIn}>Login</button>
        )}
      {isAuthenticated && <div><button onClick={logOut}>LogOut</button> <button onClick={getToken}>GetTOKEN</button></div>}
    </div>
  );
};
