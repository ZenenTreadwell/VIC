import React, { useState, useEffect } from 'react';
import { Button, Card, CardDeck, Container } from 'react-bootstrap';
import './App.css';
import streamAPI from './streamAPI';
import store from 'store';

function Collage() {
  const [songs, setSongs] = useState([]);
  // const [query, setQuery] = useState(false);

  const getSongs = async () => {
    const response = await fetch('http://localhost:9000/posts/songs/', {
      method: 'GET',
    })

    if (response.ok) {
      let res = await response.json();
      setSongs(res)
    }
  };

  useEffect(() => {
    getSongs();
  }, []);

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

  const handleClick = (event) => {
    const songID = event.target.getAttribute("spotifyuri");
    const func = event.target.getAttribute("func");
    
    switch (func) {
      case "queue":
        queueSong(songID);
        break;
      case "play":
        queueSong(songID);
        nextSong();
        break;
      default:
        break;
    }
  };

  const spotifyToken = store.get("SPOTIFY_TOKEN");
  const streamPlatform = 'spotify';
  const stream = streamAPI(streamPlatform, spotifyToken);

  const callback = (err, res) => {
    if (err) {
      if (err.status === 401) {
        store.set("SPOTIFY_TOKEN", null);
      }
      console.error(err);
    } else {
      console.log("Success!");
    }
  }

  const queueSong = async (songID) => {
    if (streamPlatform === 'spotify') {
      stream.queue(`spotify:track:${songID}`, {}, callback);
    }
  }

  const nextSong = async () => {
    if (streamPlatform === 'spotify') {
      stream.skipToNext();
    }
  }

  const renderCard = (json) => {
    const uniqueID = json.entityUniqueId;
    
    // This should be in the database
    const URIs = Object.keys(json.linksByPlatform).reduce((a,v) => ({ ...a, [v]: json.linksByPlatform[v].entityUniqueId.split("::")[1]}), {});
    
    const data = json.entitiesByUniqueId[uniqueID];
    return (
      <Card key={uniqueID}>
        <Card.Img variant="top" src={data.thumbnailUrl} />
        <Card.Body>
          <Card.Title className="h2">{data.title} by {data.artistName}</Card.Title>
          <Card.Text className="h6">This one is gonna be a lil demo</Card.Text>
          <Button onClick={handleClick} spotifyuri={URIs.spotify} func='queue' className="mr-1">Queue</Button>
          <Button onClick={handleClick} spotifyuri={URIs.spotify} func='play'>Play Now</Button>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Posted by Zenen 1 min ago</small>
        </Card.Footer>
      </Card>
    )
  }

  return (
    <Container className="m-3">
      <CardDeck className="text-dark">
        {songs.map(song => renderCard(song))}
      </CardDeck>
    </Container>
  );
}

export default Collage;
