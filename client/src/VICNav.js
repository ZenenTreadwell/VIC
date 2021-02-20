import React, { useState, useEffect } from 'react';
import { Button, Nav, Navbar, Form  } from 'react-bootstrap';
import './App.css';
import store from 'store';
import SpotifyLogin from './Login';

function VICNav({ filter, setFilter }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    setFilter(event.target[0].value);
  }

  return (
    <Navbar className="fluid w-100" sticky="top" bg="dark" variant="dark">
      <Navbar.Brand href="/">VIC</Navbar.Brand>
      <Form onSubmit={handleSubmit} inline>
        <Form.Control type="text" placeholder="Filter by tag" className="mr-sm-2" />
        <Button type="submit" variant="outline-info">Search</Button>
      </Form>
      <Nav className="ml-auto mr-3">
        <SpotifyLogin />
      </Nav>
    </Navbar>
  );
}

export default VICNav;
