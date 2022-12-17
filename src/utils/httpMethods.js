import { httpRequestMethods } from "../constants/httpMethods";

const fetch = require("node-fetch");

const httpMethodAPIRequestPayload =
  (method) =>
  (payload = null) => {
    return {
      method,
      headers: {
        "Content-type": "application/json",
      },
      ...(payload && {
        body: typeof payload == "string" ? payload : JSON.stringify(payload),
      }), // For Post request
      redirect: "follow",
    };
  };

const sendHttpRequest = (url) => async (requestObject) => {
  const result = await fetch(url, requestObject);
  return await result.json();
};

export const sendGETHttpRequest = (url) =>
  sendHttpRequest(url)(
    httpMethodAPIRequestPayload(httpRequestMethods.GET)()
);
