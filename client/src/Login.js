import React, { useState, useEffect } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import './App.css';
import streamAPI from './streamAPI';
import store from 'store';

function SpotifyLogin() {
  const [spotifyAPI, setSpotifyAPI] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const authEndpoint = 'https://accounts.spotify.com/authorize';

  // Replace with your app's client ID, redirect URI and desired scopes
  const clientId = "1ebfdbee7eaa4ad9acbf5f4408e379d4";
  const redirectUri = "https://localhost:3000";
  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
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
        store.set('PLATFORM', 'spotify');
        store.set('SPOTIFY_TOKEN', _token);
      }
    }

    getTokenFromHash();
  }, []);

  if (!Boolean(user)) {
    const token = store.get('SPOTIFY_TOKEN');
    if (token && !spotifyAPI) {
      const api = streamAPI('spotify', token);
      setSpotifyAPI(api);
      api.getMe().then(user => setUser(user));
    }
  }

  const handleLogout = () => {
    console.log("Logging out");
    setSpotifyAPI(undefined);
    store.set('SPOTIFY_TOKEN', null);
    store.set('PLATFORM', null);
  }

  return (
    <div>
      {!Boolean(spotifyAPI) && (
        <Button
          variant="outline-info"
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </Button>
      )}
      {Boolean(spotifyAPI) && (
        <>
          <Navbar.Text className="p-2">Logged in as {user?.display_name}</Navbar.Text>
          <Button variant="info" onClick={handleLogout}>Log Out</Button>
        </>
      )}
    </div>
  );
}

export default SpotifyLogin;
