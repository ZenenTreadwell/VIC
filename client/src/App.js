import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import './App.css';
import SpotifyLogin from './Login';

function App() {
  const [msg, setMsg] = useState('not a response yet');

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
    const key = "";
    const response = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}&key=${key}`, {
      method: 'GET',
    });

    if (response.ok) {
      const res = await response.json();
      console.log("we got this data back!");
      console.log(res);
    }
  }

  const handleSubmit = (event) => {
    songlinkFetch(event.target[0].value);
    event.preventDefault();
  };

  return (
    <div className="App">
      <header className="App-header">
        <SpotifyLogin />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="song.url">
            <Form.Label>Paste a song URL here</Form.Label>
            <Form.Control type="url" placeholder="https://open.spotify.com/track/0VohiAknIPTucjlsux5A7V?si=YSjPplqqTCO1eorHF8WG-Q" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Share!
          </Button>
        </Form>


        <p>
          Hey I'm gonna show you a message!
        </p>
        <p>{msg}</p>
      </header>
    </div>
  );
}

export default App;
