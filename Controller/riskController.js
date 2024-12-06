
const Risk = require("../Model/riskModel");
const User = require("../Model/emailModel");

const calculateRiskProfile = (totalScore) => {
  if (totalScore >= 6 && totalScore <= 10) {
    return "Conservative Risk Profile (Low risk tolerance)";
  } else if (totalScore >= 11 && totalScore <= 15) {
    return "Moderate Conservative Risk Profile";
  } else if (totalScore >= 16 && totalScore <= 20) {
    return "Balanced Risk Profile";
  } else if (totalScore >= 21 && totalScore <= 25) {
    return "Aggressive Risk Profile";
  } else {
    return "Very Aggressive Risk Profile (High risk tolerance)";
  }
};

exports.saveRiskProfile = async (req, res) => {
  //#swagger.tags = ['PersonalRisk-Tolerance']
  try {
    const { userId, answers } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statuscode: "1",
        message: "User not found",
      });
    }

    let totalScore = 0;
    const processedAnswers = answers.map((item, index) => {
      const points =
        item.answer.toLowerCase() === "a"
          ? 1
          : item.answer.toLowerCase() === "b"
          ? 2
          : item.answer.toLowerCase() === "c"
          ? 3
          : 4;
      totalScore += points;
      return {
        question: index + 1,
        answer: item.answer,
        points,
      };
    });

    const riskProfile = calculateRiskProfile(totalScore);

    const riskData = new Risk({
      userId,
      answers: processedAnswers,
      totalScore,
      riskProfile,
    });

    await riskData.save();

    res.status(201).json({
      statuscode: "0",
      message: "Personal Risk Tolerance created successfully",
      userId,
      data: processedAnswers,
    });
  } catch (error) {
    res.status(500).json({
      statuscode: "1",
      message: "An error occurred",
      error: error.message,
    });
  }
};

// exports.getRiskProfile = async (req, res) => {
//   //#swagger.tags = ['PersonalRisk-Tolerance']
//   try {
//     const { userId } = req.query;

//     const riskData = await Risk.findOne({ userId });

//     if (!riskData) {
//       return res.status(404).json({
//         statuscode: "1",
//         message: "No risk profile found for this user",
//       });
//     }

//     res.status(200).json({
//       statuscode: "0",
//       message: "Data retrieved successfully",
//       userId: riskData.userId,
//       data: riskData.answers,
//       totalScore: riskData.totalScore,
//       status: riskData.riskProfile,
//     });
//   } catch (error) {
//     res.status(500).json({
//       statuscode: "1",
//       message: "An error occurred",
//       error: error.message,
//     });
//   }
// };
exports.getRiskProfile = async (req, res) => {
    //#swagger.tags = ['PersonalRisk-Tolerance']
    try {
      const { userId } = req.query;
  
      // Find the most recent risk profile for the given user, sorted by createdAt in descending order
      const riskData = await Risk.find({ userId }).sort({ createdAt: -1 }).limit(1);
  
      if (!riskData || riskData.length === 0) {
        return res.status(404).json({
          statuscode: "1",
          message: "No risk profile found for this user",
        });
      }
  
      // Since we're using .find().sort().limit(1), riskData is an array, so we need to access the first element
      const latestRiskData = riskData[0];
  
      res.status(200).json({
        statuscode: "0",
        message: "Data retrieved successfully",
        userId: latestRiskData.userId,
        data: latestRiskData.answers,
        totalScore: latestRiskData.totalScore,
        status: latestRiskData.riskProfile,
      });
    } catch (error) {
      res.status(500).json({
        statuscode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  };
  