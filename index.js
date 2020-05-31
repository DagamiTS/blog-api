import express from "express";
import {Collection} from "./collection.js";

const collection = new Collection("posts");

const app = express();

const readBody = (req) => {
  return new Promise((resolve, reject) => {

    let body = '';
    req.on('data', data => {
      body = body + data.toString('utf8');
    });

    req.on('end', async () => {
      // resolve(query.parse(body));
      resolve(JSON.parse(body));
    });

    req.on('error', error => reject(error));
  });
};

app.get("/api/posts", async (req, res) => {
  const posts = await collection.list();
  res.send(posts);
});

app.get("/api/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  const post = await collection.findOne(id);
  if (post) {
    res.send(post);
  } else {
    res.status(404).send("Not Found!");
  }
});

app.post("/api/posts", async (req, res) => {
  const requestData = await readBody(req);
  if (Object.keys(requestData).length === 0) return res.sendStatus(400);
  const newPost = await collection.insertOne(requestData);
  res.send(newPost);
});

app.delete("/api/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  const deletedPost = await collection.delete(id);
  if (deletedPost) {
    res.send(deletedPost);
  } else {
    res.status(404).send("Not Found!");
  }
});

app.put("/api/posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  const requestData = await readBody(req);
  if (Object.keys(requestData).length === 0) return res.sendStatus(400);
  const post = await collection.update(id, requestData);
  if (post) {
    res.send();
  } else {
    res.status(404).send(post);
  }
});

app.listen(process.env.PORT || 3000);