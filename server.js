const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require("dotenv").config();
const cors = require('cors');
const colors = require('colors');
const connectDB = require('../backend/config/db.js');
const errorHandler = require('../backend/middleware/error.js');
const cookieParser = require('cookie-parser');
const path = require('path')

const authRoute = require('../backend/routes/authRoutes.js')
const userRoute = require('../backend/routes/userRoutes.js');
const jobTypeRoute = require('../backend/routes/jobTypeRoutes.js');
const jobRoute = require('../backend/routes/jobsRoutes.js');

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cookieParser());

//routes
// app.get('/', (req, res) => {
//     res.send("Hello from Node.js")
// })
app.use('/api', authRoute)
app.use('/api', userRoute)
app.use('/api', jobTypeRoute)
app.use('/api', jobRoute)

// Error handler middleware
app.use(errorHandler);

app.use(express.static(path.join(__dirname, "./frontend/build")))

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./frontend/build/index.html"))
})

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`.bgCyan.white);
});
