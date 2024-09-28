const mongoose = require("mongoose");
const { getStorage } = require("firebase-admin/storage");
const uuid = require("uuid/v4");

const requireLogin = require("../middlewares/requireLogin");
const cleanCache = require("../middlewares/cleanCache");
const Blog = mongoose.model("Blog");

const constructPublicUrl = (filename) =>
  `https://storage.googleapis.com/${process.env.bucket_name}/${filename}`;

async function generateV4UploadSignedUrl(filename, type) {
  const bucket = getStorage().bucket();
  const file = bucket.file(filename);

  const expiresAt = Date.now() + 30 * 60 * 1000;

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: expiresAt,
    contentType: type,
  });

  return url;
}

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  app.get("/api/generate-signed-url", requireLogin, async (req, res) => {
    const { type } = req.query;
    const suffex = type.split("/")[1];
    try {
      const filename = `${req.user.id}/${uuid()}.${suffex}`;
      const url = await generateV4UploadSignedUrl(filename, type);
      res.status(200).send({ url, filename });
    } catch (error) {
      res.status(500).send({ error: "Failed to generate signed URL" });
    }
  });

  app.get("/api/blogs", requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user._id.toString() }).cache({
      key: req.user._id,
    });

    res.send(blogs);
  });

  app.post("/api/blogs", requireLogin, cleanCache, async (req, res) => {
    const { title, content, filename } = req.body;

    const file = await getStorage().bucket().file(filename);
    const [exists] = await file.exists();

    if (!exists) {
      return res.send(404, "File not found !");
    }

    await file.makePublic();

    const blog = new Blog({
      title,
      content,
      imageUrl: constructPublicUrl(filename),
      _user: req.user._id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
