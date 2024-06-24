const Staking = require("../models/Staking");

const blocksPerYear = 2102400;
const disbursementPeriodYears = 3;

exports.addStakedBalance = async (req, res) => {
  console.log(111);
  const { wallet_address, staked_balance } = req.body;
  console.log(wallet_address);
  console.log(staked_balance);
  try {
    const staking = new Staking({ wallet_address, staked_balance });
    await staking.save();
    res.status(201).send("OK");
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getStakedBalance = async (req, res) => {
  const { wallet_address } = req.params;
  try {
    const staking = await Staking.findOne({ wallet_address });
    if (!staking) return res.status(200).send({ data: 0 });
    res.status(200).send({ data: staking.staked_balance });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTotalStakedBalance = async (req, res) => {
  try {
    const totalStaked = await Staking.aggregate([
      { $group: { _id: null, total: { $sum: "$staked_balance" } } },
    ]);
    res
      .status(200)
      .send({ data: totalStaked.length > 0 ? totalStaked[0].total : 0 });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.withdrawStakedBalance = async (req, res) => {
  const { wallet_address } = req.params;
  try {
    const staking = await Staking.findOneAndDelete({ wallet_address });
    if (!staking) return res.status(404).send("Wallet address not found");
    res.status(200).send("Staked balance withdrawn");
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getPoolPercent = async (req, res) => {
  const { wallet_address } = req.params;
  try {
    const walletStaking = await Staking.findOne({ wallet_address });
    if (!walletStaking) return res.status(200).send({ data: 0 });

    let totalStaked = await Staking.aggregate([
      { $group: { _id: null, total: { $sum: "$staked_balance" } } },
    ]);

    const poolPercent =
      totalStaked.length > 0
        ? (walletStaking.staked_balance / totalStaked[0].total) * 100
        : 0;
    res.status(200).send({ data: poolPercent.toFixed(2) });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getEstimatedRewards = async (req, res) => {
  try {
    const annualRate = 166; // in percentage
    const monthlyRate = annualRate / 12;
    const dailyRate = annualRate / 365;
    res.status(200).send({ data: annualRate });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getCurrentRewards = async (req, res) => {
  try {
    const totalBlocks = blocksPerYear * disbursementPeriodYears;
    const totalStaked = await Staking.aggregate([
      { $group: { _id: null, total: { $sum: "$staked_balance" } } },
    ]);
    const totalRewardsDistributed =
      totalStaked.length > 0 ? totalStaked[0].total * 1.66 : 0;
    const currentRewardsPerBlock = totalRewardsDistributed / totalBlocks;
    res.status(200).send({ data: Number(currentRewardsPerBlock).toFixed(2) });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTotalRewards = async (req, res) => {
  const { wallet_address } = req.params;
  try {
    const walletStaking = await Staking.findOne({ wallet_address });
    if (!walletStaking) return res.status(200).send({ data: 0 });

    const totalStaked = await Staking.aggregate([
      { $group: { _id: null, total: { $sum: "$staked_balance" } } },
    ]);

    const total = totalStaked.length > 0 ? totalStaked[0].total : 0;

    const totalBlocks = blocksPerYear * disbursementPeriodYears;
    const totalRewardsDistributed =
      totalStaked.length > 0 ? totalStaked[0].total * 1.66 : 0;
    const currentRewardsPerBlock = totalRewardsDistributed / totalBlocks;

    // Calculate the staking duration in blocks
    const stakingDurationInMilliseconds = new Date() - new Date(walletStaking.timestamp);
    const stakingDurationInYears = stakingDurationInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    const stakingDurationInBlocks = stakingDurationInYears * blocksPerYear;

    const poolPercent = total > 0 ? (walletStaking.staked_balance / total) : 0;
    const totalRewards = poolPercent * currentRewardsPerBlock * stakingDurationInBlocks;

    res.status(200).send({ data: totalRewards.toFixed(4) });
  } catch (error) {
    res.status(400).send(error);
  }
};
