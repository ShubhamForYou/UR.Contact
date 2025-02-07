const mongoose = require("mongoose");
const connectMONGO_DB = (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("MONGO-DB CONNECT 🟢");
    })
    .catch((err) => {
      console.log("🔴 MONGO-DB ERROR: ", err);
    });
};

module.exports = connectMONGO_DB;
