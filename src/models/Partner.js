const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    website: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    image: {
      data: { type: Buffer, required: false },
      contentType: { type: String, required: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
