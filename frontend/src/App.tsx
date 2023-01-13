import React, { useEffect } from 'react';
import './App.css';
import { getDrones } from './droneService';

const App = () => {
  useEffect(() => {
    getDrones()
      .then((response) => console.log(response))
  })

  return (
    <div className="App">
      Hello.
    </div>
  );
}

export default App;
