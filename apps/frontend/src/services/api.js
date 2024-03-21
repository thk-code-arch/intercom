// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

export const API =
  import.meta.env.VITE_API_URL === './'
    ? 'https://' + location.host
    : import.meta.env.VITE_API_URL;
export const FILES =
  import.meta.env.VITE_API_URL === './'
    ? 'https://' + location.host
    : import.meta.env.VITE_API_URL;
export const SOCKETS =
  import.meta.env.VITE_API_URL === './'
    ? 'https://' + location.host
    : import.meta.env.VITE_API_URL;
