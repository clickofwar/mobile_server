export {};
const MongoClient = require("mongodb").MongoClient;
const { getUrl, jwtCode } = require("../utils");

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
    const team = req.body.team;
    const username = req.body.username;
    const score = team === "light" ? req.body.score : req.body.score * -1;
    const lightScore = team === "light" ? req.body.score : 0;
    const darkScore = team === "dark" ? req.body.score : 0;

    const db = client.db("war");
    let scoreCollection = db.collection("score");
    let userCollection = db.collection("users");

    let updateResponse = await scoreCollection.updateOne(
      {},
      { $inc: { score, darkScore, lightScore } }
    );

    let updateUserResponse = await userCollection.updateOne(
      { username },
      { $inc: { score: Math.abs(req.body.score), darkScore, lightScore } }
    );

    let scoreResponse = await scoreCollection.findOne();
    let userResponse = await userCollection.findOne(
      { username },
      { projection: { score: 1, lightScore: 1, darkScore: 1 } }
    );

    scoreResponse.user = userResponse;

    if (!updateResponse.modifiedCount) {
      res.status(404).send("Could not add score");
    } else if (!updateUserResponse.modifiedCount) {
      res.status(404).send("Could not add user score");
    } else if (!scoreResponse.score) {
      res.status(404).send("Could not find score");
    } else {
      res.status(400).send(scoreResponse);
    }
  } catch (err) {
    res.status(404).send(err);
    console.log(err);
  } finally {
    client.close();
  }
};

module.exports = { add };
