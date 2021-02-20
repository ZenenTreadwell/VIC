import React, { useState, useEffect } from 'react';
import { Button, Card, CardColumns, Container } from 'react-bootstrap';
import './App.css';
import PostModal from './PostModal';
import streamAPI from './streamAPI';
import fuzzyDateOffset from './fuzzyDateOffset';
import store from 'store';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

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

  useEffect(() => {
    console.log(songs);
  }, [songs]);

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
    const { entryID, URIs, commentary, songlink, tags, user, created_at } = json;
    const uniqueID = entryID;
    const data = songlink.entitiesByUniqueId[uniqueID];
    return (
      <Card className="shadow" key={uniqueID}>
        <Card.Img variant="top" src={data.thumbnailUrl} />
        <Card.Body>
          <Card.Title className="h2">{data.title} by {data.artistName}</Card.Title>
          <Card.Text className="h6 font-italic">{commentary || "No Comment"}</Card.Text>
        </Card.Body>
        <Card.Body>
          <Card.Text className="h4 float-left">Tags</Card.Text>
          <ReactTagInput
            tags={tags}
            readOnly={true}
          />
        </Card.Body>
        <Card.Body>
          <Button onClick={handleClick} spotifyuri={URIs[streamPlatform]} func='queue' className="mr-1">Queue</Button>
          <Button onClick={handleClick} spotifyuri={URIs[streamPlatform]} func='play'>Play Now</Button>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Posted by { user === -1 ? "Zenen" : "Someone"} {fuzzyDateOffset(created_at)}</small>
        </Card.Footer>
      </Card>
    )
  }

  return (
    <Container className="m-5">
      <CardColumns className="text-dark">
        <Card bg="secondary" className="p-2" key="add">
          <PostModal getSongs={getSongs}/>
        </Card>
        {songs.map(song => renderCard(song))}
      </CardColumns>
    </Container>
  );
}

export default Collage;
