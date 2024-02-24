const express = require("express");
const crypto = require("crypto");
const cors = require('cors');
const { z } = require("zod");
// const mongoose = require("mongoose");
const databaseConnection = require("./database/db")
const Users = require("./model/userModel");
const app = express();
const port = 9000;


app.use(express.json());
app.use(cors());
databaseConnection();
// mongoose.connect('mongodb://localhost:27017/Auth', { useNewUrlParser: true, useUnifiedTopology: true });
function generateHash(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}
app.get('/', cors(), (req, res) => {
  res.json({
    msg: 'hi'
  });
})
app.post('/admin', cors(), (req, res) => {
  const zodSchema = z.object({
    username: z.string(),
    password: z.string()
  })
  const adminPayload = req.body;
  const validInputs = zodSchema.safeParse(adminPayload);
  if (validInputs.success) {
    Users.find({}).exec()
      .then(users => {
        res.json(users);
      }).catch(err => console.log(err))
    // res.json();
  } else {
    res.status(411).json({ msg: "invalid input" })
  }
})
app.post('/signup', cors(), (req, res) => {
  // let email = req.body.userEmail;
  // let password = req.body.password;
  const zodSchema = z.object({
    username: z.string(),
    password: z.string()
  })
  const signupPayload = req.body;
  let validInputs = zodSchema.safeParse(signupPayload);
  if (validInputs.success) {
    // checking for same email
    let doesSameEmailExsits = false;
    let data = Users.find({ username: signupPayload["username"] }).then(users => {
      console.log(users)
    }).catch(err => console.log(err));
    if (data) {
      doesSameEmailExsits = true;
    }
    if (doesSameEmailExsits) {
      res.status(200).json({
        err: "the user already exsists"
      })
    } else {
      // memory.push({ email: email, password: generateHash(password + "") });
      // res.status(200).json({ msg: "user added", token: generateHash(password + "") });
      newUser = new Users({
        username: signupPayload["username"],
        password: signupPayload["password"]
      });
      newUser.save()
        .then(userSaved => console.log(`user Saved :${userSaved}`))
        .catch(err => console.log(err))
      res.json({ msg: "in else" })
    }
  } else {
    // if any one of them holds undefined we return invalid input
    // console.log(email + " " + password);
    res.json({
      err: "invalid inputs",
      "email": email,
      "password": password,
    })
  }
})

app.post("/login", cors(), (req, res) => {
  let email = req.body.userEmail;
  let password = req.body.password;
  if (!email || !password) {
    // if any one of them holds undefined we return invalid input
    res.json({
      err: "invalid inputs",
    })
  }
  let concernedData = memory.find((el) => {
    if (el.email === email && el.password === generateHash(password + "")) {
      return true;
    }
  })
  if (!concernedData) {
    //returned undefined
    res.status(403).json({
      err: "bad crendentials"
    })
  } else {
    // found user
    res.status(200).json({
      msg: "user-found",
      token: generateHash(password + ""),
    })
  }
})

app.listen(port, () => {
  console.log(`listening on port:${port}`);
})