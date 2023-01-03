const router = require("express").Router();

const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  console.log("body:", req.body);
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id:", id);
  const result = await Blog.destroy({
    where: {
      id: id,
    },
  });
  console.log("result:", result);
  if (result === 1) {
    return res.status(204).end();
  }
  res.status(400).json({ error: `Cant find blog with id ${id}` });
});

router.put("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.likes = req.body.likes;
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.json(404).end();
  }
});

module.exports = router;
