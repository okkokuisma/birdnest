// import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import './App.css';
import { getPilotsInNdz } from './pilotService';
import { Pilot } from '../../types';

const PilotList = ({ pilots }: { pilots: Pilot[] | undefined; }) => {
  if (!pilots) return null;

  return (
    <ul className='PilotList'>
      {pilots.map((pilot) => (
        <li key={pilot.pilotId}>{pilot.firstName} {pilot.lastName} {pilot.phoneNumber} {pilot.email}</li>
      ))}
    </ul>
  );
};

const App = () => {
  const { isLoading, data } = useQuery({ queryKey: 'pilots', queryFn: getPilotsInNdz, refetchInterval: 2000 });

  if (isLoading) {
    return <span>Loading...</span>
  }

  return (
    <div className="App">
      <PilotList pilots={data} />
    </div>
  );
};

export default App;
