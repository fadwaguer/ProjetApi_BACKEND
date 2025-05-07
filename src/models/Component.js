const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true },
  specs: { type: Object, required: true },
});

module.exports = mongoose.model('Component', componentSchema);
