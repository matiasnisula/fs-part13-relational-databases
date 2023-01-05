const router = require("express").Router();

const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  console.log("body:", req.body);
  const user = await User.create(req.body);
  res.json(user);
});

//change username
router.put("/:username", async (req, res) => {
  const username = req.params.username;
  const body = req.body;
  console.log("param username:", username);
  console.log("body:", body);
  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  if (!user) {
    return res
      .status(400)
      .json({ error: `Cant find user with username ${username}` });
  }
  console.log("user found:", user.toJSON());
  user.username = body.username;
  const updatedUser = await user.save();
  console.log("updatedUser:", updatedUser.toJSON());
  res.json(updatedUser);
});

module.exports = router;
