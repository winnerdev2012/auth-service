import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  id: String,
  type: String,
  address: String,
  nonCustodial: Boolean,
  createdAt: String,
});

const UserSchema = new mongoose.Schema(
  {
    id: String,
    email: String,
    loginType: String,
    epicId: String,
    deploymentId: String,
    wallets: [WalletSchema],
    service: { type: String, default: 'blockus' },
  },
  { timestamps: true },
);

const GameUser = mongoose.model('GameUser', UserSchema);

export { GameUser };
