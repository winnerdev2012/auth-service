require("dotenv").config();
const {
  PRIVATE_KEY,
  PUBLIC_ADDRESS,
  SEPOLIA_PRESALE_ADDRESS,
  BSCTESTNET_PRESALE_ADDRESS,
  SEPOLIA_RPCURL,
  BSCTESTNET_RPCURL,
} = process.env;

const express = require("express");
const app = express();
const port = 3000;

const { Web3 } = require("web3");
const Provider = require("@truffle/hdwallet-provider");

// Middleware to parse JSON bodies
app.use(express.json());

const SepoliaPresaleABI = require("./abis/SepoliaPresale.json");
const BSCTestnetPresaleABI = require("./abis/BSCTestnetPresale.json");

async function updateCurrentStage(network, value) {
  var rpcURL, presaleABI, presaleAddress;
  if (network === "SEPOLIA") {
    console.log("SEPOLIA");
    rpcURL = SEPOLIA_RPCURL;
    presaleABI = SepoliaPresaleABI;
    presaleAddress = SEPOLIA_PRESALE_ADDRESS;
  } else if (network === "BSCTESTNET") {
    console.log("BSCTESTNET");
    rpcURL = BSCTESTNET_RPCURL;
    presaleABI = BSCTestnetPresaleABI;
    presaleAddress = BSCTESTNET_PRESALE_ADDRESS;
  }

  var provider = new Provider(PRIVATE_KEY, rpcURL);
  var web3 = new Web3(provider);
  var myContract = new web3.eth.Contract(presaleABI, presaleAddress);
  console.log("---contract---");

  try {
    var receipt = await myContract.methods
      .changeCurrentStage(value)
      .send({ from: PUBLIC_ADDRESS });
    console.log(receipt);
  } catch (error) {
    console.log("Error: >>>>>>>>>>>>>>>>", error);
    updateCurrentStage(network, value);
  }
}

function parseHexString(hex) {
  // Ensure the string starts with '0x'
  if (!hex.startsWith("0x")) {
    throw new Error("Invalid hex string");
  }

  // Remove '0x' prefix
  hex = hex.slice(2);

  // Each value is 64 hex characters long (256 bits)
  const prevValueHex = hex.slice(0, 64);
  const curValueHex = hex.slice(64, 128);
  const timeStampHex = hex.slice(128, 192);

  // Convert hex strings to integers
  const prevValue = BigInt("0x" + prevValueHex).toString();
  const curValue = BigInt("0x" + curValueHex).toString();
  const timeStamp = BigInt("0x" + timeStampHex).toString();

  return {
    prevValue: parseInt(prevValue, 10),
    curValue: parseInt(curValue, 10),
    timeStamp: parseInt(timeStamp, 10),
  };
}

// Route to handle POST requests to /streams/webhooks_sepolia
app.post("/streams/webhooks_sepolia", (req, res) => {
  if (
    req.body.confirmed &&
    req.body.abi[0] &&
    req.body.abi[0].name == "CurrentStageUpdated"
  ) {
    // Parse the values from the hex string
    const values = parseHexString(req.body.logs[0].data);
    console.log(values);
    updateCurrentStage("BSCTESTNET", values.curValue);
  }
  res.sendStatus(200);
});

// Route to handle POST requests to /streams/webhooks_bsctestnet
app.post("/streams/webhooks_bsctestnet", (req, res) => {
  if (
    req.body.confirmed &&
    req.body.abi[0] &&
    req.body.abi[0].name == "CurrentStageUpdated"
  ) {
    // Parse the values from the hex string
    const values = parseHexString(req.body.logs[0].data);
    console.log(values);
    updateCurrentStage("SEPOLIA", values.curValue);
  }
  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // updateCurrentStage("SEPOLIA", 3);
  // updateCurrentStage("BSCTESTNET", 5);
});
