//*Functions for making post or get requests to api application
import { getCookie, setCookie } from "./cookies";
const API_URL = require("./config.json").API_URL;
const axios = require("axios");
//*Refresh token after expiration
async function refreshToken() {
  const token = getCookie("authorization");
  if (token !== "" && token !== null) {
    let headers = { Authorization: `animalAidAuthorization ${token}` };
    const res = await axios.post(
      `${API_URL}/user/refreshToken`,
      {},
      { headers: headers }
    );
    if (res.data !== false) {
      setCookie("authorization", res.data, 4444444);
      return res.data;
    } else {
      setCookie("authorization", "", 1);
      return false;
    }
  } else {
    return false;
  }
}
//*Function for making post request
async function postRequest(url, data, headers) {
  if (!headers) {
    headers = {};
  }
  const res = await axios.post(API_URL + url, data, { headers: headers });
  return res.data;
}
//*Function for making post request when user is logged in his profile
async function postRequestToken(url, data, headers) {
  if (!headers) {
    headers = {};
  }
  let token = getCookie("authorization");
  if (token !== "" && token !== null) {
    headers["Authorization"] = `animalAidAuthorization ${token}`;
    let URL = API_URL + url;
    if (url.includes(API_URL)) URL = url;
    try {
      const res = await axios.post(URL, data, { headers: headers });
      return res.data;
    } catch (error) {
      console.clear();
      if (error.response.status === 401) {
        const refreshedToken = await refreshToken();
        if (refreshedToken) {
          token = refreshedToken;
          headers["Authorization"] = `animalAidAuthorization ${token}`;
          const res2 = await axios.post(URL, data, { headers: headers });
          return res2.data;
        } else {
          window.location.href = "/";
          return "";
        }
      } else {
        return "";
      }
    }
  } else {
    window.location.href = "/login";
  }
}
//*Function for making get request
async function getRequest(url, headers) {
  if (!headers) {
    headers = {};
  }
  const res = await axios.get(API_URL + url, { headers: headers });
  return res.data;
}
//*Function for making get request when user is logged in his profile
async function getRequestToken(url, headers) {
  if (!headers) {
    headers = {};
  }
  let token = getCookie("authorization");
  if (token !== "" && token !== null) {
    headers["Authorization"] = `animalAidAuthorization ${token}`;
    let URL = API_URL + url;
    if (url.includes(API_URL)) URL = url;
    try {
      const res = await axios.get(URL, { headers: headers });
      return res.data;
    } catch (error) {
      console.clear();
      if (error.response.status === 401) {
        const refreshedToken = await refreshToken();
        if (refreshedToken !== false) {
          token = refreshedToken;
          headers["Authorization"] = `animalAidAuthorization ${token}`;
          const res2 = await axios.get(URL, { headers: headers });
          return res2.data;
        } else {
          window.location.href = "/";
          return "";
        }
      } else {
        return "";
      }
    }
  } else {
    return "redirectToLogin";
  }
}
export {
  getRequestToken,
  postRequestToken,
  postRequest,
  getRequest,
  refreshToken,
};
