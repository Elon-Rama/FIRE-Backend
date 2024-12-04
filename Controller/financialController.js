const Financial = require("../Model/financialModel");
const User = require("../Model/emailModel");

exports.createFinancialData = async (req, res) => {
  //#swagger.tags = ['Financial-Health']
  try {
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

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const financialData = {
      userId,
      income: income || "0",
      expenses: expenses || "0",
      debtAmount: debtAmount || "0",
      monthlyEmi: monthlyEmi || "0",
      insurance: {
        Health: insurance?.Health || "0",
        Terms: insurance?.Terms || "0",
        Both: insurance?.Both || "0",
      },
      emergencyFund: emergencyFund || "0",
      investments: {
        Stocks: investments?.Stocks || "0",
        Gold: investments?.Gold || "0",
        Bonds: investments?.Bonds || "0",
        MutualFund: investments?.MutualFund || "0",
        RealEstate: investments?.RealEstate || "0",
        Others: investments?.Others || "0",
      },
    };

    const financialEntry = new Financial(financialData);
    await financialEntry.save();

    res.status(201).json({
      message: "Financial data saved successfully",
      data: financialEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// exports.getUserFinancial = async (req, res) => {
//   //#swagger.tags = ['Financial-Health']
//   try {
//     const { userId } = req.query;

//     const userFinancialData = await Financial.findOne({ userId });

//     if (!userFinancialData) {
//       return res
//         .status(404)
//         .json({ message: "Financial data not found for this user" });
//     }

//     const { 
//       income, 
//       expenses, 
//       monthlyEmi, 
//       emergencyFund, 
//       healthInsurance, 
//       lifeInsurance, 
//       investments 
//     } = userFinancialData;

//     if (!income || !expenses || !monthlyEmi || !emergencyFund) {
//       return res.status(400).json({
//         message: "Income, expenses, EMI, or emergency fund data missing",
//       });
//     }

//     const monthlyIncome = parseFloat(income);
//     const monthlyExpenses = parseFloat(expenses);
//     const monthlyDebtPayments = parseFloat(monthlyEmi);
//     const totalEmergencyFund = parseFloat(emergencyFund);

//     if (
//       isNaN(monthlyIncome) ||
//       isNaN(monthlyExpenses) ||
//       isNaN(monthlyDebtPayments) ||
//       isNaN(totalEmergencyFund)
//     ) {
//       return res.status(400).json({
//         message: "Income, expenses, EMI, or emergency fund must be valid numbers",
//       });
//     }

//     // Calculate Savings Rate
//     const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;

//     let savingsStatus = "";
//     let savingsPoints = 0;

//     if (savingsRate < 10) {
//       savingsStatus = "Poor";
//       savingsPoints = Math.floor(Math.random() * 26); // 0-25
//     } else if (savingsRate >= 10 && savingsRate < 20) {
//       savingsStatus = "Needs Improvement";
//       savingsPoints = Math.floor(Math.random() * 25) + 26; // 26-50
//     } else if (savingsRate >= 20 && savingsRate < 30) {
//       savingsStatus = "Good";
//       savingsPoints = Math.floor(Math.random() * 25) + 51; // 51-75
//     } else if (savingsRate >= 30) {
//       savingsStatus = "Excellent";
//       savingsPoints = Math.floor(Math.random() * 25) + 76; // 76-100
//     }

//     // Calculate Debt-to-Income Ratio (DTI)
//     const dti = (monthlyDebtPayments / monthlyIncome) * 100;

//     let dtiStatus = "";
//     let dtiPoints = 0;

//     if (dti >= 50) {
//       dtiStatus = "Poor";
//       dtiPoints = Math.floor(Math.random() * 26); // 0-25
//     } else if (dti >= 30 && dti < 50) {
//       dtiStatus = "Needs Improvement";
//       dtiPoints = Math.floor(Math.random() * 25) + 26; // 26-50
//     } else if (dti >= 10 && dti < 30) {
//       dtiStatus = "Good";
//       dtiPoints = Math.floor(Math.random() * 25) + 51; // 51-75
//     } else if (dti < 10) {
//       dtiStatus = "Excellent";
//       dtiPoints = Math.floor(Math.random() * 25) + 76; // 76-100
//     }

//     // Calculate Emergency Fund Adequacy
//     const emergencyMonths = totalEmergencyFund / monthlyExpenses;

//     let emergencyStatus = "";
//     let emergencyPoints = 0;

//     if (emergencyMonths < 1) {
//       emergencyStatus = "Poor";
//       emergencyPoints = Math.floor(Math.random() * 26); // 0-25
//     } else if (emergencyMonths >= 1 && emergencyMonths < 3) {
//       emergencyStatus = "Needs Improvement";
//       emergencyPoints = Math.floor(Math.random() * 25) + 26; // 26-50
//     } else if (emergencyMonths >= 3 && emergencyMonths < 6) {
//       emergencyStatus = "Good";
//       emergencyPoints = Math.floor(Math.random() * 25) + 51; // 51-75
//     } else if (emergencyMonths >= 6) {
//       emergencyStatus = "Excellent";
//       emergencyPoints = Math.floor(Math.random() * 25) + 76; // 76-100
//     }

//     // Calculate Insurance Coverage
//     const annualIncome = monthlyIncome * 12;
//     const healthInsuranceCoverage = parseFloat(healthInsurance || 0);
//     const lifeInsuranceCoverage = parseFloat(lifeInsurance || 0);

//     let insuranceStatus = "";
//     let insurancePoints = 0;

//     const isAdequateHealthInsurance =
//       healthInsuranceCoverage >= monthlyIncome * 5 && healthInsuranceCoverage <= monthlyIncome * 10;

//     const isAdequateLifeInsurance =
//       lifeInsuranceCoverage >= annualIncome * 10 && lifeInsuranceCoverage <= annualIncome * 20;

//     if (!healthInsuranceCoverage && !lifeInsuranceCoverage) {
//       insuranceStatus = "Poor";
//       insurancePoints = Math.floor(Math.random() * 26); // 0-25
//     } else if (!isAdequateHealthInsurance || !isAdequateLifeInsurance) {
//       insuranceStatus = "Needs Improvement";
//       insurancePoints = Math.floor(Math.random() * 25) + 26; // 26-50
//     } else if (isAdequateHealthInsurance && isAdequateLifeInsurance) {
//       insuranceStatus = "Good";
//       insurancePoints = Math.floor(Math.random() * 25) + 51; // 51-75
//     } else if (
//       isAdequateHealthInsurance &&
//       isAdequateLifeInsurance &&
//       healthInsuranceCoverage > monthlyIncome * 10 &&
//       lifeInsuranceCoverage > annualIncome * 20
//     ) {
//       insuranceStatus = "Excellent";
//       insurancePoints = Math.floor(Math.random() * 25) + 76; // 76-100
//     }

//     // Calculate Investment Diversification
//     let diversificationStatus = "";
//     let diversificationPoints = 0;

//     if (investments && Array.isArray(investments)) {
//       const uniqueAssets = new Set(investments);
//       const diversifiedCount = uniqueAssets.size;

//       if (diversifiedCount < 3) {
//         diversificationStatus = "Poor";
//         diversificationPoints = Math.floor(Math.random() * 26); // 0-25
//       } else if (diversifiedCount === 3) {
//         diversificationStatus = "Needs Improvement";
//         diversificationPoints = Math.floor(Math.random() * 25) + 26; // 26-50
//       } else if (diversifiedCount === 4) {
//         diversificationStatus = "Good";
//         diversificationPoints = Math.floor(Math.random() * 25) + 51; // 51-75
//       } else if (diversifiedCount > 4) {
//         diversificationStatus = "Excellent";
//         diversificationPoints = Math.floor(Math.random() * 25) + 76; // 76-100
//       }
//     } else {
//       diversificationStatus = "Poor";
//       diversificationPoints = Math.floor(Math.random() * 26); // 0-25
//     }

//     // Response as an array
//     const response = [
//       {
//         metric: "Savings Rate",
//         value: savingsRate.toFixed(2),
//         status: savingsStatus,
//         points: savingsPoints,
//       },
//       {
//         metric: "Debt-to-Income Ratio",
//         value: dti.toFixed(2),
//         status: dtiStatus,
//         points: dtiPoints,
//       },
//       {
//         metric: "Emergency Fund Adequacy",
//         value: emergencyMonths.toFixed(2),
//         status: emergencyStatus,
//         points: emergencyPoints,
//       },
//       {
//         metric: "Insurance Coverage",
//         healthInsurance: healthInsuranceCoverage,
//         lifeInsurance: lifeInsuranceCoverage,
//         status: insuranceStatus,
//         points: insurancePoints,
//       },
//       {
//         metric: "Investment Diversification",
//         status: diversificationStatus,
//         points: diversificationPoints,
//       },
//     ];

//     res.status(200).json({
//       message: "Data retrieved successfully",
//       data: response,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };

exports.getUserFinancial = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch financial data from the database
    const userFinancialData = await Financial.findOne({ userId });
    if (!userFinancialData) {
      return res.status(404).json({ message: "Financial data not found for this user" });
    }

    const {
      income,
      expenses,
      monthlyEmi,
      emergencyFund,
      healthInsurance,
      lifeInsurance,
      investments,
      scores: existingScores,
      overallScore: existingOverallScore,
    } = userFinancialData;

    // Validate required financial fields
    if (!income || !expenses || !monthlyEmi || !emergencyFund) {
      return res.status(400).json({
        message: "Income, expenses, EMI, and emergency fund data are required",
      });
    }

    const monthlyIncome = parseFloat(income);
    const monthlyExpenses = parseFloat(expenses);
    const monthlyDebtPayments = parseFloat(monthlyEmi);
    const totalEmergencyFund = parseFloat(emergencyFund);

    if (
      isNaN(monthlyIncome) ||
      isNaN(monthlyExpenses) ||
      isNaN(monthlyDebtPayments) ||
      isNaN(totalEmergencyFund)
    ) {
      return res.status(400).json({
        message: "Income, expenses, EMI, or emergency fund must be valid numbers",
      });
    }

    // Calculate metrics (deterministic)
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    const dti = (monthlyDebtPayments / monthlyIncome) * 100;
    const emergencyMonths = totalEmergencyFund / monthlyExpenses;
    const annualIncome = monthlyIncome * 12;
    const healthInsuranceCoverage = parseFloat(healthInsurance || 0);
    const lifeInsuranceCoverage = parseFloat(lifeInsurance || 0);
    const isAdequateHealthInsurance =
      healthInsuranceCoverage >= monthlyIncome * 5 &&
      healthInsuranceCoverage <= monthlyIncome * 10;
    const isAdequateLifeInsurance =
      lifeInsuranceCoverage >= annualIncome * 10 &&
      lifeInsuranceCoverage <= annualIncome * 20;

    const investmentsCount = investments?.length || 0;

    // Create a deterministic scoring mechanism
    const calculateScore = (value, thresholds) =>
      thresholds.reduce((score, { threshold, points }) => (value >= threshold ? points : score), 0);

    const savingsPoints = calculateScore(savingsRate, [
      { threshold: 30, points: 100 },
      { threshold: 20, points: 75 },
      { threshold: 10, points: 50 },
      { threshold: 0, points: 25 },
    ]);

    const dtiPoints = calculateScore(dti, [
      { threshold: 10, points: 100 },
      { threshold: 30, points: 75 },
      { threshold: 50, points: 50 },
      { threshold: 100, points: 25 },
    ]);

    const emergencyPoints = calculateScore(emergencyMonths, [
      { threshold: 6, points: 100 },
      { threshold: 3, points: 75 },
      { threshold: 1, points: 50 },
      { threshold: 0, points: 25 },
    ]);

    const insurancePoints = calculateScore(
      isAdequateHealthInsurance && isAdequateLifeInsurance ? 1 : 0,
      [{ threshold: 1, points: 100 }]
    );

    const diversificationPoints = calculateScore(investmentsCount, [
      { threshold: 4, points: 100 },
      { threshold: 3, points: 75 },
      { threshold: 2, points: 50 },
      { threshold: 0, points: 25 },
    ]);

    const weights = {
      savingsRate: 0.3,
      debtToIncomeRatio: 0.2,
      emergencyFund: 0.2,
      insuranceCoverage: 0.15,
      investmentDiversification: 0.15,
    };

    const overallScore =
      savingsPoints * weights.savingsRate +
      dtiPoints * weights.debtToIncomeRatio +
      emergencyPoints * weights.emergencyFund +
      insurancePoints * weights.insuranceCoverage +
      diversificationPoints * weights.investmentDiversification;

    // Categorize the overall score
    let category, description;
    if (overallScore <= 40) {
      category = "Poor";
      description = "Financial distress; immediate changes needed.";
    } else if (overallScore <= 60) {
      category = "Fair";
      description = "Needs improvement; some metrics are healthy, others need attention.";
    } else if (overallScore <= 80) {
      category = "Good";
      description = "Financially stable with room to improve.";
    } else {
      category = "Excellent";
      description = "Strong financial position with all metrics in check.";
    }

    // Compare with existing data
    if (
      existingOverallScore === overallScore &&
      JSON.stringify(existingScores) === JSON.stringify([
        {
          savingsRate: { value: savingsRate.toFixed(2), points: savingsPoints },
          dti: { value: dti.toFixed(2), points: dtiPoints },
          emergencyFund: { value: emergencyMonths.toFixed(2), points: emergencyPoints },
          insuranceCoverage: { points: insurancePoints },
          investmentDiversification: { points: diversificationPoints },
        },
      ])
    ) {
      return res.status(200).json({
        message: "No changes detected; returning existing data",
        data: {
          scores: existingScores,
          overallScore: existingOverallScore,
          category: userFinancialData.category,
          description: userFinancialData.description,
        },
      });
    }

    // Save the updated data if changes are detected
    userFinancialData.scores = [
      {
        savingsRate: { value: savingsRate.toFixed(2), points: savingsPoints },
        dti: { value: dti.toFixed(2), points: dtiPoints },
        emergencyFund: { value: emergencyMonths.toFixed(2), points: emergencyPoints },
        insuranceCoverage: { points: insurancePoints },
        investmentDiversification: { points: diversificationPoints },
      },
    ];
    userFinancialData.overallScore = overallScore.toFixed(2);
    userFinancialData.category = category;
    userFinancialData.description = description;

    await userFinancialData.save();

    res.status(200).json({
      message: "Data analyzed and saved successfully",
      data: {
        scores: userFinancialData.scores,
        overallScore: userFinancialData.overallScore,
        category: userFinancialData.category,
        description: userFinancialData.description,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

