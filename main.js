const express = require('express');
const cors = require('cors');
const connectToDatabase = require("./db");
const logger = require('./middlewares/logger')
const path = require('path')
require("dotenv").config();



// import routes
const usersRoute = require('./routes/users');
const booksRoute = require('./routes/books');
const loginRoute = require('./routes/login');
const authorsRoute = require('./routes/authors');
const emailRoute = require ('./routes/sendEmail');
const githubRoute = require (`./routes/github`);



const PORT = 3030;
const app = express();

//middleware
app.use(express.json());
app.use(cors())

// service folder upload with express.static middleware

app.use("/uploads", express.static(path.join(__dirname,"./uploads")));

app.use(logger);
app.use('/', usersRoute);
app.use('/', booksRoute);
app.use('/', loginRoute);
app.use('/', authorsRoute);
app.use('/', emailRoute);
app.use(`/`, githubRoute);



connectToDatabase()

app.listen(PORT, () => console.log(`Server connected and listening on port ${PORT}`))