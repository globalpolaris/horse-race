const { uuid } = require('uuidv4');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    default: uuid(),
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  expiryDate: Date,
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;
