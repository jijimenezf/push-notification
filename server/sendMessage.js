const request = require('request');
const MESSAGE_ENPOINT = 'http://d33f17dc.ngrok.io/message';
const CUSTOM_TITLE = 'Atención!';
const CUSTOM_MESSAGE = 'Mensaje de la notificación';

request.post(
  MESSAGE_ENPOINT,
  {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: CUSTOM_MESSAGE,
      title: CUSTOM_TITLE,
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
