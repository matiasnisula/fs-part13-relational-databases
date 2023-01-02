require("dotenv").config();
const { Sequelize, Model, DataTypes, QueryTypes } = require("sequelize");
const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("tiny"));
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

Blog.sync();

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  console.log("body:", req.body);
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
