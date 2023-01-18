import { useQuery } from 'react-query';

import './App.css';
import { getPilotsInNdz } from './pilotService';
import { Pilot } from '../../types';

const Footer = () => {
  return (
    <div className='footer'>
      <span>Source code can be found&nbsp;</span>
      <a href='https://github.com/okkokuisma/birdnest'>here.</a>
    </div>
  )
}

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
      <Footer />
    </div>
  );
};

export default App;
