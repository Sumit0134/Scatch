const express = require("express");

const app = express();

const db = require("./config/mongoose-connection");

const path = require("path");
const cookieParser = require("cookie-parser");

const ownersRouter=require("./routes/ownersRouter");
const usersRouter=require("./routes/usersRouter");  
const productsRouter=require("./routes/productsRouters");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = 3000;

app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.listen(port, () => {
    console.log(`App is running at port:${port}`);
});