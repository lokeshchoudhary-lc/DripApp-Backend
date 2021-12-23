const mongoose = require('mongoose');

const DropSchema = new mongoose.Schema({
  instaUsername: {
    type: String,
    // required: true,
  },
  dropTitle: {
    type: String,
    // required: true,
  },
  dropPicture: {
    type: String,
  },
  dropCategory: {
    type: String,
    // required: true,
  },
  dropDescription: {
    type: String,
  },
  dropDate: {
    type: String,
    // required: true,
  },
  dropTime: {
    type: Date,
    // required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
});
module.exports = mongoose.model('drop', DropSchema);
