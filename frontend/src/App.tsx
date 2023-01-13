// import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import './App.css';
import { getDrones } from './droneService';
import { Drone } from '../../types';

const DroneList = ({ drones }: { drones: Drone[] | undefined; }) => {
  if (!drones) return null;

  return (
    <ul className='DroneList'>
      {drones.map((drone) => (
        <li key={drone.serialNumber}>{drone.serialNumber}</li>
      ))}
    </ul>
  );
};

const App = () => {
  const { isLoading, data } = useQuery({ queryKey: 'drones', queryFn: getDrones, refetchInterval: 2000 });

  if (isLoading) {
    return <span>Loading...</span>
  }

  return (
    <div className="App">
      <DroneList drones={data?.drones} />
    </div>
  );
};

export default App;
