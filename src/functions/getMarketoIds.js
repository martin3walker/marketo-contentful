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

const otherHandler = function(clientId, clientSecret, munchkinId) {
  request({
    method: "GET",
    hostname: `${munchkinId}.mktorest.com`,
    path: `/identity/oauth/token?grant_type=client_credentials&client_id=${
     clientId
    }&client_secret=${clientSecret}`
  })
    .then(res => res.access_token)
    .then(bearer =>
      request({
        method: "GET",
        hostname: `${munchkinId}.mktorest.com`,
        path: `/rest/asset/v1/forms.json?maxReturn=200`,
        headers: {
          Authorization: `Bearer ${bearer}`
        }
      })
      .then(res => console.log(res))
    //     .then(res =>
    //       callback(null, {
    //         statusCode: 200,
    //         headers: {
    //           "Access-Control-Allow-Origin": "*",
    //           "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(res.result)
    //       })
    //     )
    //     .catch(err => {
    //       console.log(err);
    //       callback(err);
    //     })
    )
    .catch(err => {
      console.log(err);
    });
};

const requestHandler = async (clientId, clientSecret, munchkinId) => {
  const resp = await fetch(`https://${munchkinId}.mktorest.com/identity/oauth/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`, {
    headers: {
      "Access-Control-Allow-Origin":'https://localhost:3000/',
    }
  })
  console.log(resp)
  // const res = await fetch(`
  //   ${munchkinId}.mktorest.com/rest/asset/v1/forms.json?maxReturn=200`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${access_token}`,
  //       "Access-Control-Allow-Origin": munchkinId,
  //       "Content-Type": "application/json"
  //   }
  // })

  // const data = await res.body
  // console.log(data)
}

module.exports = {
  requestHandler,
  otherHandler
}