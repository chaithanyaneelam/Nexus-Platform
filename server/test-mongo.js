const mongoose = require("mongoose");

const uri =
  "mongodb+srv://neelamchaithanya6:Chaithu123@cluster0.yhivgju.mongodb.net/nexus_upskill?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });
