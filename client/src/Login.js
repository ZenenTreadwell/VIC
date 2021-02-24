import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Dropdown, Navbar, Row } from 'react-bootstrap';
import './App.css';
import store from 'store';

function SpotifyLogin() {
  const authEndpoint = 'https://accounts.spotify.com/authorize';

  const clientId = "1ebfdbee7eaa4ad9acbf5f4408e379d4";
  const redirectUri = "https://localhost:3000";
  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
  ];

  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`
}

function LoginSelector({platform, setPlatform}) {
  const [target, setTarget] = useState(null);

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
        setPlatform('Spotify');
        store.set('SPOTIFY_TOKEN', _token);
      }
    }

    getTokenFromHash();
  }, [setPlatform]);

  const handleLogout = () => {
    console.log(`target is ${target}`);
    console.log(`platform is ${platform}`);
    console.log("Logging out");
    setTarget(undefined);
    setPlatform(null);
    store.set('PLATFORM', null);
  }

  const handleLogin = (event) => {
    if (target === 'Spotify') {
      window.location.href = SpotifyLogin();
    }
    console.log("hi");
    console.log(`target is ${target}`);
    console.log(`platform is ${platform}`);
  }

  return (
    <div>
      { platform &&
      <Row>
        <Navbar.Text className="pr-2">Logged into {platform}</Navbar.Text>
        <Button variant="info" onClick={handleLogout}>Log Out</Button>
      </Row>
      }


      {!platform &&
        <Dropdown as={ButtonGroup}>
          <Button onClick={handleLogin} variant="outline-info">{target? `Login to ${target}` : "Select Platform"}</Button>

          <Dropdown.Toggle split
            variant="outline-info"
            id="platform-selector"
          />


          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setTarget('Spotify')}>Spotify</Dropdown.Item>
            <Dropdown.Item onClick={() => setTarget('Tidal')}>Tidal</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      }
    </div>
  );
}

export {SpotifyLogin, LoginSelector};
