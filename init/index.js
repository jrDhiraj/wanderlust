// // this is use to insert premade data in the database

// // const mongoose = require("mongoose");
// // const initializeData = require("./data.js");
// // const Listing = require("../models/listing.js");
// // const User = require("../models/user.js");

// myDataBase = 'mongodb://127.0.0.1:27017/wanderlust'
// main().then( ()=>{
//     console.log("connected to dbs")
// }).catch(err => console.log("this is error",err));
// async function main(){
//     await mongoose.connect(myDataBase)
// }

// const initData = async () =>{
//     await Listing.deleteMany({})
//     await Listing.insertMany(initializeData.data)
//     console.log("data inserted in to database")
// }

// initData()


const mongoose = require("mongoose");
const initializeData = require("./data.js");
const Listing = require("../models/listing.js");

const myDataBase = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log("Connected to DB");
}).catch(err => console.log("This is error:", err));

async function main() {
    await mongoose.connect(myDataBase);
}

const initData = async () => {
    try {
        // First, delete all the data
        await Listing.deleteMany({});

        // Check if initializeData.data exists and is an array
        if (Array.isArray(initializeData.data)) {
            // Map the data to add an owner field
            const mappedData = initializeData.data.map((obj) => ({
                ...obj,
                owner: "677e6e912218d22d5c79609f"
            }));

            // Insert the modified data into the database
            await Listing.insertMany(mappedData);

            console.log("Data inserted into the database");
        } else {
            console.log("initializeData.data is not an array");
        }
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

initData();
