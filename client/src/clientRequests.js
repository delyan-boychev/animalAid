//*Functions for making post or get requests to api application
import Cookies from "universal-cookie";
const API_URL = require("./config.json").API_URL;
const axios = require("axios");
//*Refresh token after expiration
async function refreshToken() {
  const cookies = new Cookies();
  const token = cookies.get("authorization");
  if (token !== "" && token !== null) {
    let headers = { Authorization: `animalAidAuthorization ${token}` };
    const res = await axios.post(
      `${API_URL}/user/refreshToken`,
      {},
      { headers: headers }
    );
    if (res.data !== false) {
      cookies.set("authorization", res.data, { maxAge: 3153600000, path: "/" });
      cookies.set("validity", parseInt(new Date().getTime() / 1000) + 1800, {
        maxAge: 3153600000,
        path: "/",
      });
      return res.data;
    } else {
      cookies.remove("authorization", { path: "/" });
      cookies.remove("validity", { path: "/" });
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
  const cookies = new Cookies();
  let token = cookies.get("authorization");
  if (token !== undefined) {
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
      } else if (error.response.status === 403) {
        window.location.href = "/";
        return "";
      } else {
        return false;
      }
    }
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
  const cookies = new Cookies();
  let token = cookies.get("authorization");
  const validity = cookies.get("validity");
  let URL = API_URL + url;
  if (url.includes(API_URL)) URL = url;
  if (token !== undefined) {
    if (validity > parseInt(new Date().getTime()) / 1000) {
      headers["Authorization"] = `animalAidAuthorization ${token}`;
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
        } else if (error.response.status === 403) {
          window.location.href = "/";
          return "";
        } else {
          return false;
        }
      }
    } else {
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
    }
  }
}
export {
  getRequestToken,
  postRequestToken,
  postRequest,
  getRequest,
  refreshToken,
};
