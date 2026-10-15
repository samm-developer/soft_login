import { useEffect, useState } from 'react';
import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginWithMicrosoft } from './api';
import { APP2_URL, loginRequest } from './authConfig';
import './App.css';

function App() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Once MSAL has an account, exchange its ID token for our backend user.
  useEffect(() => {
    if (!isAuthenticated || inProgress !== InteractionStatus.None) {
      return;
    }
    let ignore = false;
    instance
      .acquireTokenSilent({ ...loginRequest, account: accounts[0] })
      .then(({ idToken }) => loginWithMicrosoft(idToken))
      .then((u) => !ignore && setUser(u))
      .catch((e) => !ignore && setError(e.message));
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, inProgress, instance, accounts]);

  const generateIdToken = () => setIdToken(randomToken());
  const generateAccessToken = () => setAccessToken(randomToken());

  const openInApp2 = () => {
    // Tokens go in the fragment, which browsers never send to a server.
    const fragment = new URLSearchParams({
      id_token: idToken,
      access_token: accessToken,
    });
    window.open(`${APP2_URL}/#${fragment}`, '_blank', 'noopener');
  };

  const signIn = () => {
    setError(null);
    instance.loginPopup(loginRequest).catch((e) => setError(e.message));
  };

  const signOut = () => {
    setUser(null);
    instance.logoutRedirect({ account: accounts[0] });
  };

  return (
    <div className="App">
      <main className="card">
        <h1>App 11</h1>
        <section className="tokens">
          <div className="actions">
            <button className="btn" onClick={generateIdToken}>
              Generate ID token
            </button>
            <button className="btn" onClick={generateAccessToken}>
              Generate access token
            </button>
          </div>
          {idToken && <TokenBox label="ID token" value={idToken} />}
          {accessToken && <TokenBox label="Access token" value={accessToken} />}
          <button
            className="btn btn-primary"
            onClick={openInApp2}
            disabled={!idToken || !accessToken}
          >
            Open in App 2
          </button>
        </section>
        {isAuthenticated ? (
          <>
            {user ? (
              <dl>
                <dt>Name</dt>
                <dd>{user.name}</dd>
                <dt>Email</dt>
                <dd>{user.email}</dd>
                <dt>User ID</dt>
                <dd>{user.id}</dd>
              </dl>
            ) : (
              !error && <p>Loading your profile…</p>
            )}
            <button className="btn" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <button
            className="btn btn-microsoft"
            onClick={signIn}
            disabled={inProgress !== InteractionStatus.None}
          >
            Sign in with Microsoft
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}

// 32 random bytes, base64url-encoded. Not a real Microsoft token.
function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function TokenBox({ label, value }) {
  return (
    <label className="token">
      {label}
      <textarea readOnly rows={4} value={value} />
    </label>
  );
}

export default App;
