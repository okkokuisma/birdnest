// import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import './App.css';
import { getPilotsInNdz } from './pilotService';
import { Pilot } from '../../types';

// const PilotListHeader = () => {
//   return (
//     <div className='PilotListRow' id='PilotListHeader'>
//       <div className='grid-container'>
//         <div>Name</div>
//       </div>
//       <div className='grid-container'>
//         <div>Phone number</div>
//       </div>
//       <div className='grid-container'>
//         <div>Email</div>
//       </div>
//       <div className='grid-container'>
//         <div>Distance to Monadi</div>
//       </div>
//     </div>
//   );
// };

const PilotListRow = ({ pilot }: { pilot: Pilot; }) => {
  const distanceHighlight = pilot.distanceToNest < 20000
    ? {background: 'red', color: 'white', fontWeight: 'bold'}
    : undefined;

  return (
    <div className='PilotListRow'>
      <div className='grid-container'>
        <div>{pilot.firstName} {pilot.lastName}</div>
      </div>
      <div className='grid-container'>
        <div>{pilot.phoneNumber}</div>
      </div>
      <div className='grid-container'>
        <div>{pilot.email}</div>
      </div>
      <div className='grid-container'>
        <span style={distanceHighlight}>{Math.floor(pilot.distanceToNest / 1000)} meters</span>
      </div>
    </div>
  );
};

const PilotList = () => {
  const { isLoading, data } = useQuery({ queryKey: 'pilots', queryFn: getPilotsInNdz, refetchInterval: 2000 });

  if (isLoading) {
    return <div>Loading...</div>
  }


  if (!data) return null;

  return (
    <ul className='PilotList'>
      {/* <PilotListHeader /> */}
      {data.map((pilot) => (
        <li key={pilot.pilotId}>
          <PilotListRow pilot={pilot} />
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  return (
    <div className="App">
      <h1>Naughty pilots in the NDZ</h1>
      <PilotList/>
    </div>
  );
};

export default App;
