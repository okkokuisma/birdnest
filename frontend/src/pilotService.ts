import axios from 'axios';
import { Pilot, QueryParams } from '../../types';

const baseUrl = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_BACKEND_URL
  : '/api';

export const getPilotsInNdz = async (params: QueryParams) => {
  const response = await axios.get<Pilot[]>(`${baseUrl}/ndz`, {params});
  return response.data;
};