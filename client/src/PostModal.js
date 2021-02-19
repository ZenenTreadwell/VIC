import React, { useState, useEffect } from 'react';
import { Button, Media, Form, Modal } from 'react-bootstrap';
import './App.css';
import store from 'store';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

function PostModal() {
  const [visible, setVisible] = useState(false);
  const [postData, setPostData] = useState(null);
  const [query, setQuery] = useState(false);
  const [tags, setTags] = useState(['432Hz']);
  const [mediaType, setMediaType] = useState(null);
  const handleClose = () => {
    setVisible(false);
    setPostData(null);
    setTags([]);
  }
  const handleShow = () => setVisible(true);

  const songlinkFetch = async (url) => {
    const key = "951edc7e-336c-484f-9c87-0ca05fd4b92a";
    const CORS = "http://localhost:8080/";
    const response = await fetch(`${CORS}https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}&key=${key}`, {
      method: 'GET',
    });

    if (response.ok) {
      const res = await response.json();
      console.log(res);
      setPostData(res);
      // Defaulting to spotify because hack
      const uniqueID = res.linksByPlatform.spotify.entityUniqueId || res.entityUniqueId;
      if (uniqueID.includes("SONG")) setMediaType("song");
      if (uniqueID.includes("ALBUM")) setMediaType("album");
    }

    setQuery(false);
  }

  const postToAPI = async (json) => {
    if (mediaType === "song") {
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
  }

  const handleLink = (event) => {
    event.preventDefault();
    setQuery(true);
    songlinkFetch(event.target[0].value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const songCommentary = event.target[1].value;
    const URIs = Object.keys(postData.linksByPlatform).reduce((a,v) => ({ ...a, [v]: postData.linksByPlatform[v].entityUniqueId.split("::")[1]}), {});

    // TODO: Add users
    const user = -1;

    const data = {
      user,
      postData,
      URIs,
      tags,
      songCommentary
    };

    postToAPI(data);
    handleClose();
  }

  const renderMedia = (json) => {
    const uniqueID = json.linksByPlatform.spotify.entityUniqueId || json.entityUniqueId;
    
    const data = json.entitiesByUniqueId[uniqueID];
    return (
      <Media>
        <img width={128} height={128} src={data.thumbnailUrl} className="rounded align-self-center" alt="Album Cover"/>
        <Media.Body className="pl-2 align-self-center">
          <h3>{data.title}</h3>
          {mediaType === "song" && <h4>A song by {data.artistName}</h4>}
          {mediaType === "album" && <h4>An album by {data.artistName}</h4>}
        </Media.Body>
      </Media>
    )
  }

  const randomQueryDialog = () => {
    const options = [
      'collapsing the wave equation...',
      'harmonizing overtones...',
      'modulating harmful frequencies...',
      'binauralizing beats...',
    ]

    return options[Math.floor(Math.random() * options.length)];
  }

  
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        New Post
      </Button>

      <Modal show={visible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>What are you vibin' to rn?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!postData &&
          <Form onSubmit={handleLink}>
            <Form.Group controlId="song.url">
              <Form.Control type="url" placeholder="Paste your youtube/tidal/spotify/napster link here" />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={query}>
              {query? randomQueryDialog() : "Vibe Check"}
            </Button>
          </Form>
          }
          {postData &&
            <>
              {renderMedia(postData)}
              <hr/>
              <Form className="mt-3" onSubmit={handleSubmit}>
                <Form.Group controlId="tags">
                  <Form.Label className="font-weight-bold">What kinda vibes?</Form.Label>
                  <ReactTagInput 
                    tags={tags}
                    onChange={(newTags) => setTags(newTags)}
                  />
                </Form.Group>
                <Form.Group controlId="commentary">
                  <Form.Label className="font-weight-bold">Say something about this {mediaType}</Form.Label>
                  <Form.Control type="text" placeholder="(optional)" />
                </Form.Group>

                <Button variant="primary" type="submit" className="float-right">Share</Button>
              </Form>
            </>
          }
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PostModal;
