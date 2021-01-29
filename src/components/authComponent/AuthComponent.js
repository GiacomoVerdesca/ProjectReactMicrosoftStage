import React, { useState, useEffect } from "react";
import { config } from "../../config/config";
import {
  PublicClientApplication,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
//import "core-js/stable";
import "regenerator-runtime/runtime";

export const AuthComponent = (props) => {
  const [error, setError] = useState(null);
  // const [isAuthenticated, setIsAuthenticated] = useState();
  // const [user, setUser] = useState();
  const [token, setToken] = useState();
  //istanza per la gestione degli errori tramite MSAL 
  const interactionRequiredAuthError = new InteractionRequiredAuthError();
  //istanza per l' Autenticazione tramite MSAL
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
  //Recupero MicrosoftGraph per le chiamate API
  var graph = require('@microsoft/microsoft-graph-client');

  useEffect(() => {
    console.log('autenticazione sessione: ', sessionStorage.getItem("autenticazione"));
    console.log('Tokennn=====>', token)
  });

  //MSAL
  const logIn = async () => {
    try {
      const authResult = await publicClientApplication.loginPopup(
        config.scopes
      );
      sessionStorage.setItem("autenticazione", true);
      sessionStorage.setItem("msalAccount", authResult.account.username);
      const user = await getUser();
      sessionStorage.setItem('graphUser', JSON.stringify(user));
    } catch (err) {
      setIsAuthenticated((preIsAuthenticated) => (preIsAuthenticated = false));
      setError((preError) => (preError = err));
      console.log(error)
    }
  };

  const logOut = () => {
    publicClientApplication.logout();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('autenticazione');
    sessionStorage.removeItem('graphUser');
  };

  //token
  const getToken = async () => {
    let account = sessionStorage.getItem("msalAccount");
    if (!account) {
      throw new Error(
        "L' account dell' utente manca nel sessioneStorage. Perfavore sloggati e loggati ntorna."
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
      return silentResult.accessToken;
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

  //GRAPH
  const authProvider = {
    getAccessToken: async () => {
      // Call getToken in auth.js
      return await getToken();
    }
  };
  const graphClient = graph.Client.initWithMiddleware({ authProvider });

  const getUser = async () => {
    return await graphClient
      .api('/me')
      // Only get the fields used by the app
      .select('id,displayName,mail,userPrincipalName,mailboxSettings')
      .get();
  }


  return (
    <div>
      {sessionStorage.getItem("autenticazione") ? (
        <div>
          <p>Sei connesso</p>
          <button onClick={logOut}>LogOut</button>
        </div>
      ) : (
          <button onClick={logIn}>Login</button>
        )}

    </div>
  );
};
