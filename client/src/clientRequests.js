//*Functions for making post or get requests to api application
import Cookies from "universal-cookie";
const API_URL = require("./config.json").API_URL;
const simdjson = require("simdjson");
//*Refresh token after expiration
async function refreshToken() {
  const cookies = new Cookies();
  const token = cookies.get("authorization");
  const validity = cookies.get("validity");
  if (token !== undefined && validity !== undefined) {
    if (validity <= parseInt(new Date().getTime()) / 1000) {
      let headers = {
        Authorization: `animalAidAuthorization ${token}`,
        "Content-Type": "application/json",
      };
      const res = await fetch(`${API_URL}/user/refreshToken`, {
        method: "POST",
        mode: "cors",
        headers,
        body: "",
      });
      let r = await res.text();
      try {
        r = simdjson.parse(r);
      } catch {}
      if (r !== false && r !== "TOO_EARLY") {
        cookies.set("authorization", r, {
          maxAge: 3153600000,
          path: "/",
        });
        cookies.set("validity", parseInt(new Date().getTime() / 1000) + 1800, {
          maxAge: 3153600000,
          path: "/",
        });
        return r;
      } else if (r !== "TOO_EARLY") {
        cookies.remove("authorization", { path: "/" });
        cookies.remove("validity", { path: "/" });
        return false;
      } else {
        window.location.reload();
      }
    } else {
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
  let URL = API_URL + url;
  if (url.includes(API_URL)) URL = url;
  const res = await fetch(URL, {
    method: "POST",
    mode: "cors",
    headers,
    body: JSON.stringify(data),
  });
  if (res.ok) {
    let resData = await res.text();
    try {
      resData = simdjson.parse(resData);
    } catch {}
    return resData;
  } else {
    window.location.href = "/";
  }
}
//*Function for making post request when user is logged in his profile
async function postRequestToken(url, data, headers) {
  if (!headers) {
    headers = {};
  }
  const cookies = new Cookies();
  let token = cookies.get("authorization");
  const validity = cookies.get("validity");
  headers["Content-Type"] = "application/json";
  let URL = API_URL + url;
  if (url.includes(API_URL)) URL = url;
  if (token !== undefined && validity !== undefined) {
    if (validity > parseInt(new Date().getTime()) / 1000) {
      headers["Authorization"] = `animalAidAuthorization ${token}`;
      const res = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (res.ok) {
        let resData = await res.text();
        try {
          resData = simdjson.parse(resData);
        } catch {}
        return resData;
      } else if (res.status === 401) {
        cookies.remove("authorization", { path: "/" });
        cookies.remove("validity", { path: "/" });
      } else {
        window.location.href = "/";
      }
    } else {
      const refreshedToken = await refreshToken();
      if (refreshedToken !== false) {
        token = refreshedToken;
        headers["Authorization"] = `animalAidAuthorization ${token}`;
        const res = await fetch(URL, {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });
        if (res.ok) {
          let resData = await res.text();
          try {
            resData = simdjson.parse(resData);
          } catch {}
          return resData;
        } else if (res.status === 401) {
          cookies.remove("authorization", { path: "/" });
          cookies.remove("validity", { path: "/" });
        } else {
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
    }
  }
}
//*Function for making get request
async function getRequest(url, headers) {
  let URL = API_URL + url;
  if (url.includes(API_URL)) URL = url;
  const res = await fetch(URL, {
    method: "GET",
    mode: "cors",
    headers,
  });
  if (res.ok) {
    let resData = await res.text();
    try {
      resData = simdjson.parse(resData);
    } catch {}
    return resData;
  } else {
    window.location.href = "/";
  }
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
  if (token !== undefined && validity !== undefined) {
    if (validity > parseInt(new Date().getTime()) / 1000) {
      headers["Authorization"] = `animalAidAuthorization ${token}`;
      const res = await fetch(URL, {
        method: "GET",
        mode: "cors",
        headers,
      });
      if (res.ok) {
        let resData = await res.text();
        try {
          resData = simdjson.parse(resData);
        } catch {}
        return resData;
      } else if (res.status === 401) {
        cookies.remove("authorization", { path: "/" });
        cookies.remove("validity", { path: "/" });
      } else {
        window.location.href = "/";
      }
    } else {
      const refreshedToken = await refreshToken();
      if (refreshedToken !== false) {
        token = refreshedToken;
        const res = await fetch(URL, {
          method: "GET",
          headers,
        });
        if (res.ok) {
          let resData = await res.text();
          try {
            resData = simdjson.parse(resData);
          } catch {}
          return resData;
        } else if (res.status === 401) {
          cookies.remove("authorization", { path: "/" });
          cookies.remove("validity", { path: "/" });
        } else {
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
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
