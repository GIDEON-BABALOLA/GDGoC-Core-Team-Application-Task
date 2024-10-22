const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'developer', 'designer', 'administrator'],
    default: 'admin',
  },
  accessToken : {
    type:String
},
  refreshToken : {
  type : String
}
},
{
    timestamps : true
}
);

const User = mongoose.model('Admin', adminSchema);
module.exports = User;
