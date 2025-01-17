const express = require("express");
const axios = require("axios");
const cors = require("cors");
const router = require("./routes/router");
const app = express();
const PORT = 3000;

//cors middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});