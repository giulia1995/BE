const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./middlewares/logger");
require("dotenv").config();

const PORT = 3030;
const app = express();

//import delle routes
const usersRoute = require("./routes/users");
const authorsRoute = require("./routes/authors");
const booksRoute = require("./routes/books");
const loginRoute = require("./routes/login");

//middleware
app.use(cors());
app.use(express.json());

app.use(logger);
app.use("/", usersRoute);
app.use("/", authorsRoute);
app.use("/", booksRoute);
app.use("/", loginRoute);

//connessione del database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on(`error`, console.error.bind(console, "Db connection error!"));
db.once("open", () => {
  console.log("Database successfully connected!");
});

app.listen(PORT, () =>
  console.log(`Server connected and listening on port  ${PORT}`)
);
