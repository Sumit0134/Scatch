const mongoose = require("mongoose");

const colors = require("colors");

const connection = async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connected to Database: `.yellow + `${conn.connection.host}`.cyan);
    } catch(err){
        console.log(`Error Connecting to Database: `.yellow + ` ${err}`.red);
    }
}

module.exports = connection;

