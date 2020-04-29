import express from 'express';
import Expo from 'expo-server-sdk';

const app = express();
const expo = new Expo();

let savedPushTokens = [];
const PORT_NUMBER = 3000;

/**
 * Register an Expo token for a registered device
 * @param token identifier of the physical device running Expo
 */
const saveToken = (token) => {
  // if (savedPushTokens.indexOf(token === -1)) { // There is an issue, it keeps all id's
  if (savedPushTokens.length === 0) {
    savedPushTokens.push(token);
  }
};

/**
 * Sends the push notification to the physical device taking advantage of the expo sdk
 * @param message the message
 * @param title title for the push notification
 */
const pushNotificationHandler = (message, title) => {
  // Create the messages that you want to send to clents
  let notifications = [];
  for (let pushToken of savedPushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
    notifications.push({
      to: pushToken,
      sound: 'default',
      title: title,
      body: message,
      data: { message },
      badge: 0,
    })
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(notifications);

  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

app.use(express.json());

/**
 * Root of server after starting
 */
app.get('/', (req, res) => {
  res.send('Push Notification Server Running');
});

/**
 * Handle the request for registering an Expo token device
 */
app.post('/token', (req, res) => {
  saveToken(req.body.token.value);
  console.log(`Received push token, ${req.body.token.value}`);
  res.send(`Received push token, ${req.body.token.value}`);
});

/**
 * Handle the request for sending a push notification to an Expo device
 */
app.post('/message', (req, res) => {
  pushNotificationHandler(req.body.message, req.body.title);
  console.log(`Received message, ${req.body.message}`);
  res.send(`Received message, ${req.body.message}`);
});

/**
 * Local server instance exposed at selected port
 */
app.listen(PORT_NUMBER, () => {
  console.log(`Server Online on Port ${PORT_NUMBER}`);
});
