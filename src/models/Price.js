const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Component",
      required: true,
    },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

priceSchema.index({ partner: 1, component: 1 }, { unique: true });

module.exports = mongoose.model("Price", priceSchema);
