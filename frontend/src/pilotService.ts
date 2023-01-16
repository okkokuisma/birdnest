import axios from 'axios';
import { Pilot } from '../../types';
const baseUrl = 'http://localhost:3003';

export const getPilotsInNdz = async () => {
  const response = await axios.get<Pilot[]>(`${baseUrl}/ndz`);
  console.log(response.data);
  return response.data;
};