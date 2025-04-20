const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require('../models/listing.js');



let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB" ,err);
})


async function main() {
    await mongoose.connect(MONGO_URL);
}

console.log("Listing Model:", Listing);

const initDB = async ()=>{
    await Listing.deleteMany({});
    //  adding owner property in every object
    initData.data = initData.data.map(  (obj)=>({...obj ,owner : '67beaa98136c27f2657679a9'}) )
    await Listing.insertMany(initData.data);
    console.log("Database initialized");
};

initDB();