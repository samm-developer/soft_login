import { useEffect, useState } from 'react';
import './App.css';

function readTokensFromHash() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return {
    idToken: params.get('id_token'),
    accessToken: params.get('access_token'),
  };
}

function App() {
  const [{ idToken, accessToken }] = useState(readTokensFromHash);

  // Drop the tokens from the address bar and history once they're read.
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  return (
    <div className="App">
      <main className="card">
        <h1>App 2</h1>
        {idToken || accessToken ? (
          <>
            {idToken && <TokenPanel label="ID token" token={idToken} />}
            {accessToken && (
              <TokenPanel label="Access token" token={accessToken} />
            )}
          </>
        ) : (
          <p>No tokens received. Generate them in App 1 and click “Open in App 2”.</p>
        )}
      </main>
    </div>
  );
}

function TokenPanel({ label, token }) {
  return (
    <section className="panel">
      <h2>{label}</h2>
      <textarea readOnly rows={3} value={token} aria-label={label} />
    </section>
  );
}

export default App;
