const { Expo } = require("expo-server-sdk");

let expo = new Expo({
  accessToken: "uD9NWpC01ijZuYZXHxmCyWEoySntRiAHwUxNd6y9",
});

interface props {
  messages: string;
}

const sendNotifications = async (props: props) => {
  const { messages } = props;
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
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
};

module.exports = {
  sendNotifications,
};
