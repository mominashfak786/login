const mongoose = require('../Databases/connections');

const loginSchema = new mongoose.Schema({
  name: {
    type:String
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  }
});

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;