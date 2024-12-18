const Financial = require("../Model/financialModel");
const User = require("../Model/emailModel");

exports.createFinancialData = async (req, res) => {
  //#swagger.tags = ['Financial-Health']
  try {
    const {
      userId,
      income = 0,
      expenses = 0,
      debtAmount = 0,
      monthlyEmi = 0,
      insurance = "None",
      emergencyFund = 0,
      investments = [],
    } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const financialData = new Financial({
      userId,
      income,
      expenses,
      debtAmount,
      monthlyEmi,
      insurance,
      emergencyFund,
      investments,
    });

    const savedRecord = await financialData.save();

    return res.status(201).json({
      message: "Financial health record created successfully",
      data: savedRecord,
    });
  } catch (error) {
    console.error("Error creating financial record:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserFinancial = async (req, res) => {
  //#swagger.tags = ['Financial-Health']
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await Financial.findOne({ userId });
    if (!userData) {
      return res
        .status(404)
        .json({ error: "Financial data not found for this user" });
    }

    const {
      income = 0,
      expenses = 0,
      debtAmount = 0,
      monthlyEmi = 0,
      emergencyFund = 0,
      insurance = "None",
      investments = [],
    } = userData;

    
let savingsRate = 0;
let savingsScore = { status: "Poor", points: 0 };

// Check if income and expenses are provided and valid
if (income != null && expenses != null && income > 0) {
    savingsRate = ((income - expenses) / income) * 100;

    if (savingsRate < 10) {
        savingsScore = { status: "Needs Improvement", points: 25 };
    } else if (savingsRate >= 10 && savingsRate < 20) {
        savingsScore = { status: "Fair", points: 50 };
    } else if (savingsRate >= 20 && savingsRate < 30) {
        savingsScore = { status: "Good", points: 73 };
    } else {
        savingsScore = { status: "Excellent", points: 100 };
    }
}

// Set the savingsRate value as a string with two decimal places
const savingsRateFormatted = savingsRate.toFixed(2);

    
let debtToIncomeRatio = 0;
let debtScore = { status: "Poor", points: 0 };

// Check if income and monthlyEmi are provided and valid
if (income != null && monthlyEmi != null && income > 0) {
    debtToIncomeRatio = (monthlyEmi / income) * 100;

    if (debtToIncomeRatio > 50) {
        debtScore = { status: "Poor", points: 25 };
    } else if (debtToIncomeRatio >= 30 && debtToIncomeRatio <= 50) {
        debtScore = { status: "Fair", points: 50 };
    } else if (debtToIncomeRatio >= 10 && debtToIncomeRatio < 30) {
        debtScore = { status: "Good", points: 75 };
    } else {
        debtScore = { status: "Excellent", points: 82 };
    }
}

// Set the debtToIncomeRatio value as a string with two decimal places
const debtToIncomeRatioFormatted = debtToIncomeRatio.toFixed(2);


    //calculation for emergency Fund
    const emergencyMonths = expenses ? emergencyFund / expenses : 0;
    let emergencyFundScore = { status: "Poor", points: 0 };
    if (emergencyMonths < 1)
      emergencyFundScore = { status: "Poor", points: 15 };
    else if (emergencyMonths >= 1 && emergencyMonths < 3)
      emergencyFundScore = { status: "Needs Improvement", points: 43 };
    else if (emergencyMonths >= 3 && emergencyMonths < 6)
      emergencyFundScore = { status: "Good", points: 70 };
    else emergencyFundScore = { status: "Excellent", points: 100 };

    //calculation for Insurance coverage
    const hasHealth = insurance.includes("Health");
    const hasTerms = insurance.includes("Terms");
    const hasBoth = insurance.includes("Both");

    let insuranceScore = { status: "Poor", points: 0 };
    if (hasBoth) {
      insuranceScore = { status: "Excellent", points: 100 };
    } else if (hasHealth || hasTerms) {
      insuranceScore = { status: "Fair", points: 50 };
    } else {
      insuranceScore = { status: "Poor", points: 0 };
    }

    //calculation for investments
    const uniqueInvestments = [...new Set(investments)];
    let investmentScore = { status: "Poor", points: 0 };
    if (uniqueInvestments.length < 3)
      investmentScore = { status: "Poor", points: 10 };
    else if (uniqueInvestments.length === 3)
      investmentScore = { status: "Fair", points: 50 };
    else if (uniqueInvestments.length > 3)
      investmentScore = { status: "Excellent", points: 100 };

    // Calculate final score
    const finalScore =
      (savingsScore.points || 0) * 0.3 +
      (debtScore.points || 0) * 0.2 +
      (emergencyFundScore.points || 0) * 0.2 +
      (insuranceScore.points || 0) * 0.15 +
      (investmentScore.points || 0) * 0.15;

    let overallStatus;
    let description;
    if (finalScore >= 81) {
      overallStatus = "Excellent";
      description = "Strong financial position with all metrics in check.";
    } else if (finalScore >= 61) {
      overallStatus = "Good";
      description = "Overall solid financial position.";
    } else if (finalScore >= 41) {
      overallStatus = "Fair";
      description =
        "Needs improvement; some metrics are healthy, others need attention.";
    } else {
      overallStatus = "Poor";
      description = "Financial health is weak; significant attention needed.";
    }
    let improvementRecommendations = [];
    if (savingsScore.points < 50)
      improvementRecommendations.push("Savings Rate");
    if (debtScore.points < 50)
      improvementRecommendations.push("Debt-to-Income Ratio");
    if (emergencyFundScore.points < 50)
      improvementRecommendations.push("Emergency Fund Adequacy");
    if (insuranceScore.points < 50)
      improvementRecommendations.push("Insurance Coverage");
    if (investmentScore.points < 50)
      improvementRecommendations.push("Investment Diversification");

    // Update the user document with the calculated scores
    userData.savingsScore = savingsScore;
    userData.debtScore = debtScore;
    userData.emergencyFundScore = emergencyFundScore;
    userData.insuranceScore = insuranceScore;
    userData.investmentScore = investmentScore;
    userData.finalScore = finalScore;
    userData.overallStatus = overallStatus;
    userData.description = description;

    // Save the updated record
    await userData.save();

    return res.status(200).json({
      message: "Financial health data retrieved successfully",
      data: [ {
        metrics: [
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
            description,
            recommendation:
              improvementRecommendations.join(", ") || "No improvement needed.",
          },
        ],
      }],
    });
  } catch (error) {
    console.error("Error retrieving or updating financial record:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
