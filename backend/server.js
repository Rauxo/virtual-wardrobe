const express = require("express");
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const connectDB = require("./config/db")
const morgan = require("morgan");

const PORT = process.env.PORT;
connectDB();

//Middleware
app.use(morgan("dev"));

 app.get('/', (req, res) => {
     res.send("API is  Running.....")
    });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});