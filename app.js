const express = require("express");

const app = express();

const connection = require("./config/mongoose-connection");

const path = require("path");

const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const flash=require("connect-flash");
const colors = require("colors");
const mongoStore = require("connect-mongo");

require("dotenv").config();

const indexRouter=require("./routes/index");
const ownersRouter=require("./routes/ownersRouter");
const usersRouter=require("./routes/usersRouter");  
const productsRouter=require("./routes/productsRouters");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    })
})
);
app.use(flash());

const port = process.env.PORT || 3000;

connection();

app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.listen(port, () => {
    console.log(`Sctach is Running on `.yellow + `${process.env.DEV_MODE}`.cyan + ` Mode at: `.yellow + `port:${port}`);
});