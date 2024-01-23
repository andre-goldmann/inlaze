const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const knex = require("knex");
const knexfile = require("./knexfile");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// get config vars
dotenv.config();

const app = express();
const port = 3000;
// TOOD load from env

const db = knex(knexfile.development);

const authenticateToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token missing" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden - Invalid token" });
    }

    req.user = user;
    next();
  });
};

async function insertUser(user) {
  return db("users")
    .insert({
      fullName: user.fullName,
      age: user.age,
      email: user.email,
      password: user.password,
    })
    .returning("id");
}

async function insertPost(post) {
  return db("posts")
    .insert({
      title: post.title,
      content: post.content,
      likes: 0,
      userId: post.userId,
    })
    .returning("id");
}

async function getUserByEmailAndPassword(email, password) {
  return db("users").select("*").where({
    email: email,
    password: password,
  });
}

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../dist/nasavic/browser")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/nasavic/browser/index.html"));
});

app.get("/api/users", async (req, res) => {
  console.info("Loading users!");
  const users = await db("users").select("*");
  res.json(users);
});

app.put("/api/user", authenticateToken, async (req, res) => {
  const user = req.body;
  if (user === undefined) {
    console.error(req.body);
    res.status(400).send("Post cannot be null!");
    return;
  }
  try {
    await db("users").where({ id: user.userId }).update({
      fullName: user.fullName,
      email: user.email,
      age: user.age,
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
    throw error;
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmailAndPassword(email, password);

    if (user.length > 0) {
      const token = jwt.sign(
        { userId: user.id, username: user.fullName },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" },
      );
      res.json({ token: token, user: user[0] });
    } else {
      // Authentication failed
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/api/register", async (req, res) => {
  const user = req.body;
  console.info("Register user: ", user);
  if (user === undefined) {
    console.error(req.body);
    res.status(400).send("User cannot be null!");
    return;
  }
  try {
    const userId = await insertUser(user);
    user.id = userId[0].id;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
    throw error;
  }
});

app.get("/api/posts", authenticateToken, async (req, res) => {
  console.info("Loading posts!");
  const posts = await db("posts")
    .select("posts.*", "users.fullName as userName")
    .leftJoin("users", "users.id", "posts.userId");

  res.status(200).json(posts);
});

app.post("/api/post", authenticateToken, async (req, res) => {
  const post = req.body;
  post.createdAt = new Date();
  if (post === undefined) {
    console.error(req.body);
    res.status(400).send("Post cannot be null!");
    return;
  }
  try {
    const postId = await insertPost(post);
    post.id = postId[0].id;
    res.status(200).json(post);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
    throw error;
  }
});

app.put("/api/post", authenticateToken, async (req, res) => {
  const post = req.body;

  await db("posts").where({ id: post.postId }).update({
    title: post.editTitle,
    content: post.editCcontent,
  });
  res.status(200).json(post);
});

app.get("/api/posts/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  if (query === undefined) {
    res.status(401).json({ success: false, message: "Invalid query" });
  }

  let substring = query.toLowerCase();

  const posts = await db("posts")
    .select("*", "users.fullName as userName")
    .leftJoin("users", "users.id", "posts.userId")
    .where("posts.title", "like", `%${substring}%`)
    .orWhere("posts.content", "like", `%${substring}%`);

  res.status(200).json(posts);
});

app.delete("/api/post/delete", authenticateToken, async (req, res) => {
  const { id } = req.query;
  if (id === undefined) {
    console.info(req);
    res.status(401).json({ success: false, message: "Invalid id" });
  }
  console.info(id);
  await db("posts").where({ id }).del();
  res.status(200).json("Deleted");
});

async function applyMigrations() {
  try {
    await db.migrate.latest();
    console.log("Database migrations applied");
  } catch (error) {
    console.error("Error applying migrations", error);
  }
}

applyMigrations();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
