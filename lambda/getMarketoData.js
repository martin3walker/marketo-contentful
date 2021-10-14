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

const getMarketoData = function(clientId, clientSecret, munchkinId) {
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
        .then(res =>
          callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(res.result)
          })
        )
        .catch(err => {
          console.log(err);
          callback(err);
        })
    )
    .catch(err => {
      console.log(err);
    });
};

// const getMarketoData = async (clientId, clientSecret, munchkinId) => {
//   const resp = await fetch(`https://${munchkinId}.mktorest.com/identity/oauth/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`, {
//     headers: {
//       "Access-Control-Allow-Origin":'Netlify',
//     }
//   })
//   console.log(resp)
//   // const res = await fetch(`
//   //   ${munchkinId}.mktorest.com/rest/asset/v1/forms.json?maxReturn=200`, {
//   //     method: "GET",
//   //     headers: {
//   //       Authorization: `Bearer ${access_token}`,
//   //       "Access-Control-Allow-Origin": munchkinId,
//   //       "Content-Type": "application/json"
//   //   }
//   // })

//   // const data = await res.body
//   // console.log(data)
// }


exports.handler =  async (event) => {

  return {
    statusCode: 200,
    body: "hi"
  }
  // if(event.httpMethod !== "POST") {
  //   return {statusCode: 200, body: "Please visit the main page to estimate the value of your package."}; 
  // }

  // const payload = JSON.parse(event.body);

  // const {clientId, clientSecret, munchkinId} = payload;

  // const marketoData = await getMarketoData(clientId, clientSecret, munchkinId);
  // console.log(marketoData);
    
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({data: marketoData}),
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // }
}
// exports.handler =  async (event) => {
//   if(event.httpMethod !== "POST") {
//     return {statusCode: 200, body: "Please visit the main page to estimate the value of your package."}; 
//   }

//   const payload = JSON.parse(event.body);

//   const {valuation, optionsAmount, strikePrice} = payload;


//   const calculateOptionValueUsd = (totalValuation, noOfOptions, strikePrice) => {
//     const dilution = .1;
//     const totalShares = 92448944;
//     const sharePrice = (totalValuation)/(totalShares*(1+dilution));
//     const valueOfOptionsUsd = Math.max(0, ((sharePrice-strikePrice)*noOfOptions));

//     return valueOfOptionsUsd;
//   }

//   const value = calculateOptionValueUsd(valuation, optionsAmount, strikePrice);
    
//   return {
//     statusCode: 200,
//     body: JSON.stringify({value: value}),
//     headers: {
//       "Content-Type": "application/json",
//     }
//   }
// }