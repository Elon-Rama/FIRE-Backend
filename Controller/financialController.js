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
  //#swagger.tags = ['Financial-Health']
  try {
    const { userId } = req.query;

    // Validate the userId
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

    // Validate numeric data
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

    // Calculations and Analysis
    const calculatePoints = (status, range) => Math.floor(Math.random() * range) + status;

    // Savings Rate
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    const savings = [
      { threshold: 30, status: "Excellent", range: 25, start: 76 },
      { threshold: 20, status: "Good", range: 25, start: 51 },
      { threshold: 10, status: "Needs Improvement", range: 25, start: 26 },
      { threshold: 0, status: "Poor", range: 25, start: 0 },
    ].find(({ threshold }) => savingsRate >= threshold);
    const savingsStatus = savings?.status || "Poor";
    const savingsPoints = calculatePoints(savings?.start || 0, savings?.range || 25);

    // Debt-to-Income Ratio (DTI)
    const dti = (monthlyDebtPayments / monthlyIncome) * 100;
    const debt = [
      { threshold: 10, status: "Excellent", range: 25, start: 76 },
      { threshold: 30, status: "Good", range: 25, start: 51 },
      { threshold: 50, status: "Needs Improvement", range: 25, start: 26 },
      { threshold: 100, status: "Poor", range: 25, start: 0 },
    ].find(({ threshold }) => dti < threshold);
    const dtiStatus = debt?.status || "Poor";
    const dtiPoints = calculatePoints(debt?.start || 0, debt?.range || 25);

    // Emergency Fund Adequacy
    const emergencyMonths = totalEmergencyFund / monthlyExpenses;
    const emergency = [
      { threshold: 6, status: "Excellent", range: 25, start: 76 },
      { threshold: 3, status: "Good", range: 25, start: 51 },
      { threshold: 1, status: "Needs Improvement", range: 25, start: 26 },
      { threshold: 0, status: "Poor", range: 25, start: 0 },
    ].find(({ threshold }) => emergencyMonths >= threshold);
    const emergencyStatus = emergency?.status || "Poor";
    const emergencyPoints = calculatePoints(emergency?.start || 0, emergency?.range || 25);

    // Insurance Coverage
    const annualIncome = monthlyIncome * 12;
    const healthInsuranceCoverage = parseFloat(healthInsurance || 0);
    const lifeInsuranceCoverage = parseFloat(lifeInsurance || 0);
    const isAdequateHealthInsurance =
      healthInsuranceCoverage >= monthlyIncome * 5 && healthInsuranceCoverage <= monthlyIncome * 10;
    const isAdequateLifeInsurance =
      lifeInsuranceCoverage >= annualIncome * 10 && lifeInsuranceCoverage <= annualIncome * 20;

    const insuranceStatus =
      !healthInsuranceCoverage && !lifeInsuranceCoverage
        ? "Poor"
        : isAdequateHealthInsurance && isAdequateLifeInsurance
        ? "Excellent"
        : "Needs Improvement";
    const insurancePoints = calculatePoints(
      insuranceStatus === "Excellent" ? 76 : 26,
      insuranceStatus === "Excellent" ? 25 : 25
    );

    // Investment Diversification
    const diversificationStatus =
      investments?.length > 4
        ? "Excellent"
        : investments?.length === 4
        ? "Good"
        : investments?.length === 3
        ? "Needs Improvement"
        : "Poor";
    const diversificationPoints = calculatePoints(
      diversificationStatus === "Excellent" ? 76 : 26,
      diversificationStatus === "Excellent" ? 25 : 25
    );

    // Save scores and statuses in the database
    userFinancialData.scores = [ {
      savingsRate: { value: savingsRate.toFixed(2), status: savingsStatus, points: savingsPoints },
      debtToIncomeRatio: { value: dti.toFixed(2), status: dtiStatus, points: dtiPoints },
      emergencyFund: { value: emergencyMonths.toFixed(2), status: emergencyStatus, points: emergencyPoints },
      insuranceCoverage: { healthInsuranceCoverage, lifeInsuranceCoverage, status: insuranceStatus, points: insurancePoints },
      investmentDiversification: { status: diversificationStatus, points: diversificationPoints },
    }];


const weights = {
  savingsRate: 0.3,
  debtToIncomeRatio: 0.2,
  emergencyFund: 0.2,
  insuranceCoverage: 0.15,
  investmentDiversification: 0.15,
};

// Calculate the overall score
const overallScore =
  (savingsPoints * weights.savingsRate) +
  (dtiPoints * weights.debtToIncomeRatio) +
  (emergencyPoints * weights.emergencyFund) +
  (insurancePoints * weights.insuranceCoverage) +
  (diversificationPoints * weights.investmentDiversification);

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

// Save the overall score and category to the database
userFinancialData.overallScore = overallScore.toFixed(2);
userFinancialData.category = category;
userFinancialData.description = description;

await userFinancialData.save();

// Send the response
res.status(200).json({
  message: "Data analyzed and saved successfully",
  data: [ {
    scores: userFinancialData.scores,
    overallScore: userFinancialData.overallScore,
    category: userFinancialData.category,
    description: userFinancialData.description,
  }],
});
  
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Internal server error", error });
}
};

