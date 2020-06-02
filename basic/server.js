const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

const users = [];

app.use(express.json());

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ name, hashedPassword });
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const { name, password } = req.body;
  const user = users.find((user) => user.name === name);

  if (user === null) {
    return res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(password, user.hashedPassword)) {
      res.send("Success");
    } else {
      res.send("Failed");
    }
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
