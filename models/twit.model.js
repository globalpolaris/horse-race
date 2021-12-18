const mongoose = require('mongoose');
const { Schema } = mongoose;

const twitSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamps: true,
});

const Twit = mongoose.model('Twit', twitSchema);
module.exports = Twit;
