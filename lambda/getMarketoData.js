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
  try {
    // Get Marketo Bearer Token
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
  // Check if this is the options pre-request or the actual request
  if (event.body) {
    const {clientId, clientSecret, munchkinId} = JSON.parse(event.body);
    if (!clientId || clientId === "") {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message: "Check that a valid client id is included in your parameters."})
      }
    } else if (!clientSecret || clientSecret === "") {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message: "Check that a valid marketo client secret is included in your parameters."})
      }
    } else if (!munchkinId || munchkinId === "") {
      console.log("check is working")
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message: "Check that a valid marketo munchkin id is included in your parameters."})
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
        body: JSON.stringify({message:"Bad request to marketo"})
      }
    } else {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(marketoData)
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