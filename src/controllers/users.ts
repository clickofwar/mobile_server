export {};
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;
const sha256 = require("js-sha256");
const { getUrl } = require("../utils");

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
    const user = req.body.user;
    const hash = sha256(req.body.password);
    const db = client.db("war");
    let collection = db.collection("users");
    let query = { user };

    let response = await collection.findOne(query);
    console.log({ response });
    if (response) {
      res.status(400).send("User already exists");
    } else {
      let response2 = await collection.insertOne({ email, hash, user });
      console.log({ response2 });
      if (response2) {
        res.status(201).send(response2);
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
  console.log({ url });
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
    const user = req.body.user;
    const hash = sha256(req.body.password);
    const db = client.db("war");
    let collection = db.collection("users");
    let query = { user, hash };

    let response = await collection.findOne(query);
    console.log({ response });
    if (response) {
      delete response.hash;
      res.status(201).send(response);
    } else {
      res.status(400).send("Wrong email or Passwor");
    }
  } catch (err) {
    res.status(404).send(err);
    console.log(err);
  } finally {
    client.close();
  }
};

module.exports = { add, find };
