export {};
const MongoClient = require("mongodb").MongoClient;
const { getUrl, jwtCode } = require("../utils");
const { rankUser } = require("../utils/scoreUtil");
const { main } = require("../constants/index");

const url = getUrl();

const add = async (req: any, res: any) => {
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
    const item = req.body.item;
    const token = req.body.token;
    const d = new Date();
    const n = d.getTime();

    if (!item || !token || token !== process.env.CMS_TOKEN) {
      res.status(404).send("missing item");
      return;
    }

    const db = client.db("war");
    let scoreCollection = db.collection("cms");

    let response = await scoreCollection.insertOne({
      item,
      time: n,
    });

    console.log({ response });

    if (response.acknowledged) {
      res.status(200).send("backend Update");
    } else {
      res.status(400).send("backend not update");
    }
  } catch (err) {
    res.status(404).send(err);
    console.log(err);
  } finally {
    client.close();
  }
};

module.exports = { add };
