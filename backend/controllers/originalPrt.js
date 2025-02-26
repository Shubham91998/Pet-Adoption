const mongoose = require("mongoose")

const OriginalPet = require("../models/originalPet"); // Import the Pet model
const User = require("../models/user"); // Import the Pet model
const PetRequest = require("../models/petAdoption"); // Import the Pet model

// Controller to add a new pet to the database
const addPet = async (req, res) => {
  const { name, breed, age, type, category, image, userid } = req.body;

  try {
    // Validate required fields
    if (!name || !breed || !age || !type || !category || !image || !userid) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new pet document
    const newPet = new OriginalPet({
      name,
      breed,
      age,
      type,
      category,
      image,
      userid : new mongoose.Types.ObjectId(userid),
    });

    // Save the pet to the database
    await newPet.save();

    // Send success response
    res.status(201).json({ message: "Pet added successfully", pet: newPet });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getOriginalPet = async (req, res) => {
    try {
      const pets = await OriginalPet.find({});
      res.status(200).json(pets);
    } catch (error) {
      console.error("Error fetching pets: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


const finddetails = async(req, res) => {
  try {
    const userId = req.params.id;

    // Convert userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Find the user by ID
    const user = await User.findById(objectId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Query pets where userId matches the ObjectId
    const pets = await OriginalPet.find({ userid: objectId });
   
    // Query pet requests where userId matches the ObjectId
    const petRequests = await PetRequest.find({ userId: objectId });

    // Send response
    res.json({
      user,
      pets,
      petRequests,
    });



  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = { addPet ,getOriginalPet, finddetails};