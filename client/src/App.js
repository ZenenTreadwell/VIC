import React, { useState } from 'react';
import './App.css';
import Collage from './Collage';
import VICNav from './VICNav';

function App() {
  const [filter, setFilter] = useState('');
  const [platform, setPlatform] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <VICNav filter={filter} setFilter={setFilter} platform={platform} setPlatform={setPlatform}/>
        <Collage filter={filter} platform={platform}/>
      </header>
    </div>
  );
}

export default App;
