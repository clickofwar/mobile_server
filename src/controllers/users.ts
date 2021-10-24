export {};
const MongoClient = require("mongodb").MongoClient;
const sha256 = require("js-sha256");
const { getUrl, jwtCode } = require("../utils");
var jwt = require("jsonwebtoken");

const url = getUrl();

const add = async (req: any, res: any) => {
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
    const email = req.body.email;
    const username = req.body.username;
    const hash = sha256(req.body.password);
    const d = new Date();
    const n = d.getTime();
    const token = jwt.sign({ email, hash, date: n }, jwtCode);

    const db = client.db("war");
    let collection = db.collection("users");

    let response = await collection.findOne({ username });
    let response2 = await collection.findOne({ email });

    console.log({ response, response2 });

    if (response || response2) {
      res.status(400).send("User or Email already exists");
    } else {
      let response3 = await collection.insertOne({
        email,
        hash,
        username,
        score: 0,
        lightScore: 0,
        darkScore: 0,
      });
      console.log({ response3 });
      if (response3) {
        response3.token = token;
        response3.email = email;
        response3.username = username;
        res.status(201).send(response3);
      } else {
        res.status(404).send("user was not added");
      }
    }
  } catch (err) {
    res.status(404).send(err);
    console.log(err);
  } finally {
    client.close();
  }
};

const find = async (req: any, res: any) => {
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
    const email = req.body.email;
    const hash = sha256(req.body.password);
    const d = new Date();
    const n = d.getTime();
    const token = jwt.sign({ email, hash, date: n }, jwtCode);

    if (!email || !hash) {
      res.status(400).send("Missing User or Password");
    }

    const db = client.db("war");
    let collection = db.collection("users");
    let query = { email, hash };
    let response = await collection.findOne(query);
    console.log({ response });
    if (response) {
      delete response.hash;
      response.token = token;
      res.status(201).send(response);
    } else {
      res.status(400).send("Wrong email or Password");
    }
  } catch (err) {
    res.status(404).send(err);
    console.log(err);
  } finally {
    client.close();
  }
};

const sendEmailCode = async (req: any, res: any) => {
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
    const email = req.body.email;
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const d = new Date();
    const n = d.getTime();

    if (!email) {
      res.status(400).send("Missing User or Password");
    }

    const db = client.db("war");
    let collection = db.collection("users");
    let query = { email };
    let setParam = { emailCode: randomNumber, emailCodeDate: n };
    let response = await collection.update(query, { $set: setParam });

    if (response.modifiedCount) {
      res.status(201).send({ randomNumber });
    } else {
      res.status(400).send("email does not exist");
    }
  } catch (err) {
    res.status(404).send(err);
    console.log(err);
  } finally {
    client.close();
  }
};

module.exports = { add, find, sendEmailCode };
