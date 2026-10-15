import { LogLevel } from '@azure/msal-browser';

export const REDIRECT_PATH = '/redirect';

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${
      process.env.REACT_APP_AZURE_TENANT_ID || 'common'
    }`,
    // MSAL v5 returns auth responses to a bridge page; see index.js.
    redirectUri: `${window.location.origin}${REDIRECT_PATH}`,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii && level === LogLevel.Error) {
          console.error(message);
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
};

export const APP2_URL = process.env.REACT_APP_APP2_URL || 'http://localhost:3001';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
