import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './App.css';

function SpotifyLogin() {
  const [token, setToken] = useState(undefined);
  const authEndpoint = 'https://accounts.spotify.com/authorize';

  // Replace with your app's client ID, redirect URI and desired scopes
  const clientId = "1ebfdbee7eaa4ad9acbf5f4408e379d4";
  const redirectUri = "https://localhost:3000";
  const scopes = [
    "user-read-currently-playing",
      "user-read-playback-state",
  ];

  useEffect(() => {
    const getTokenFromHash = () => {
      const hash = window.location.hash
        .substring(1)
        .split("&")
        .reduce(function(initial, item) {
          if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});

      window.location.hash = "";

      let _token = hash.access_token;
      if (_token) {
        setToken(_token);
      }
    }

    getTokenFromHash();
  }, []);

  return (
    <div>
      {!token && (
        <Button
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </Button>
      )}
      {token && (
        // Pass this token to the main application
        <p>Login Successful: {token}</p>
      )}
    </div>
  );
}

export default SpotifyLogin;
