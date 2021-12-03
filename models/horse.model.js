const mongoose = require('mongoose');
const { Schema } = mongoose;

const horseSchema = new Schema({
  name: String,
  age: Number,
  breed: String,
  speed: Number,
  health: Number,
  stamina: Number,
  createdAt: { type: Date, default: Date.now },
});

const Horse = mongoose.model('Horse', horseSchema);

module.exports = Horse;
