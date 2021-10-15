const https = require("https");

const request = ({ method, hostname, path, headers }) =>
  new Promise((resolve, reject) => {
    https
      .request({ method, hostname, path, headers }, response => {
        let data = "";
        response.on("data", chunk => (data += chunk));
        response.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", err => reject(err))
      .end();
  });

const getMarketoData = async (clientId, clientSecret, munchkinId) => {
// Get Marketo Bearer Token
  try {
    const auth = await request(
      {
        method: "GET",
        hostname: `${munchkinId}.mktorest.com`,
        path: `/identity/oauth/token?grant_type=client_credentials&client_id=${
        clientId
        }&client_secret=${clientSecret}`
      }
    )
    //Get forms from Rest Api
    const response = await request(
      {
        method: "GET",
        hostname: `${munchkinId}.mktorest.com`,
        path: `/rest/asset/v1/forms.json?maxReturn=200`,
        headers: {
          Authorization: `Bearer ${auth.access_token}`
        }
      }
    )
    return response;

  } catch(error) {
    return {
      error: true,
      message: error
    }
  }
};


exports.handler =  async (event) => {
  if (event.body) {
    const {clientId, clientSecret, munchkinId} = JSON.parse(event.body);
    if (!clientId){
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        },
        body: "Check client id"
      }
    } else if (!clientSecret) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        },
        body: "Check client secret"
      }
    } else if (!munchkinId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        },
        body: "Check munchkin id"
      }
    }

    const marketoData = await getMarketoData(clientId, clientSecret, munchkinId)
    if (marketoData.error) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        },
        body: "Bad request to marketo"
      }
    } else {
      const data = JSON.stringify(marketoData)
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        },
        body: data
      }
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    },
    body: ""
  }
}