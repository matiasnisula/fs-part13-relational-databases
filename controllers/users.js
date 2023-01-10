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
  const user = await User.create(req.body);
  res.json(user);
});

router.put("/:username", async (req, res) => {
  const username = req.params.username;
  const body = req.body;
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
  user.username = body.username;
  const updatedUser = await user.save();
  res.json(updatedUser);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const where = {};
  if (req.query.read) {
    where.read = req.query.read;
  }
  const user = await User.findByPk(id, {
    attributes: ["name", "username"],
    include: [
      {
        model: Blog,
        as: "marked_blogs",
        attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
        through: {
          attributes: ["id", "read"],
          where,
        },
      },
    ],
  });
  if (!user) {
    return res.status(400).json({ error: "Cant find user" });
  }
  return res.json(user);
});

module.exports = router;
