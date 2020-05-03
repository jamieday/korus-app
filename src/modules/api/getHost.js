/* eslint-disable import/prefer-default-export */

export const getHost = () => {
  return process.env.API_HOST || 'http://chorus.media';
};
