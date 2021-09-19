const path = require('path');
const express = require("express");
const cors=require("cors");
const app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

// fix all deprecation warnings
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);


// middleware to parse body of incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup CORS
app.use(cors());

app.use('/uploads',express.static(path.join(__dirname,'uploads')))

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config").getKeyPass();


const port = process.env.PORT || 3000;

 app.listen(port, () => console.log(`connected with port ${port} ...`));




   



