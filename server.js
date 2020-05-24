const express = require('express');
const connectDB = require('./config/db');

//initialize app
const app = express();

//initialize DB
connectDB();

//initialize the middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));