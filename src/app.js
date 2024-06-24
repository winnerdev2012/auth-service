const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const stakingRoutes = require("./routes/stakingRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb+srv://pinkpiggy:admin.1234@cluster0.gzzl6be.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api", stakingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
