const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    breed:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        enum: ['cat', 'dog', 'other'],
        required: true,
    },
    category:{
        type:String,
        enum:['Adoptable', 'Foster', 'Lost', 'Found'],
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

const OriginalPet = mongoose.model('OriginalPet', petSchema);

module.exports = OriginalPet;