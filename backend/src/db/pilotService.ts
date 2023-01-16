import dbPool from './initDb';
import { Pilot } from '../../../types';

interface PilotDbInstance {
  id: number;
  pilot_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  distance_to_nest: number;
  last_update: Date;
}

export const getAll = async (date: Date): Promise<Pilot[]> => {
  const client = await dbPool.connect();
  try {
    const res = await client.query<PilotDbInstance>('SELECT * FROM pilots WHERE last_update >= $1', [date]);
    return res.rows.map((row) => {
      return {
        pilotId: row.pilot_id,
        firstName: row.first_name,
        lastName: row.last_name,
        phoneNumber: row.phone_number,
        email: row.email,
        distanceToNest: row.distance_to_nest,
        lastUpdate: row.last_update
      };
    });
  } catch (err) {
    console.log(err);
    return [];
  } finally {
    client.release();
  }
};

export const getOne = async (id: string) => {
  const client = await dbPool.connect();
  try {
    const res = await client.query<Pilot>('SELECT * FROM pilots WHERE pilot_id = $1', [id]);
    return res.rows[0];
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

export const createPilot = async (values: Pilot) => {
  const { pilotId, firstName, lastName, phoneNumber, email, distanceToNest } = values;
  const client = await dbPool.connect();
  try {
    const res = await client.query<Pilot>(
      'INSERT INTO pilots(pilot_id, first_name, last_name, phone_number, email, distance_to_nest, last_update) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [pilotId, firstName, lastName, phoneNumber, email, distanceToNest, new Date()]
    );
    console.log('CREATE:' + JSON.stringify(res.rows[0]));
    return res.rows[0];
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

export const updatePilot = async (id: string, distance: number) => {
  const client = await dbPool.connect();
  try {
    const res = await client.query<Pilot>(
      'UPDATE pilots SET (distance_to_nest, last_update) = ($1, $2) WHERE pilot_id = $3 RETURNING *',
      [distance, new Date(), id]
    );
    console.log('UPDATE:' + JSON.stringify(res.rows[0]));
    return res.rows[0];
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};