import { getCookie, setCookie, eraseCookie } from "./cookies";
const API_URL = require("./config.json").API_URL;
const axios = require("axios");

async function postRequest(url, data, headers)
{
    if(!headers)
    {
        headers = {};
    }
    const res = await axios.post(API_URL+url, data, {headers:headers});
    return res.data;
}
async function postRequestToken(url, data, headers)
{
    if(!headers)
    {
        headers = {};
    }
    let token = getCookie("authorization");
    if(token !== "" && token !== null)
    {
        headers["Authorization"] = `animalAidAuthorization ${token}`;
        console.log(headers);
        let URL = API_URL + url;
        if(url.includes(API_URL)) URL = url;
        try{
            const res = await axios.post(URL, data, {headers:headers});
            return res.data;
        }
        catch(error)
        {
            console.clear();
            if(error.response.status === 401)
            {
                await refreshToken();
                token = getCookie("authorization");
                headers["Authorization"] = `animalAidAuthorization ${token}`;
                const res2 = await axios.post(URL, data, {headers:headers});
                return res2.data;
            }
            else
            {
                return "";
            }
        }
    }
    else
    {
        window.location.href = "/login";
    }

}
async function refreshToken()
{
    const token = getCookie("authorization");
    if(token !== "" && token !== null)
    {
        setCookie("authorization", "", 1);
        let headers = {"Authorization": `animalAidAuthorization ${token}`};
        const res = await axios.post(`${API_URL}/user/refreshToken`, {}, {headers:headers});
        if(res.data!==false)
        {
            setCookie("authorization", res.data, 4444444);
        }
        else
        {
            eraseCookie("authorization");
        }
    }
}
async function getRequest(url, headers)
{
    if(!headers)
    {
        headers = {};
    }
    const res = await axios.get(API_URL+url, {headers:headers});
    return res.data;
}
async function getRequestToken(url, headers)
{
    if(!headers)
    {
        headers = {};
    }
    let token = getCookie("authorization");
    if(token !== "" && token !== null)
    {
        headers["Authorization"] = `animalAidAuthorization ${token}`;
        let URL = API_URL + url;
        if(url.includes(API_URL)) URL = url;
        try{
            const res = await axios.get(URL, {headers:headers});
            return res.data;
        }
        catch(error)
        {
            console.clear();
            if(error.response.status === 401)
            {
                await refreshToken();
                token = getCookie("authorization");
                headers["Authorization"] = `animalAidAuthorization ${token}`;
                const res2 = await axios.get(URL, {headers:headers});
                return res2.data;
            }
            else
            {
                return "";
            }
        }
    }
    else
    {
        return "redirectToLogin";
    }
}
/*
const responseSuccessHandler = response => {
    return response;
  };
  
  const responseErrorHandler = async error => {
    console.log(error.response);
    setCookie("authorization", "", 1);
    await refreshToken();
    if (error.response.status === 401) {
        setCookie("authorization", "", 1);
        await refreshToken();
        window.location.reload();
    }
  
    return Promise.reject(error);
  }
  
axios.interceptors.response.use(
    response => responseSuccessHandler(response),
    error => responseErrorHandler(error)
  );
*/
export {getRequestToken, postRequestToken, postRequest, getRequest}