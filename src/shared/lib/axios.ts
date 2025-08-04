import axios from 'axios';
import { ENV } from '../config/env';
import { ENDPOINTS } from '../config/endpoints';

const instance = axios.create({
  baseURL: `${ENV.NEXT_PUBLIC_URL}/${ENDPOINTS.proxyApi}`,
  withCredentials: true,
});

export default instance;
