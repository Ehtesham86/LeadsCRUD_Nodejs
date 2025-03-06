require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectToDB = require("./db/conn");
 const leadsCRUD = require("./routes/leadsCRUD");


const app = express();

 app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 connectToDB();

  app.use("/leads", leadsCRUD);


 app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

// Start Server
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
