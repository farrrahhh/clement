const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  progress: { type: String },
  simulationResults: { type: String },
  otherData: { type: String }
});

module.exports = mongoose.model('User', userSchema);