import axios, { AxiosInstance } from 'axios';
import { ENV } from '../config/env';

const instance: AxiosInstance = axios.create({
  baseURL: ENV.NEXT_PUBLIC_API_URL,
});

export default instance;
