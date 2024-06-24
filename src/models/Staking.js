const mongoose = require("mongoose");

const stakingSchema = new mongoose.Schema({
  wallet_address: { type: String, required: true, unique: true },
  staked_balance: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Staking", stakingSchema);
