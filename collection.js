import {promises as fs} from "fs";
import {join} from "path";

export class Collection {
  constructor(collectionName) {
    this.filePath = join(process.cwd(), "data", collectionName + ".json");
  }

  list() {
    return this._readData();
  }

  findOne(id) {
    return this._readData().then(posts => posts.find(post => post.id === id));
  }

  async insertOne(data) {
    const posts = await this._readData();
    const newId = Math.max.apply(Math, posts.map((o) => {
      return o.id;
    })) + 1;
    const newPost = {data: {...data}, id: newId, timestamp: "string"};
    posts.push(newPost);
    await fs.writeFile(this.filePath, JSON.stringify(posts, null, 2), "utf-8");
    return newPost;
  }

  async delete(id) {
    const posts = await this._readData();
    const postToDelete = await posts.indexOf(posts.find(element => element.id === id));
    if (postToDelete > -1) {
      const deletedPost = await posts.splice(postToDelete, 1);
      await this._writeData(posts);
      return deletedPost;
    } else {
      return null;
    }
  }

  async update(id, newData) {
    const posts = await this._readData();
    let post = null;
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === id) {
        post = posts[i];
        break;
      }
    }
    if (post) {
      post.data.title = newData.title;
      post.data.text = newData.text;
      await this._writeData(posts);
      return post;
    } else {
      return null;
    }
  }

  async _readData() {
    const fileData = await fs.readFile(this.filePath, "utf-8");
    return JSON.parse(fileData);
  }

  async _writeData(data) {
    return await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}