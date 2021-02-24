import React, { useState, useEffect } from 'react';
import { Button, Card, CardColumns, Container } from 'react-bootstrap';
import './App.css';
import PostModal from './PostModal';
import streamAPI from './streamAPI';
import fuzzyDateOffset from './fuzzyDateOffset';
import store from 'store';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

function Collage({ filter, platform }) {
  const [songs, setSongs] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [stream, setStream] = useState(null);
  const [filteredSongs, setFilteredSongs] = useState([]);

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
    if (platform === 'Spotify') setAccessToken(store.get("SPOTIFY_TOKEN"));
  }, [platform]);

  useEffect(() => {
    setFilteredSongs(songs.filter((song) => song.tags.includes(filter)));
  }, [songs, filter]);

  useEffect(() => {
    setStream(streamAPI(platform, accessToken));
  }, [platform, accessToken]);

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

  const callback = (err, res) => {
    if (err) {
      if (err.status === 401) {
        store.set("SPOTIFY_TOKEN", null);
      }
      console.log('logging this error');
      console.error(err);
    } else {
      console.log("Success!");
    }
  }

  const queueSong = async (songID) => {
    if (platform === 'Spotify') {
      stream?.queue(`spotify:track:${songID['spotify']}`, {}, callback);
    }
  }

  const nextSong = async () => {
    if (platform === 'Spotify') {
      stream?.skipToNext();
    }
  }

  const handleClick = (event) => {
    const songID = JSON.parse(event.target.getAttribute("uri"));
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

  const renderCard = (json) => {
    const { entryID, URIs, commentary, songlink, tags, user, created_at } = json;
    const uniqueID = entryID;
    const data = songlink.entitiesByUniqueId[uniqueID];
    return (
      <Card className="shadow" key={uniqueID}>
        <Card.Img className="p-2" variant="top" src={data.thumbnailUrl} />
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
        { stream &&
        <Card.Body>
          <Button onClick={handleClick} uri={JSON.stringify(URIs)} func='queue' className="mr-1">Queue</Button>
          <Button onClick={handleClick} uri={JSON.stringify(URIs)} func='play'>Play Now</Button>
        </Card.Body>
        }
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
        {!filter
          ? songs.map(song => renderCard(song))
          : filteredSongs.map(song => renderCard(song))
        }
      </CardColumns>
    </Container>
  );
}

export default Collage;
