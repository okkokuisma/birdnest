import axios from 'axios';
import { Drone } from '../../types';
const baseUrl = 'http://localhost:3001';

interface DroneResponse {
  timestamp: string;
  drones: Drone[];
}

export const getDrones = async () => {
  const response = await axios.get<DroneResponse>(`${baseUrl}/drones`);
  return response.data;
};