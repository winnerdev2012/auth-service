/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const blockusEndpoint = process.env.BLOCKUS_URL_PREFIX ?? 'https://api.blockus.net/v1';

const getHeaders = (method: string, isKey = true, accessToken?: string) => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (method.toLowerCase() !== 'get') {
    headers['Content-Type'] = 'application/json';
  }

  if (isKey) {
    headers['X-PROJECT-ID'] = process.env.BLOCKUS_PROJECT_ID ?? '';
    headers['X-PROJECT-KEY'] = process.env.BLOCKUS_PROJECT_KEY ?? '';
  }

  // eslint-disable-next-line no-extra-boolean-cast
  if (!!accessToken) {
    headers['X-ACCESS-TOKEN'] = accessToken;
  }

  return headers;
};

const get = <T>(url: string, accessToken: string) =>
  axios.get<T>(blockusEndpoint + '/' + url, {
    headers: getHeaders('GET', false, accessToken),
  });

const post = <T>(url: string, body: any, isKey = true, accessToken?: string) =>
  axios.post<T>(blockusEndpoint + '/' + url, body, {
    headers: getHeaders('post', isKey, accessToken),
  });

const put = <T>(url: string, body: any, isKey = true, accessToken?: string) =>
  axios.put<T>(blockusEndpoint + '/' + url, body, {
    headers: getHeaders('post', isKey, accessToken),
  });

export { get, post, put };
