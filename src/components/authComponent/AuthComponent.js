import React, { useState, useEffect } from "react";
import { config } from "../../config/config";
import {
  PublicClientApplication,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
//import "core-js/stable";
import "regenerator-runtime/runtime";
// import { GraphService } from '../../service/GraphService';

export const AuthComponent = (props) => {
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
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
  // let graphService = new GraphService.getInstance();

  useEffect(() => {
    const utente = JSON.parse(sessionStorage.getItem('graphUser'));
    sessionStorage.getItem("graphUser") ? setUser(preuser => preuser = utente) : null;
    console.log('USER STATE: ', user);
    sessionStorage.getItem("autenticazione") ? setIsAuthenticated(preautenticazione => preautenticazione = sessionStorage.getItem("autenticazione")) : null;
    console.log('AUTENTICAZIONE STATE: ', isAuthenticated);
    sessionStorage.getItem("token") ? setToken(pretoken => pretoken = sessionStorage.getItem("token")) : null;
    console.log('Tokennn=====>', token);
  }, [isAuthenticated]);

  //MSAL

  const logIn = async () => {
    try {
      const authResult = await publicClientApplication.loginPopup(
        config.scopes
      );
      sessionStorage.setItem("autenticazione", true);
      sessionStorage.setItem("msalAccount", authResult.account.username);
      const User = await getUser();
      sessionStorage.setItem('graphUser', JSON.stringify(User));
    } catch (err) {
      sessionStorage.setItem("autenticazione", false);
      setIsAuthenticated((preIsAuthenticated) => (preIsAuthenticated = false));
      setError((preError) => (preError = err));
      console.log(error)
    }
    window.location.href = window.location.href
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
        "L'account dell' utente manca nel sessioneStorage. Perfavore sloggati e loggati ntorna."
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
  // graphService.getUser();

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
    <span>
      {user && isAuthenticated ? (
        <span>
          <span style={{ marginRight: '35px', color: 'white', fontSize: '20px' }}>Benvenuto {user.displayName}.</span>
          <button className='btn btn-danger' onClick={logOut}>LogOut</button>
        </span>
      ) : (
          <button className='btn btn-warning' onClick={logIn}>Login</button>
        )}
    </span>
  );
};

