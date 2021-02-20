import React, { useState, useEffect } from 'react';
import './App.css';
import Collage from './Collage';
import VICNav from './VICNav';

function App() {
  const [msg, setMsg] = useState('not a response yet');
  const [filter, setFilter] = useState('');

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
        <VICNav filter={filter} setFilter={setFilter} />
        <Collage filter={filter} setFilter={setFilter} />
        <p>
          This is a message from the API: {msg}
        </p>
      </header>
    </div>
  );
}

export default App;
