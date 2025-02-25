const mongoose = require("mongoose");

const petRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true,
  },
  currentLocation: {
    type: String,
    required: true,
  },
  reasonForAdoption: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  processStatus: {
    type: String,
    enum: [
      "Submitted",
      "Under Review",
      "Home Visit Scheduled",
      "Meet-and-Greet",
      "Reference Checks",
      "Adoption Agreement",
      "Adoption Fee Payment",
      "Post-Adoption Support",
      "Follow-Up",
      "Community Engagement",
      "Rejected"
    ],
    default: "Submitted",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PetRequest = mongoose.model("PetRequest", petRequestSchema);

module.exports = PetRequest;
