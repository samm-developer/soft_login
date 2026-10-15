import { useEffect, useState } from 'react';
import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginWithMicrosoft } from './api';
import { loginRequest } from './authConfig';
import './App.css';

function App() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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
        <h1>App 1</h1>
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

export default App;
