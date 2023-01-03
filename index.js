const express = require("express");
const morgan = require("morgan");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const blogsRouter = require("./controllers/blogs");

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/blogs", blogsRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
