import axios from "axios";

const fromUrl = async (url, method, token, body) => {
  const header = {
    method,
    url,
    data: body,
    headers: { "Content-Type": "application/json" },
  };
  if (token) header.headers.Authorization = "Bearer " + token;
  //console.log(header);
  const resp = await axios(header);
  console.log(resp);
  if (!resp.data || resp.status > 299) throw new Error("Server did not respond correctly!");
  return resp.data;
};

const Api = {
  get: async (url, body, token) => await fromUrl(url, "get", token, body),
  put: async (url, body, token) => await fromUrl(url, "put", token, body),
  post: async (url, body, token) => await fromUrl(url, "post", token, body),
  delete: async (url, body, token) => await fromUrl(url, "delete", token, body),
};

export default Api;
