const Profile = require("../../Model/userModel");
const User = require("../../Model/emailModel");

// exports.Create = async (req, res) => {
//   //#swagger.tags = ['User-Profile']
//   const {
//     userId,
//     firstName,
//     lastName,
//     dob,
//     gender,
//     address,
//     city,
//     occupation,
//     contactNumber,
//     profile
//     // interestedInFIFP,
//   } = req.body;

//   try {
//     const existingUser = await User.findById(userId);
//     if (!existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found. User profile cannot be created.",
//       });
//     }
//     let base64Data = ""
//     if(profile){
//       base64Data=Buffer.from(profile).toString('base64')
//     }

//     const userProfile = new Profile({
//       userId,
//       firstName,
//       lastName,
//       dob,
//       gender,
//       address,
//       city,
//       occupation,
//       contactNumber,
//       profile:base64Data
//       // interestedInFIFP,
//     });

//     await userProfile.save();
//     res.status(201).json({
//       success: true,
//       message: "User profile created successfully",

//       userProfile,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating user profile",
//       error: error.message,
//     });
//   }
// };
exports.Create = async (req, res) => {
  //#swagger.tags = ['User-Profile']
  const {
    userId,
    firstName,
    lastName,
    dob,
    gender,
    address,
    city,
    occupation,
    contactNumber,
  } = req.body;

  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found. User profile cannot be created.",
      });
    }

    let base64Data = "";

    if (req.file) {
      // If the client sends an image file (multipart/form-data)
      const imageBuffer = fs.readFileSync(req.file.path); // Reading file from the path
      base64Data = imageBuffer.toString("base64"); // Convert to base64
    } else if (req.body.profile) {
      // If the client sends base64 string directly in request body
      base64Data = req.body.profile;
    }

    const userProfile = new Profile({
      userId,
      firstName,
      lastName,
      dob,
      gender,
      address,
      city,
      occupation,
      contactNumber,
      profile: base64Data,
    });

    await userProfile.save();
    res.status(201).json({
      success: true,
      message: "User profile created successfully",
      userProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user profile",
      error: error.message,
    });
  }
};
exports.getById = async (req, res) => {
  //#swagger.tags = ['User-Profile']
  try {
    const profile = await Profile.findById(req.params.profile_id);
    if (profile) {
      return res.status(200).json({
        statusCode: "0",
        message: "UserProfile retrieved successfully",
        data: profile,
      });
    } else {
      return res
        .status(404)
        .json({ statusCode: "1", message: "UserProfile not found" });
    }
  } catch (error) {
    console.error("Error while retrieving user profile:", error);
    return res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve userProfile data",
    });
  }
};

// Delete user profile by ID
exports.deleteById = async (req, res) => {
  //#swagger.tags = ['User-Profile']
  try {
    const profile = await Profile.findById(req.params.profile_id);
    if (profile) {
      await Profile.deleteOne({ _id: req.params.profile_id });
      return res.status(200).json({
        statusCode: "0",
        message: "UserProfile data deleted successfully",
      });
    } else {
      return res
        .status(404)
        .json({ statusCode: "1", message: "No userProfile data found" });
    }
  } catch (error) {
    console.error("Error while deleting user profile:", error);
    return res.status(500).json({
      statusCode: "1",
      message: "Failed to delete userProfile",
    });
  }
};

// Get all user profiles
exports.getAll = async (req, res) => {
  //#swagger.tags = ['Emergency-Fund']
  const { userId } = req.query;

  try {
    const profiles = await Profile.find({ userId });

    return res.status(200).json({
      statusCode: "0",
      message: "UserProfile data retrieved successfully",
      data: profiles,
    });
  } catch (error) {
    console.error("Error while retrieving user profiles:", error);
    return res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve userProfile data",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  //#swagger.tags = ['User-Profile']
  const { profile_id } = req.params;
  const {
    firstName,
    lastName,
    dob,
    gender,
    address,
    city,
    occupation,
    contactNumber,
    profile,
    // interestedInFIFP,
  } = req.body;

  let base64Data = "";

  if (req.file) {
    const imageBuffer = fs.readFileSync(req.file.path);
    base64Data = imageBuffer.toString("base64");
  } else if (req.body.profile) {
    base64Data = req.body.profile;
  }

  try {
    const userProfile = await Profile.findByIdAndUpdate(
      profile_id,
      {
        firstName,
        lastName,
        dob,
        gender,
        address,
        city,
        occupation,
        contactNumber,
        // profile
        profile: base64Data,
        // interestedInFIFP,
      },
      { new: true, runValidators: true }
    );

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found. Cannot update.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      userProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};
