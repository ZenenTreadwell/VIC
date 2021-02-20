import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import './App.css';
import store from 'store';
import SpotifyLogin from './Login';
import Collage from './Collage';
import PostModal from './PostModal';

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

  const spotifyToken = store.get("SPOTIFY_TOKEN");

  return (
    <div className="App">
      <header className="App-header">
        <Collage />
        <SpotifyLogin />
        <p>{spotifyToken? `Check out my spotify token! ${spotifyToken}` : "No token :("}</p>
        <p>
          This is a message from the API: {msg}
        </p>
      </header>
    </div>
  );
}

export default App;
