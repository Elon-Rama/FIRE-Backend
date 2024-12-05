const Financial = require("../Model/financialModel");
const User = require("../Model/emailModel");

exports.createFinancialData = async (req, res) => {
  const {
    userId,
    income,
    expenses,
    debtAmount,
    monthlyEmi,
    insurance,
    emergencyFund,
    investments,
  } = req.body;

  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const existingData = await Financial.findOne({ userId });
    if (existingData) {
      return res
        .status(400)
        .json({ message: "Financial data already exists for this user" });
    }

    const newFinancialData = new Financial({
      userId,
      income,
      expenses,
      debtAmount,
      monthlyEmi,
      insurance,
      emergencyFund,
      investments,
    });

    await newFinancialData.save();
    res
      .status(201)
      .json({
        message: "Financial data created successfully",
        data: newFinancialData,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// exports.getUserFinancial = async (req, res) => {
//   //#swagger.tags = ['Financial-Health']
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     const userData = await Financial.findOne({ userId });
//     if (!userData) {
//       return res
//         .status(404)
//         .json({ error: "Financial data not found for this user" });
//     }

//     // Extract data for calculations
//     const income = userData.income;
//     const expenses = userData.expenses;
//     const debtAmount = userData.debtAmount;
//     const monthlyEmi = userData.monthlyEmi;
//     const emergencyFund = userData.emergencyFund;
//     const insurance = userData.insurance;
//     const investments = userData.investments;

//     // Calculate individual scores
//     const savingsRate = ((income - expenses) / income) * 100;
//     let savingsScore;
//     if (savingsRate < 10)
//       savingsScore = { status: "Needs Improvement", points: 25 };
//     else if (savingsRate >= 10 && savingsRate < 20)
//       savingsScore = { status: "Fair", points: 50 };
//     else if (savingsRate >= 20 && savingsRate < 30)
//       savingsScore = { status: "Good", points: 73 };
//     else savingsScore = { status: "Excellent", points: 100 };

//     const debtToIncomeRatio = (monthlyEmi / income) * 100;
//     let debtScore;
//     if (debtToIncomeRatio > 50) debtScore = { status: "Poor", points: 25 };
//     else if (debtToIncomeRatio >= 30 && debtToIncomeRatio <= 50)
//       debtScore = { status: "Fair", points: 50 };
//     else if (debtToIncomeRatio >= 10 && debtToIncomeRatio < 30)
//       debtScore = { status: "Good", points: 75 };
//     else debtScore = { status: "Excellent", points: 82 };

//     const emergencyMonths = emergencyFund / expenses;
//     let emergencyFundScore;
//     if (emergencyMonths < 1)
//       emergencyFundScore = { status: "Poor", points: 15 };
//     else if (emergencyMonths >= 1 && emergencyMonths < 3)
//       emergencyFundScore = { status: "Needs Improvement", points: 43 };
//     else if (emergencyMonths >= 3 && emergencyMonths < 6)
//       emergencyFundScore = { status: "Good", points: 70 };
//     else emergencyFundScore = { status: "Excellent", points: 100 };

//     let insuranceScore;
//     if (insurance === "None") insuranceScore = { status: "Poor", points: 9 };
//     else if (insurance === "Health" || insurance === "Terms")
//       insuranceScore = { status: "Fair", points: 50 };
//     else if (insurance === "Both")
//       insuranceScore = { status: "Excellent", points: 100 };

//     const uniqueInvestments = [...new Set(investments)];
//     let investmentScore;
//     if (uniqueInvestments.length < 3)
//       investmentScore = { status: "Poor", points: 10 };
//     else if (uniqueInvestments.length === 3)
//       investmentScore = { status: "Fair", points: 50 };
//     else if (uniqueInvestments.length > 3)
//       investmentScore = { status: "Excellent", points: 100 };

//     /// Calculate final score
//     const finalScore =
//       savingsScore.points * 0.3 +
//       debtScore.points * 0.2 +
//       emergencyFundScore.points * 0.2 +
//       insuranceScore.points * 0.15 +
//       investmentScore.points * 0.15;

//     let overallStatus;
//     let description;
//     if (finalScore >= 81) {
//       overallStatus = "Excellent";
//       description = "Strong financial position with all metrics in check.";
//     } else if (finalScore >= 61) {
//       overallStatus = "Good";
//       description = "Financially stable with room to improve.";
//     } else if (finalScore >= 41) {
//       overallStatus = "Fair";
//       description =
//         "Needs improvement; some metrics are healthy, others need attention.";
//     } else {
//       overallStatus = "Poor";
//       description = "Financial distress; immediate changes needed.";
//     }

//     // Suggest improvements if the status is low
//     let improvementRecommendation;
//     if (overallStatus === "Poor" || overallStatus === "Fair") {
//       if (savingsScore.points < 50) improvementRecommendation = "Improve savings rate.";
//       else if (debtScore.points < 50) improvementRecommendation = "Reduce debt-to-income ratio.";
//       else if (emergencyFundScore.points < 50) improvementRecommendation = "Increase emergency fund.";
//       else if (insuranceScore.points < 50) improvementRecommendation = "Improve insurance coverage.";
//       else if (investmentScore.points < 50) improvementRecommendation = "Diversify investments.";
//     }

//     // Create the response format
//     const response = {
//       message: "Data retrieved successfully",
//       data: [
//         {
//           metric: "Savings Rate",
//           value: savingsRate.toFixed(2),
//           status: savingsScore.status,
//           points: savingsScore.points,
//         },
//         {
//           metric: "Debt-to-Income Ratio",
//           value: debtToIncomeRatio.toFixed(2),
//           status: debtScore.status,
//           points: debtScore.points,
//         },
//         {
//           metric: "Emergency Fund Adequacy",
//           value: emergencyMonths.toFixed(2),
//           status: emergencyFundScore.status,
//           points: emergencyFundScore.points,
//         },
//         {
//           metric: "Insurance Coverage",
//           healthInsurance: insurance === "Health" ? 1 : 0,
//           lifeInsurance: insurance === "Life" ? 1 : 0,
//           status: insuranceScore.status,
//           points: insuranceScore.points,
//         },
//         {
//           metric: "Investment Diversification",
//           status: investmentScore.status,
//           points: investmentScore.points,
//         },
//         {
//           metric: "Overall Score",
//           value: finalScore.toFixed(2),
//           status: overallStatus,
//           description: description,
//           points: finalScore.toFixed(0), 
//           recommendation: improvementRecommendation || "No improvement needed.",
//         },
//         // {
//         //   metric: "Improvement Recommendation",
//         //   recommendation: improvementRecommendation || "No improvement needed.",
//         // }
//       ],
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
exports.getUserFinancial = async (req, res) => {
  //#swagger.tags = ['Financial-Health']
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await Financial.findOne({ userId });
    if (!userData) {
      return res.status(404).json({ error: "Financial data not found for this user" });
    }

    // Extract data for calculations
    const income = userData.income;
    const expenses = userData.expenses;
    const debtAmount = userData.debtAmount;
    const monthlyEmi = userData.monthlyEmi;
    const emergencyFund = userData.emergencyFund;
    const insurance = userData.insurance;
    const investments = userData.investments;

    // Calculate individual scores
    const savingsRate = ((income - expenses) / income) * 100;
    let savingsScore;
    if (savingsRate < 10)
      savingsScore = { status: "Needs Improvement", points: 25 };
    else if (savingsRate >= 10 && savingsRate < 20)
      savingsScore = { status: "Fair", points: 50 };
    else if (savingsRate >= 20 && savingsRate < 30)
      savingsScore = { status: "Good", points: 73 };
    else savingsScore = { status: "Excellent", points: 100 };

    const debtToIncomeRatio = (monthlyEmi / income) * 100;
    let debtScore;
    if (debtToIncomeRatio > 50) debtScore = { status: "Poor", points: 25 };
    else if (debtToIncomeRatio >= 30 && debtToIncomeRatio <= 50)
      debtScore = { status: "Fair", points: 50 };
    else if (debtToIncomeRatio >= 10 && debtToIncomeRatio < 30)
      debtScore = { status: "Good", points: 75 };
    else debtScore = { status: "Excellent", points: 82 };

    const emergencyMonths = emergencyFund / expenses;
    let emergencyFundScore;
    if (emergencyMonths < 1)
      emergencyFundScore = { status: "Poor", points: 15 };
    else if (emergencyMonths >= 1 && emergencyMonths < 3)
      emergencyFundScore = { status: "Needs Improvement", points: 43 };
    else if (emergencyMonths >= 3 && emergencyMonths < 6)
      emergencyFundScore = { status: "Good", points: 70 };
    else emergencyFundScore = { status: "Excellent", points: 100 };

    let insuranceScore;
    if (insurance === "None") insuranceScore = { status: "Poor", points: 9 };
    else if (insurance === "Health" || insurance === "Terms")
      insuranceScore = { status: "Fair", points: 50 };
    else if (insurance === "Both")
      insuranceScore = { status: "Excellent", points: 100 };

    const uniqueInvestments = [...new Set(investments)];
    let investmentScore;
    if (uniqueInvestments.length < 3)
      investmentScore = { status: "Poor", points: 10 };
    else if (uniqueInvestments.length === 3)
      investmentScore = { status: "Fair", points: 50 };
    else if (uniqueInvestments.length > 3)
      investmentScore = { status: "Excellent", points: 100 };

    /// Calculate final score
    const finalScore =
      savingsScore.points * 0.3 +
      debtScore.points * 0.2 +
      emergencyFundScore.points * 0.2 +
      insuranceScore.points * 0.15 +
      investmentScore.points * 0.15;

    let overallStatus;
    let description;
    if (finalScore >= 81) {
      overallStatus = "Excellent";
      description = "Strong financial position with all metrics in check.";
    } else if (finalScore >= 61) {
      overallStatus = "Good";
      description = "Financially stable with room to improve.";
    } else if (finalScore >= 41) {
      overallStatus = "Fair";
      description = "Needs improvement; some metrics are healthy, others need attention.";
    } else {
      overallStatus = "Poor";
      description = "Financial distress; immediate changes needed.";
    }

    // Collect all weak metrics for detailed recommendations
    let improvementRecommendations = [];
    if (savingsScore.points < 50) improvementRecommendations.push("Savings Rate");
    if (debtScore.points < 50) improvementRecommendations.push("Debt-to-Income Ratio");
    if (emergencyFundScore.points < 50) improvementRecommendations.push("Emergency Fund Adequacy");
    if (insuranceScore.points < 50) improvementRecommendations.push("Insurance Coverage");
    if (investmentScore.points < 50) improvementRecommendations.push("Investment Diversification");

    // Create the response format
    const response = {
      message: "Data retrieved successfully",
      data: [
        {
          metric: "Savings Rate",
          value: savingsRate.toFixed(2),
          status: savingsScore.status,
          points: savingsScore.points,
        },
        {
          metric: "Debt-to-Income Ratio",
          value: debtToIncomeRatio.toFixed(2),
          status: debtScore.status,
          points: debtScore.points,
        },
        {
          metric: "Emergency Fund Adequacy",
          value: emergencyMonths.toFixed(2),
          status: emergencyFundScore.status,
          points: emergencyFundScore.points,
        },
        {
          metric: "Insurance Coverage",
          healthInsurance: insurance === "Health" ? 1 : 0,
          lifeInsurance: insurance === "Life" ? 1 : 0,
          status: insuranceScore.status,
          points: insuranceScore.points,
        },
        {
          metric: "Investment Diversification",
          status: investmentScore.status,
          points: investmentScore.points,
        },
        {
          metric: "Overall Score",
          value: finalScore.toFixed(2),
          status: overallStatus,
          description: description,
          points: finalScore.toFixed(0),
          recommendation: improvementRecommendations.length > 0
            ? `Improve the following areas: ${improvementRecommendations.join(", ")}`
            : "No improvement needed.",
        }
      ],
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

