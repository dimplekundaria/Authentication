const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    }
},{
        timestamps:true
    }
);

// tells mongoose that this is model or collection of userSchema
const User = mongoose.model('User', userSchema);

module.exports = User;