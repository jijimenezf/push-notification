const request = require('request');
// check console after start ngrok and the expo server
const PUSH_REGISTRATION_ENDPOINT = 'http://d33f17dc.ngrok.io/token';
const token = 'ExponentPushToken[YtyyTmE1bBKxyucQ3Qg3Lq]';

request.post(
  PUSH_REGISTRATION_ENDPOINT,
  {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: {
          value: token,
        },
        user: {
          username: 'warly',
          name: 'Dan Ward'
        },
      }),
  },
  (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
  }
);
