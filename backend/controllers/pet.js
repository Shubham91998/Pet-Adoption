const Pet = require("../models/pet.js");
const PetRequest = require("../models/petAdoption.js");
const {uploadOnCloudinary} = require("../middleware/cloudnary.js");
const { asyncHandler } = require("../middleware/asyncHandlar.js");

const getPet = async (req, res) => {
  try {
    const pets = await Pet.find({});
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pets: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const submitPetRequest = async (req, res) => {
  try {
    const { userId, petId, currentLocation, reasonForAdoption } = req.body;

    // Create a new pet request
    const newPetRequest = new PetRequest({
      userId,
      petId,
      currentLocation,
      reasonForAdoption,
    });

    // Save to the database
    await newPetRequest.save();

    res.status(201).json({
      message: "Pet request submitted successfully!",
      data: newPetRequest,
    });
  } catch (error) {
    console.error("Error submitting pet request:", error);
    res.status(500).json({ message: "Failed to submit pet request." });
  }
};


const petUpload = asyncHandler(async (req, res) => {
  const { name, breed, age, type, category,userid } = req.body;
  // Check if the image file is provided
  const petImagePath = req.files?.image[0]?.path;
  console.log("Pet image path:", petImagePath);
  if (!petImagePath) {
    return res.status(400).json({ message: "Image file is required." });
  }

  // Upload the image to Cloudinary
  const image = await uploadOnCloudinary(petImagePath);
  console.log(image.url)
  if (!image) {
    return res.status(400).json({ message: "Failed to upload image." });
  }

  // Create a new pet instance
  const newPet = new Pet({
    name,
    breed,
    age,
    type,
    category,
    image: image.url,
    userid:userid
  });

  // Save the new pet to the database
  try {
    const savedPet = await newPet.save();
    res.status(201).json({ message: "Pet created successfully", pet: savedPet });
  } catch (error) {
    console.error("Error saving pet:", error); // Log the error for debugging
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  getPet,
  petUpload,
  submitPetRequest,
};