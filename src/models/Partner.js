const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: {
    data: { type: Buffer, required: false },
    contentType: { type: String, required: false }, 
  },
});

module.exports = mongoose.model('Partner', partnerSchema);
