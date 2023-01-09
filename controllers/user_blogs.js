const router = require("express").Router();

const { User, Blog, UserBlogs } = require("../models");

router.post("/", async (req, res) => {
  const { userId, blogId } = req.body;
  console.log("userId:", userId);
  console.log("blogId:", blogId);
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(400).json({ error: "Invalid user" });
  }
  const blog = await Blog.findByPk(blogId);
  if (!blog) {
    return res.status(400).json({ error: "Cant find blog with provided id" });
  }
  const userBlogsEntry = await UserBlogs.create({ userId, blogId });
  console.log("userBlogsEntry:", userBlogsEntry.toJSON());
  if (!userBlogsEntry) {
    return res
      .status(400)
      .json({ error: "Something went wrong. Cant add blog to reading list." });
  }
  return res.json(userBlogsEntry);
});

module.exports = router;
