import Axios from 'axios';
import { API_URL } from "services/config";
import { handleErrorAxios, handleResponseAxios } from 'services/helpers';

function getHeader(token, key) {
  if (key) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
      [key] : token
    }
  }
  
  return {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'multipart/form-data',
    'Authorization': token ? 'Bearer ' + token : null,
  }
}

function axiosInstance({
  rootUrl = null,
  accessToken = null,
  headerKey
}) {
  if (rootUrl == null) {
    rootUrl = API_URL.ROOT;
  }

  return Axios.create({
    baseURL: rootUrl,
    headers: getHeader(accessToken, headerKey),
  })
}

function GET_HOOK({
  url,
  accessToken,
  rootUrl,
  headerKey,
  requestConfig = {}
}) {
  return {
    axiosInstance: axiosInstance({rootUrl, accessToken, headerKey}),
    method: 'GET',
    url: url,
    requestConfig: requestConfig,
    mode: 'no-cors',
    withCredentials: true,
    credentials: 'same-origin',
  }
}

function POST_HOOK({
  url,
  accessToken,
  rootUrl,
  headerKey,
  requestConfig = {}
}) {
  return {
    axiosInstance: axiosInstance({rootUrl, accessToken, headerKey}),
    method: 'POST',
    url: url,
    requestConfig: requestConfig
  }
}

function GET({url, params = null, accessToken = null, rootUrl = null, headerKey}) {
  if (rootUrl == null) {
    rootUrl = API_URL.ROOT;
  }
  return Axios.get(rootUrl + url, {
    params: params,
    headers: getHeader(accessToken, headerKey),
  }).then(response => handleResponseAxios(response))
    .catch(error => handleErrorAxios(error));
}

function POST({url, params = null, accessToken = null, rootUrl = null, headerKey}) {
  if (rootUrl == null) {
    rootUrl = API_URL.ROOT;
  }
  return Axios.post(rootUrl + url, params, {
    headers: getHeader(accessToken, headerKey),
  }).then(response => handleResponseAxios(response))
    .catch(error => handleErrorAxios(error));
}

function PUT({url, params = null, accessToken = null, rootUrl = null, headerKey}) {
  if (rootUrl == null) {
    rootUrl = API_URL.ROOT;
  }
  return Axios.put(rootUrl + url, params, {
    headers: getHeader(accessToken, headerKey),
  }).then(response => handleResponseAxios(response))
    .catch(error => handleErrorAxios(error));
}

function DELETE({url, params = null, accessToken = null, rootUrl = null, headerKey}) {
  if (rootUrl == null) {
    rootUrl = API_URL.ROOT;
  }
  return Axios.delete(rootUrl + url, params, {
    data: params,
    headers: getHeader(accessToken, headerKey),
  }).then(response => handleResponseAxios(response))
    .catch(error => handleErrorAxios(error));
}

export const SERVICE_ASYNC = {
  GET,
  GET_HOOK,
  POST,
  POST_HOOK,
  PUT,
  DELETE
  // POST, PUT, DELETE
}
