import { useQuery } from 'react-query';
import { getPilotsInNdz } from '../pilotService';
import { Pilot, PilotQueryParams } from '../../../types';
import { useQueryParams } from '../hooks';
import SelectInput from './SelectInput';
import { useEffect, useState } from 'react';

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

const OrderSelect = ({ onChange }: { onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) => {
  const orderOptions =  [
    { name: 'Latest first', value: 'DESC' },
    { name: 'Oldest first', value: 'ASC' },
  ];


  return (
    <div>
      <label htmlFor='orderSetting'>List order </label>
      <SelectInput id='orderSetting' options={orderOptions} onChange={onChange} />
    </div>
  );
};

const RefetchSelect = ({ onChange }: { onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) => {
  const refetchOptions =  [
    { name: '2 seconds', value: 2 },
    { name: '5 seconds', value: 5 },
    { name: '10 seconds', value: 10 },
    { name: '30 seconds', value: 30 },
    { name: '1 minute', value: 60 },
  ];

  return (
    <div>
      <label htmlFor='refetchSetting'>Refetch interval </label>
      <SelectInput id='refetchSetting' options={refetchOptions} onChange={onChange} />
    </div>
  );
};

const PilotList = () => {
  const { queryParams, handleFilterChange } = useQueryParams<PilotQueryParams>();
  const [ refetchInterval, setRefetchInterval ] = useState<number>(2);
  const [ pollingEnabled, setPollingEnabled ] = useState<boolean>(true);
  const { isLoading, data, refetch } = useQuery({
    queryKey: 'pilots',
    queryFn: () => getPilotsInNdz(queryParams),
    refetchInterval: refetchInterval * 1000,
    enabled: pollingEnabled
  });

  useEffect(() => {
    refetch();
  }, [queryParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) return null;

  return (
    <>
      <div className='filters'>
        <button onClick={() => setPollingEnabled(!pollingEnabled)}>
          {pollingEnabled ? 'Pause sync' : 'Resume sync'}
        </button>
        <OrderSelect onChange={(e) => handleFilterChange('order', e.target.value)} />
        <RefetchSelect onChange={(e) => setRefetchInterval(Number(e.target.value))} />
      </div>
      <ul className='PilotList'>
        {data.map((pilot) => (
          <li key={pilot.pilotId}>
            <PilotListRow pilot={pilot} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default PilotList;