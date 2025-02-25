// controllers/petRequestController.js
const PetRequest = require("../models/petAdoption.js");

const getUserPetRequest = async (req, res) => {
  try {
    const petRequest = await PetRequest.findOne({ userId: req.params.userId });

    if (!petRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, data: petRequest });
  } catch (error) {
    console.error("Error fetching user request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// ✅ Update process status for a pet request
const processStatusInformation = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from params
    const { processStatus } = req.body; // Extract processStatus from request body

    const validStatuses = [
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
      "Rejected",
    ];

    if (!validStatuses.includes(processStatus)) {
      return res.status(400).json({ message: "Invalid status selected." });
    }

    const updatedRequest = await PetRequest.findByIdAndUpdate(
      id,
      { processStatus }, // Correctly updating processStatus
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Pet request not found." });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully!",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ✅ Fetch all pet adoption requests
const getAllPetRequests = async (req, res) => {
  try {
    const petRequests = await PetRequest.find({}, "userId petId processStatus"); // Ensure processStatus is retrieved

    res.status(200).json({
      success: true,
      data: petRequests,
    });
  } catch (error) {
    console.error("Error fetching pet requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pet requests.",
    });
  }
};

// ✅ Verify a pet adoption request
const verifyPetRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRequest = await PetRequest.findByIdAndUpdate(
      id,
      { processStatus: "Verified" }, // Consistent with processStatus instead of status
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Pet request not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet request verified successfully!",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error verifying pet request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify pet request.",
    });
  }
};

// ✅ Reject a pet adoption request
const rejectPetRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRequest = await PetRequest.findByIdAndUpdate(
      id,
      { processStatus: "Rejected" }, // Using processStatus for consistency
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Pet request not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pet request rejected successfully!",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error rejecting pet request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject pet request.",
    });
  }
};

module.exports = {
  getAllPetRequests,
  verifyPetRequest,
  rejectPetRequest,
  processStatusInformation,
  getUserPetRequest, // Fixed function name for consistency
};
