
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
const assetsAllocationDetails = (riskTotalScore)=>{
  if (riskTotalScore >= 6 && riskTotalScore <= 10) {
    return {
      DebtInstruments:"60-80%",
      Stocks:"10-20%",
      CashEquivalents:"10-20%",
      RealEstate:"0-10%",
      AlternativeInvestments :"0%"
    };
  } else if (riskTotalScore >= 11 && riskTotalScore <= 15) {
    return {
      DebtInstruments:"50-60%",
      Stocks:"25-35%",
      CashEquivalents:"10-20%",
      RealEstate:"0-10%",
      AlternativeInvestments :"0%"
    };
  } else if (riskTotalScore >= 16 && riskTotalScore <= 20) {
    return {
      DebtInstruments:"40-50%",
      Stocks:"40-50%",
      CashEquivalents:"05-10%",
      RealEstate:"0-10%",
      AlternativeInvestments :"0%"
    };
  } else if (riskTotalScore >= 21 && riskTotalScore <= 25) {
    return {
      DebtInstruments:"20-30%",
      Stocks:"50-70%",
      CashEquivalents:"05-10%",
      RealEstate:"0-10%",
      AlternativeInvestments :"0%"
    };
  } else {
    return {
      DebtInstruments:"10-20%",
      Stocks:"60-80%",
      CashEquivalents:"0-10%",
      RealEstate:"0-10%",
      AlternativeInvestments :"10-20%"
    };
  }
}

// exports.getRiskProfile = async (req, res) => {
//     //#swagger.tags = ['PersonalRisk-Tolerance']
//     try {
//       const { userId } = req.query;
  
      
//       const riskData = await Risk.find({ userId }).sort({ createdAt: -1 }).limit(1);
  
//       if (!riskData || riskData.length === 0) {
//         return res.status(404).json({
//           statuscode: "1",
//           message: "No risk profile found for this user",
//         });
//       }
  
      
//       const latestRiskData = riskData[0];
  
//       res.status(200).json({
//         statuscode: "0",
//         message: "Data retrieved successfully",
//         userId: latestRiskData.userId,
//         data: latestRiskData.answers,
//         totalScore: latestRiskData.totalScore,
//         status: latestRiskData.riskProfile,
//       });
//     } catch (error) {
//       res.status(500).json({
//         statuscode: "1",
//         message: "An error occurred",
//         error: error.message,
//       });
//     }
//   };
exports.getRiskProfile = async (req, res) => {
  //#swagger.tags = ['PersonalRisk-Tolerance']
  try {
    const { userId } = req.query;

   
    const riskData = await Risk.find({ userId }).sort({ createdAt: -1 }).limit(1);

    if (!riskData || riskData.length === 0) {
      return res.status(404).json({
        statuscode: "1",
        message: "No risk profile found for this user",
      });
    }

 
    const latestRiskData = riskData[0];
    const riskTotalScore = latestRiskData.totalScore
    if (!riskTotalScore || typeof riskTotalScore !== "number") {
      return res.status(400).json({
        statuscode: "1",
        message: "Invalid risk total score",
      });
    }
     const assetAllocation = assetsAllocationDetails(riskTotalScore)
    res.status(200).json({
      statuscode: "0",
      message: "Data retrieved successfully",
      userId: latestRiskData.userId,
      data: latestRiskData.answers,
      totalScore: riskTotalScore,
      assetAllocationScore: [assetAllocation],
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