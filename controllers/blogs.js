const router = require("express").Router();

const { Blog, User } = require("../models");
const { userExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
    },
  });
  res.json(blogs);
});

router.post("/", userExtractor, async (req, res) => {
  console.log("body:", req.body);
  const blog = await Blog.create({ ...req.body, userId: req.user.id });
  res.json(blog);
});

router.delete("/:id", userExtractor, async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  console.log("loggedUser:", user.toJSON());
  const blog = await Blog.findByPk(id);

  if (!blog) {
    return res.status(404).json({ error: `Cant find blog with id ${id}` });
  }
  console.log("blog:", blog.toJSON());
  if (blog.userId !== user.id) {
    return res
      .status(403)
      .json({ error: "Permission to delete this blog denied" });
  }
  const result = await Blog.destroy({
    where: {
      id: id,
    },
  });
  if (!result) {
    return res.status(400).json({ error: "something went wrong" });
  }
  return res.status(204).end();
});

router.put("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!req.body.likes) {
    return res.status(400).json({ error: "likes is needed as input" });
  }
  if (!blog) {
    return res
      .status(404)
      .json({ error: `Cant find blog with id ${req.params.id}` });
  }
  blog.likes = req.body.likes;
  const updatedBlog = await blog.save();
  res.json(updatedBlog);
});

module.exports = router;
