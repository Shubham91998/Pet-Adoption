const mongoose = require("mongoose");

const NutritionUser = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,   
    }, 
    password:{
        type:String,
        required:true
    }
})


const Nutrition = mongoose.model("NutritionData", NutritionUser)
module.exports = Nutrition;