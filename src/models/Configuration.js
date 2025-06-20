const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    components: [{ type: mongoose.Schema.Types.ObjectId, ref: "Component" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Configuration", configurationSchema);
