export {};
const MongoClient = require("mongodb").MongoClient;
const { getUrl, jwtCode, uniqBy } = require("../utils");
const { sendNotifications } = require("../utils/notifications");

const url = getUrl();

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
    let header = req.body.header;
    let data = req.body.data ? req.body.data : {};

    if (!header) {
      res.status(400).send("Missing Object");
    }

    const db = client.db("war");
    let userCollection = db.collection("users");

    let userResponse = await userCollection
      .find(
        {
          notificationId: { $exists: true },
        },
        { projection: { notificationId: 1 } }
      )
      .toArray();

    let messages = userResponse.map(({ notificationId }) => {
      return {
        to: notificationId,
        sound: "default",
        body: header,
        data,
      };
    });
    const filteredMessages = uniqBy(messages, JSON.stringify);

    sendNotifications({ messages: filteredMessages });

    res.status(201).send(userResponse);
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
