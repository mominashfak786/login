const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const Login = require("./models/schemas");
const json = require("jsonwebtoken");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.static("public"));

const secretKey = "abcdefghijklmnopqrstuvwxyz"; // replace this with your actual secret key

const islogged = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    const decode = json.verify(token, secretKey);
    req.user = await Login.findById(decode.id);
    // console.log(req.user); // log the user object
    next(); // Call next() to continue to the next middleware or route handler
  } else {
    res.redirect("/login");
  }
};

app.get("/", islogged, async function (req, res) {
  
  res.render("logout", { email: req.user.email });
});


app.get("/create", function (req, res) {
  res.render("create");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;

  let user = await Login.findOne({ email });

  if (!user) {
    return res.redirect("/create");
  }

  const ismatch = user.password===password;
  const isemail = user.email===email;

  if (ismatch == false) {
    return res.render('login',{error:"Password is incorrect, Try again"})
  }
  if (isemail == false) {
    return res.render('login',{error1:"email is incorrect, Try again"})
  }
  await user.save();
  const user_id = user._id;
  const token = json.sign({ id: user_id }, secretKey);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 900000),
  });
  res.redirect("/");
});

app.post("/create", async function (req, res) {
  const { name, email, password } = req.body;

  let user = await Login.findOne({ email });

  if (user) {
    return res.redirect("/login");
  }

    user = new Login({
    name: name,
    email: email,
    password: password,
  });

  await user.save();
  const user_id = user._id;
  const token = json.sign({ id: user_id }, secretKey);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 900000),
  });
  res.redirect("/");
});

app.get("/logout", function (req, res) {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(0),
  });
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("connected");
});
