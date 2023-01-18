import axios from 'axios';
import { Pilot } from '../../types';

const baseUrl = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_BACKEND_URL
  : '/api'

export const getPilotsInNdz = async () => {
  const response = await axios.get<Pilot[]>(`${baseUrl}/ndz`);
  return response.data;
};