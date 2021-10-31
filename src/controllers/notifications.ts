export {};
const MongoClient = require("mongodb").MongoClient;
const { getUrl, jwtCode } = require("../utils");
const { Expo } = require("expo-server-sdk");

const url = getUrl();
let expo = new Expo({
  accessToken: "uD9NWpC01ijZuYZXHxmCyWEoySntRiAHwUxNd6y9",
});

const send = async (req: any, res: any) => {
  console.log("body ", req.body);
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
  }).catch((err) => {
    res.status(404).send(err);
    console.log(err);
  });

  if (!client) {
    res.status(404).send("missing client");
    return;
  }

  try {
    const d = new Date();
    let minutes = d.getMinutes();
    let hours = d.getHours();
    let messages = [
      {
        to: "ExponentPushToken[fbhvHOE6AvnBtgXJiPSHUK]",
        sound: "default",
        body: `This is a test notification ${hours} ${minutes}`,
        data: { withSome: "data" },
      },
    ];

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      console.log("sup");
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          console.error(error);
        }
      }
    })();

    res.status(201).send("Hello from notifications");
  } catch (err) {
    res.status(404).send(err);
    console.log(err);
  } finally {
    client.close();
  }
};

module.exports = {
  send,
};
