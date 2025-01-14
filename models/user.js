const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    email:{
        type:String,
        required: true,
    },
    
});
userSchema.plugin(passportLocalMongoose); // use becouse of autometic impliment password and username in the schema

module.exports = mongoose.model('User', userSchema);
