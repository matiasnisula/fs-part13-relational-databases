const router = require("express").Router();

const { Session } = require("../models");
const { userExtractor } = require("../util/middleware");

// remove all sessions for user when logging out
router.delete("/", userExtractor, async (req, res) => {
  const user = req.user;
  await Session.destroy({
    where: {
      userId: user.id,
    },
  });
  return res.status(204).end();
});

module.exports = router;
