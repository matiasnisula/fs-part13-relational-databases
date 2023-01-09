const router = require("express").Router();

const { User, Blog, UserBlogs } = require("../models");
const { userExtractor } = require("../util/middleware");

router.post("/", async (req, res) => {
  const { userId, blogId } = req.body;
  if (!userId || !blogId) {
    return res
      .status(400)
      .json({ error: "Invalid input. Please provide userId and blogId." });
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(400).json({ error: "Invalid user" });
  }
  const blog = await Blog.findByPk(blogId);
  if (!blog) {
    return res.status(400).json({ error: "Cant find blog with provided id" });
  }
  const userBlogsEntry = await UserBlogs.create({ userId, blogId });
  if (!userBlogsEntry) {
    return res
      .status(400)
      .json({ error: "Something went wrong. Cant add blog to reading list." });
  }
  return res.json(userBlogsEntry);
});

router.put("/:id", userExtractor, async (req, res) => {
  const user = req.user;
  const userBlogsId = req.params.id;
  const userBlog = await UserBlogs.findByPk(userBlogsId);
  if (user.id !== userBlog.userId) {
    return res.status(400).json({
      error: "Authenticated user is not owner of the requested reading list",
    });
  }
  userBlog.read = req.body.read;
  const result = await userBlog.save();
  return res.json(result);
});

module.exports = router;
