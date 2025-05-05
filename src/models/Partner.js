const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  componentPrices: [{
    component: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true },
    price: { type: Number, required: true },
  }],
});

module.exports = mongoose.model('Partner', partnerSchema);