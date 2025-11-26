const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const connectDB = require("./config/db");
const morgan = require("morgan");
const userRoute = require("./routes/user.route")

const PORT = process.env.PORT;
connectDB();

//Middleware
app.use(express.json());
app.use(morgan("dev"));


//add routes
app.use("/api/v1/user",userRoute);

app.get("/", (req, res) => {
  res.send("API is  Running.....");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
