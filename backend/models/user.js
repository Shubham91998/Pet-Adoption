const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user', 
    },
    secretKey: {
        type: String,
        
      },
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;