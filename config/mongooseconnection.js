const mongoose = require('mongoose');
const debug = require('debug')('app:mongoose-connection');
require('dotenv').config();
// Development
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/bagstore") 
    .then(function () {
        debug("Connected to MongoDB successfully");
    })
    .catch(function (err) {
        debug("Error connecting to MongoDB:", err);
    });

module.exports = mongoose.connection;