import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import './App.css';
import store from 'store';
import SpotifyLogin from './Login';
import Collage from './Collage';

function App() {
  const [msg, setMsg] = useState('not a response yet');
  const [query, setQuery] = useState(false);

  const callAPIDemo = async () => {
    const response = await fetch('http://localhost:9000/newRoute', {
      method: 'GET',
    })

    if (response.ok) {
      let res = await response.text();
      setMsg(res)
    }
  };

  useEffect(() => {
    callAPIDemo();
  }, []);

  const songlinkFetch = async (url) => {
    const key = "951edc7e-336c-484f-9c87-0ca05fd4b92a";
    const CORS = "http://localhost:8080/";
    const response = await fetch(`${CORS}https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}&key=${key}`, {
      method: 'GET',
    });

    if (response.ok) {
      const res = await response.json();
      postToAPI(res);
    }

    setQuery(false);
  }

  const postToAPI = async (json) => {
    console.log(JSON.stringify(json));
    const result = await fetch('http://localhost:9000/posts/songs/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(json),
    });

    console.log(result);
  }

  const handleSubmit = (event) => {
    setQuery(true);
    songlinkFetch(event.target[0].value);
    event.preventDefault();
  };

  const spotifyToken = store.get("SPOTIFY_TOKEN");

  return (
    <div className="App">
      <header className="App-header">
        <Collage />
        <SpotifyLogin />
        <p>{spotifyToken? `Check out my spotify token! ${spotifyToken}` : "No token :("}</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="song.url">
            <Form.Label>Paste a song URL here</Form.Label>
            <Form.Control type="url" placeholder="https://open.spotify.com/track/0VohiAknIPTucjlsux5A7V?si=YSjPplqqTCO1eorHF8WG-Q" />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={query}>
            Share!
          </Button>
        </Form>
        <p>
          This is a message from the API: {msg}
        </p>
      </header>
    </div>
  );
}

export default App;
