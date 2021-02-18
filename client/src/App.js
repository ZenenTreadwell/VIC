import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

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

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hey I'm gonna show you a message!
        </p>
        <p>{msg}</p>
      </header>
    </div>
  );
}

export default App;
