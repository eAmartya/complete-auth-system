const express = require("express");
const crypto = require("crypto");
const cors = require('cors');
const app = express();
const port = 9000;
app.use(express.json());
app.use(cors());

function generateHash(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

const memory = [{
  email: "abc@gmail.com",
  password: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
}, {
  email: "defg@gmail.com",
  password: "b3a8e0e1f9ab1bfe3a36f231f676f78bb30a519d2b21e6c530c0eee8ebb4a5d0"
}, {
  email: "hij@gmail.com",
  password: "35a9e381b1a27567549b5f8a6f783c167ebf809f1c4d6a9e367240484d8ce281"
}, {
  email: "klm@gmail.com",
  password: "2ac9a6746aca543af8dff39894cfe8173afba21eb01c6fae33d52947222855ef"
}]
app.get('/', cors(), (req, res) => {
  res.json({
    msg: 'hi'
  });
})
app.post('/admin', cors(), (req, res) => {
  let email = req.body.userEmail;
  let password = req.body.password;
  if (!email || !password) {
    res.status(403).json({ msg: "invalid input" })
  }
  else if (email === "admin" && password === "admin") {
    res.json(memory);
  }
})
app.post('/signup', cors(), (req, res) => {
  let email = req.body.userEmail;
  let password = req.body.password;

  if (!email || !password) {
    // if any one of them holds undefined we return invalid input
    // console.log(email + " " + password);
    res.json({
      err: "invalid inputs",
      "email": email,
      "password": password,
    })
  } else {
    // checking for same email
    let doesSameEmailExsits = false;
    memory.find((el) => {
      if (el.email === email) {
        doesSameEmailExsits = true;
        return true;
      }
    })
    if (doesSameEmailExsits) {
      res.status(403).json({
        err: "the user already exsists"
      })
    } else {
      memory.push({ email: email, password: generateHash(password + "") });
      res.status(200).json({ msg: "user added", token: generateHash(password + "") });
    }
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