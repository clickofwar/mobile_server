export {};
const MongoClient = require("mongodb").MongoClient;
const { getUrl, jwtCode } = require("../utils");
const { main } = require("../constants/index");

const url = getUrl();

const cleanLiveScore = async () => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log("err", err);
  });

  if (!client) {
    console.log("missing client");
    return;
  }

  try {
    const d = new Date();
    const n = d.getTime();

    const db = client.db("war");
    let liveScoreCollection = db.collection("liveScore");

    let deleteResponse = await liveScoreCollection.deleteMany({
      time: { $lt: n - main.filterScoreTime * 2 },
    });

    if (deleteResponse.acknowledged) {
      console.log("Scores has been deleted");
      return;
    } else {
      console.log("score was not added to live feed");
      return;
    }
  } catch (err) {
    console.log("err", err);
    return;
  } finally {
    client.close();
    return;
  }
};

module.exports = { cleanLiveScore };
