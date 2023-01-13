import axios from 'axios';
const baseUrl = 'http://localhost:3001';

export const getDrones = async () => {
  const drones = await axios.get(`${baseUrl}/drones`);
  return drones;
};