const express = require("express");
const crypto = require("crypto");
const cors = require('cors');
const { z } = require("zod");
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
app.post('/signup', cors(), async (req, res) => {
  const zodSchema = z.object({
    username: z.string(),
    password: z.string()
  })
  const signupPayload = req.body;
  let validInputs = zodSchema.safeParse(signupPayload);
  if (validInputs.success) {
    // checking for same email
    let data = await Users.find({ username: signupPayload["username"] })
    if (data.length != 0) {
      res.status(200).json({
        err: "the user already exsists"
      })
    } else {
      newUser = new Users({
        username: signupPayload["username"],
        password: generateHash(signupPayload["password"] + "")
      });
      newUser.save()
        .then(userSaved => console.log(`user Saved :${userSaved}`))
        .catch(err => console.log(err))
      res.json({ msg: "user added" })
    }
  } else {
    // if any one of them holds undefined we return invalid input
    res.json({
      err: "invalid inputs",
    })
  }
})

app.post("/login", cors(), async (req, res) => {
  // let email = req.body.userEmail;
  // let password = req.body.password;
  const zodSchema = z.object({
    username: z.string(),
    password: z.string(),
  })
  const loginPayload = req.body;
  let validInputs = zodSchema.safeParse(loginPayload);
  if (validInputs.success) {
    // let concernedData = memory.find((el) => {
    //   if (el.email === email && el.password === generateHash(password + "")) {
    //     return true;
    //   }
    // })
    let concernedData = await Users.find({ username: loginPayload["username"] })
    if (!concernedData.length) {
      //none found
      res.json({
        msg: "no user found, please sign up"
      }
      )
    } else {
      if (concernedData[0]["username"] === loginPayload["username"] && concernedData[0]["password"] === generateHash(loginPayload["password"] + "")) {
        res.json({
          msg: "logged in successfully"
        })
      } else {
        res.json({
          msg: "bad credentials"
        })
      }
    }
  } else {
    res.json({
      err: "invalid inputs",
    })
  }
})

app.listen(port, () => {
  console.log(`listening on port:${port}`);
})