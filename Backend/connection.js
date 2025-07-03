const mongoose = require("mongoose");

//function to connect mongoDB with parameter url
async function connectMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = {
  connectMongoDB,
};
