const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = 3030;

const app = express();
//import delle routes
const authorsRoute = require ("./routes/authors");
//middleware
app.use(cors())
app.use(express.json());
app.use("/", authorsRoute);


//connessione del database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})
const db = mongoose.connection;
db.on(`error`, console.error.bind(console, "Db connection error!"))
db.once("open", ()=> {
    console.log("Database successfully connected!")
})





app.listen(PORT , () => console.log(`Server connected and listening on port  ${PORT}`))