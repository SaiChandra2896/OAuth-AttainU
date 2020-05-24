//configure Mongoose DB here
const mongoose = require('mongoose');
const config = require('config');
//get mongo URI
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: false, useFindAndModify: false });
        console.log('mongoDB connected');
    }
    catch (err) {
        console.log(err.message);
        //exit the process with failure
        process.exit(1);
    }
}

module.exports = connectDB;