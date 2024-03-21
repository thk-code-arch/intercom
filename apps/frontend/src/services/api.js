// Determine the base URL based on the current location and protocol
const baseUrl = window.location.protocol + '//' + window.location.host;

export const API =
  !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === './'
    ? baseUrl
    : import.meta.env.VITE_API_URL;

export const FILES =
  !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === './'
    ? baseUrl
    : import.meta.env.VITE_API_URL;

export const SOCKETS =
  !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === './'
    ? baseUrl
    : import.meta.env.VITE_API_URL;
