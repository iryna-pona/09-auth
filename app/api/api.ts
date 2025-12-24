import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export type ApiError = AxiosError<{
  error?: string;
  message?: string;
}>;

export const isApiError = (error: unknown): error is ApiError => {
  return axios.isAxiosError(error);
};
