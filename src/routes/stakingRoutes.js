const express = require("express");
const router = express.Router();
const stakingController = require("../controllers/stakingController");

router.post("/addStakedBalance", stakingController.addStakedBalance);
router.get(
  "/getStakedBalance/:wallet_address",
  stakingController.getStakedBalance
);
router.get("/getTotalStakedBalance", stakingController.getTotalStakedBalance);
router.delete(
  "/withdrawStakedBalance/:wallet_address",
  stakingController.withdrawStakedBalance
);
router.get("/getPoolPercent/:wallet_address", stakingController.getPoolPercent);
router.get("/getEstimatedRewards", stakingController.getEstimatedRewards);
router.get("/getCurrentRewards", stakingController.getCurrentRewards);
router.get(
  "/getTotalRewards/:wallet_address",
  stakingController.getTotalRewards
);

module.exports = router;
