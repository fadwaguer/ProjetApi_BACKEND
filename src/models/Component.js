const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true },
  specs: { type: Map, of: String, required: true },
  image: {
    data: { type: Buffer, required: false },
    contentType: { type: String, required: false }, 
  },
});

module.exports = mongoose.model('Component', componentSchema);
