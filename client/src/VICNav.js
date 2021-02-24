import React from 'react';
import { Button, Nav, Navbar, Form } from 'react-bootstrap';
import './App.css';
import { LoginSelector} from './Login';

function VICNav({ platform, setFilter, setPlatform }) {

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(LoginSelector);
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
        <LoginSelector platform={platform} setPlatform={setPlatform} />
      </Nav>
    </Navbar>
  );
}

export default VICNav;
