// const Financial = require("../Model/financialModel");
// const User = require("../Model/emailModel");

// exports.createFinancialData = async (req, res) => {
//   //#swagger.tags = ['Financial-Health']
//   try {
//     const {
//       userId,
//       income,
//       expenses,
//       debtAmount,
//       monthlyEmi,
//       insurance,
//       emergencyFund,
//       investments,
//     } = req.body;

//     // Validation
//     if (!userId || !income || !expenses || !debtAmount || !monthlyEmi || !insurance || !emergencyFund || !investments) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     if (!Array.isArray(investments) || investments.length === 0) {
//       return res.status(400).json({ message: "Investments should be a non-empty array of strings." });
//     }

//     // Create new financial data
//     const financialData = new Financial({
//       userId,
//       income,
//       expenses,
//       debtAmount,
//       monthlyEmi,
//       insurance,
//       emergencyFund,
//       investments,
//     });

//     await financialData.save();

//     res.status(201).json({
//       message: "Financial data saved successfully",
//       data: financialData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// //   try {
// //     const {
// //       userId,
// //       income,
// //       expenses,
// //       debtAmount,
// //       monthlyEmi,
// //       insurance,
// //       emergencyFund,
// //       investments,
// //     } = req.body;

// //     const userExists = await User.findById(userId);
// //     if (!userExists) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     // Validate required fields
// //     if (!income || !expenses || !debtAmount || !monthlyEmi || !emergencyFund) {
// //       return res.status(400).json({ message: "All fields are required" });
// //     }

// //     const financialData = new Financial({
// //       userId,
// //       income: parseFloat(income) || 0,
// //       expenses: parseFloat(expenses) || 0,
// //       debtAmount: parseFloat(debtAmount) || 0,
// //       monthlyEmi: parseFloat(monthlyEmi) || 0,
// //       insurance: {
// //         Health: insurance?.Health || 0,
// //         Terms: insurance?.Terms || 0,
// //         Both: insurance?.Both || 0,
// //       },
// //       emergencyFund: parseFloat(emergencyFund) || 0,
// //       investments: {
// //         Stocks: investments?.Stocks || 0,
// //         Gold: investments?.Gold || 0,
// //         Bonds: investments?.Bonds || 0,
// //         MutualFund: investments?.MutualFund || 0,
// //         RealEstate: investments?.RealEstate || 0,
// //         Others: investments?.Others || 0,
// //       },
// //     });

// //     await financialData.save();

// //     res.status(201).json({
// //       message: "Financial data saved successfully",
// //       data: financialData,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Internal server error", error });
// //   }
// // };

// exports.getUserFinancial = async (req, res) => {
//   //#swagger.tags = ['Financial-Health']
//   try {
//     const { userId } = req.query;

//     // Fetch user financial data from the database
//     const userFinancialData = await Financial.findOne({ userId });

//     if (!userFinancialData) {
//       return res.status(404).json({ message: "Financial data not found for this user" });
//     }

//     const {
//       income,
//       expenses,
//       monthlyEmi,
//       emergencyFund,
//       insurance,
//       investments,
//     } = userFinancialData;

//     // Validate required fields
//     if (!income || !expenses || !monthlyEmi || !emergencyFund) {
//       return res.status(400).json({
//         message: "Income, expenses, EMI, or emergency fund data is missing",
//       });
//     }

//     // Parse values to ensure they are numbers
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

//     // Helper function to calculate points and status
//     const calculateMetric = (value, thresholds, pointRanges) => {
//       for (let i = thresholds.length - 1; i >= 0; i--) {
//         if (value >= thresholds[i]) {
//           return {
//             status: pointRanges[i].status,
//             points: Math.floor(
//               Math.random() * (pointRanges[i].max - pointRanges[i].min + 1)
//             ) + pointRanges[i].min,
//           };
//         }
//       }
//       return {
//         status: pointRanges[0].status,
//         points: Math.floor(Math.random() * pointRanges[0].min),
//       };
//     };

//     // Calculate Savings Rate
//     const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
//     const savingsMetrics = calculateMetric(savingsRate, [30, 20, 10], [
//       { status: "Poor", min: 0, max: 25 },
//       { status: "Needs Improvement", min: 26, max: 50 },
//       { status: "Good", min: 51, max: 75 },
//       { status: "Excellent", min: 76, max: 100 },
//     ]);

//     // Calculate Debt-to-Income Ratio (DTI)
//     const dti = (monthlyDebtPayments / monthlyIncome) * 100;
//     const dtiMetrics = calculateMetric(dti, [10, 30, 50], [
//       { status: "Excellent", min: 76, max: 100 },
//       { status: "Good", min: 51, max: 75 },
//       { status: "Needs Improvement", min: 26, max: 50 },
//       { status: "Poor", min: 0, max: 25 },
//     ]);

//     // Calculate Emergency Fund Adequacy
//     const emergencyMonths = totalEmergencyFund / monthlyExpenses;
//     const emergencyMetrics = calculateMetric(emergencyMonths, [6, 3, 1], [
//       { status: "Excellent", min: 76, max: 100 },
//       { status: "Good", min: 51, max: 75 },
//       { status: "Needs Improvement", min: 26, max: 50 },
//       { status: "Poor", min: 0, max: 25 },
//     ]);

//     // Calculate Insurance Coverage
//     const annualIncome = monthlyIncome * 12;
//     const healthInsuranceCoverage = parseFloat(insurance?.Health || 0);
//     const lifeInsuranceCoverage = parseFloat(insurance?.Terms || 0);

//     const isAdequateHealthInsurance =
//       healthInsuranceCoverage >= monthlyIncome * 5 &&
//       healthInsuranceCoverage <= monthlyIncome * 10;

//     const isAdequateLifeInsurance =
//       lifeInsuranceCoverage >= annualIncome * 10 &&
//       lifeInsuranceCoverage <= annualIncome * 20;

//     const insuranceStatus = !healthInsuranceCoverage && !lifeInsuranceCoverage
//       ? "Poor"
//       : !isAdequateHealthInsurance || !isAdequateLifeInsurance
//       ? "Needs Improvement"
//       : "Excellent";

//     const insurancePoints = insuranceStatus === "Poor"
//       ? Math.floor(Math.random() * 26)
//       : insuranceStatus === "Needs Improvement"
//       ? Math.floor(Math.random() * 25) + 26
//       : Math.floor(Math.random() * 25) + 76;

//     // Calculate Investment Diversification
//     const diversifiedCount = investments
//       ? Object.values(investments).filter((value) => value > 0).length
//       : 0;

//     const diversificationMetrics = calculateMetric(diversifiedCount, [4, 3], [
//       { status: "Excellent", min: 76, max: 100 },
//       { status: "Good", min: 51, max: 75 },
//       { status: "Needs Improvement", min: 26, max: 50 },
//       { status: "Poor", min: 0, max: 25 },
//     ]);

//     // Calculate overall score with appropriate scaling
//     const overallScore = (
//       (savingsMetrics.points * 0.25) +
//       (dtiMetrics.points * 0.20) +
//       (emergencyMetrics.points * 0.20) +
//       (insurancePoints * 0.15) +
//       (diversificationMetrics.points * 0.20)
//     ).toFixed(2);

//     // Determine overall status based on the score
//     let overallStatus = "";
//     if (overallScore >= 81) {
//       overallStatus = "Excellent";
//     } else if (overallScore >= 61) {
//       overallStatus = "Good";
//     } else if (overallScore >= 41) {
//       overallStatus = "Fair";
//     } else {
//       overallStatus = "Poor";
//     }

//     // Prepare response data
//     const response = [
//       {
//         metric: "Savings Rate",
//         value: savingsRate.toFixed(2),
//         status: savingsMetrics.status,
//         points: savingsMetrics.points,
//       },
//       {
//         metric: "Debt-to-Income Ratio",
//         value: dti.toFixed(2),
//         status: dtiMetrics.status,
//         points: dtiMetrics.points,
//       },
//       {
//         metric: "Emergency Fund Adequacy",
//         value: emergencyMonths.toFixed(2),
//         status: emergencyMetrics.status,
//         points: emergencyMetrics.points,
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
//         status: diversificationMetrics.status,
//         points: diversificationMetrics.points,
//       },
//       {
//         metric: "Overall Score",
//         value: overallScore,
//         status: overallStatus,
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





// // exports.getUserFinancial = async (req, res) => {
// //   //#swagger.tags = ['Financial-Health']
// //   try {
// //     const { userId } = req.query;

// //     // Validate the userId
    // if (!userId) {
    //   return res.status(400).json({ message: "User ID is required" });
    // }

// //     // Fetch financial data from the database
// //     const userFinancialData = await Financial.findOne({ userId });
// //     if (!userFinancialData) {
// //       return res.status(404).json({ message: "Financial data not found for this user" });
// //     }

// //     const {
// //       income,
// //       expenses,
// //       monthlyEmi,
// //       emergencyFund,
// //       healthInsurance,
// //       lifeInsurance,
// //       investments,
// //     } = userFinancialData;

// //     // Validate required financial fields
// //     if (!income || !expenses || !monthlyEmi || !emergencyFund) {
// //       return res.status(400).json({
// //         message: "Income, expenses, EMI, and emergency fund data are required",
// //       });
// //     }

// //     const monthlyIncome = parseFloat(income);
// //     const monthlyExpenses = parseFloat(expenses);
// //     const monthlyDebtPayments = parseFloat(monthlyEmi);
// //     const totalEmergencyFund = parseFloat(emergencyFund);

// //     // Validate numeric data
// //     if (
// //       isNaN(monthlyIncome) ||
// //       isNaN(monthlyExpenses) ||
// //       isNaN(monthlyDebtPayments) ||
// //       isNaN(totalEmergencyFund)
// //     ) {
// //       return res.status(400).json({
// //         message: "Income, expenses, EMI, or emergency fund must be valid numbers",
// //       });
// //     }

// //     // Calculations and Analysis
// //     const calculatePoints = (status, range) => Math.floor(Math.random() * range) + status;

// //     // Savings Rate
// //     const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
// //     const savings = [
// //       { threshold: 30, status: "Excellent", range: 25, start: 76 },
// //       { threshold: 20, status: "Good", range: 25, start: 51 },
// //       { threshold: 10, status: "Needs Improvement", range: 25, start: 26 },
// //       { threshold: 0, status: "Poor", range: 25, start: 0 },
// //     ].find(({ threshold }) => savingsRate >= threshold);
// //     const savingsStatus = savings?.status || "Poor";
// //     const savingsPoints = calculatePoints(savings?.start || 0, savings?.range || 25);

// //     // Debt-to-Income Ratio (DTI)
// //     const dti = (monthlyDebtPayments / monthlyIncome) * 100;
// //     const debt = [
// //       { threshold: 10, status: "Excellent", range: 25, start: 76 },
// //       { threshold: 30, status: "Good", range: 25, start: 51 },
// //       { threshold: 50, status: "Needs Improvement", range: 25, start: 26 },
// //       { threshold: 100, status: "Poor", range: 25, start: 0 },
// //     ].find(({ threshold }) => dti < threshold);
// //     const dtiStatus = debt?.status || "Poor";
// //     const dtiPoints = calculatePoints(debt?.start || 0, debt?.range || 25);

// //     // Emergency Fund Adequacy
// //     const emergencyMonths = totalEmergencyFund / monthlyExpenses;
// //     const emergency = [
// //       { threshold: 6, status: "Excellent", range: 25, start: 76 },
// //       { threshold: 3, status: "Good", range: 25, start: 51 },
// //       { threshold: 1, status: "Needs Improvement", range: 25, start: 26 },
// //       { threshold: 0, status: "Poor", range: 25, start: 0 },
// //     ].find(({ threshold }) => emergencyMonths >= threshold);
// //     const emergencyStatus = emergency?.status || "Poor";
// //     const emergencyPoints = calculatePoints(emergency?.start || 0, emergency?.range || 25);

// //     // Insurance Coverage
// //     const annualIncome = monthlyIncome * 12;
// //     const healthInsuranceCoverage = parseFloat(healthInsurance || 0);
// //     const lifeInsuranceCoverage = parseFloat(lifeInsurance || 0);
// //     const isAdequateHealthInsurance =
// //       healthInsuranceCoverage >= monthlyIncome * 5 && healthInsuranceCoverage <= monthlyIncome * 10;
// //     const isAdequateLifeInsurance =
// //       lifeInsuranceCoverage >= annualIncome * 10 && lifeInsuranceCoverage <= annualIncome * 20;

// //     const insuranceStatus =
// //       !healthInsuranceCoverage && !lifeInsuranceCoverage
// //         ? "Poor"
// //         : isAdequateHealthInsurance && isAdequateLifeInsurance
// //         ? "Excellent"
// //         : "Needs Improvement";
// //     const insurancePoints = calculatePoints(
// //       insuranceStatus === "Excellent" ? 76 : 26,
// //       insuranceStatus === "Excellent" ? 25 : 25
// //     );

// //     // Investment Diversification
// //     const diversificationStatus =
// //       investments?.length > 4
// //         ? "Excellent"
// //         : investments?.length === 4
// //         ? "Good"
// //         : investments?.length === 3
// //         ? "Needs Improvement"
// //         : "Poor";
// //     const diversificationPoints = calculatePoints(
// //       diversificationStatus === "Excellent" ? 76 : 26,
// //       diversificationStatus === "Excellent" ? 25 : 25
// //     );

// //     // Save scores and statuses in the database
// //     userFinancialData.scores = [ {
// //       savingsRate: { value: savingsRate.toFixed(2), status: savingsStatus, points: savingsPoints },
// //       debtToIncomeRatio: { value: dti.toFixed(2), status: dtiStatus, points: dtiPoints },
// //       emergencyFund: { value: emergencyMonths.toFixed(2), status: emergencyStatus, points: emergencyPoints },
// //       insuranceCoverage: { healthInsuranceCoverage, lifeInsuranceCoverage, status: insuranceStatus, points: insurancePoints },
// //       investmentDiversification: { status: diversificationStatus, points: diversificationPoints },
// //     }];


// // const weights = {
// //   savingsRate: 0.3,
// //   debtToIncomeRatio: 0.2,
// //   emergencyFund: 0.2,
// //   insuranceCoverage: 0.15,
// //   investmentDiversification: 0.15,
// // };

// // // Calculate the overall score
// // const overallScore =
// //   (savingsPoints * weights.savingsRate) +
// //   (dtiPoints * weights.debtToIncomeRatio) +
// //   (emergencyPoints * weights.emergencyFund) +
// //   (insurancePoints * weights.insuranceCoverage) +
// //   (diversificationPoints * weights.investmentDiversification);

// // // Categorize the overall score
// // let category, description;
// // if (overallScore <= 40) {
// //   category = "Poor";
// //   description = "Financial distress; immediate changes needed.";
// // } else if (overallScore <= 60) {
// //   category = "Fair";
// //   description = "Needs improvement; some metrics are healthy, others need attention.";
// // } else if (overallScore <= 80) {
// //   category = "Good";
// //   description = "Financially stable with room to improve.";
// // } else {
// //   category = "Excellent";
// //   description = "Strong financial position with all metrics in check.";
// // }

// // // Save the overall score and category to the database
// // userFinancialData.overallScore = overallScore.toFixed(2);
// // userFinancialData.category = category;
// // userFinancialData.description = description;

// // await userFinancialData.save();

// // // Send the response
// // res.status(200).json({
// //   message: "Data analyzed and saved successfully",
// //   data: [ {
// //     scores: userFinancialData.scores,
// //     overallScore: userFinancialData.overallScore,
// //     category: userFinancialData.category,
// //     description: userFinancialData.description,
// //   }],
// // });
  
// // } catch (error) {
// //   console.error(error);
// //   res.status(500).json({ message: "Internal server error", error });
// // }
// // };

const Financial = require("../Model/financialModel");
const User = require("../Model/emailModel"); // Assuming you have a User schema for validation

// POST API for creating financial data
exports.createFinancialData = async (req, res) => {
  //#swagger.tags = ['Financial-Health']
  const { userId, income, expenses, debtAmount, monthlyEmi, insurance, emergencyFund, investments } = req.body;

  try {
    // Validate user ID
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Check if financial data already exists for the given userId
    const existingData = await Financial.findOne({ userId });
    if (existingData) {
      return res.status(400).json({ message: 'Financial data already exists for this user' });
    }

    // Create a new financial data entry
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
    res.status(201).json({ message: 'Financial data created successfully', data: newFinancialData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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
      return res.status(404).json({ error: 'Financial data not found for this user' });
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
    if (savingsRate < 10) savingsScore = { status: 'Needs Improvement', points: 25 };
    else if (savingsRate >= 10 && savingsRate < 20) savingsScore = { status: 'Fair', points: 50 };
    else if (savingsRate >= 20 && savingsRate < 30) savingsScore = { status: 'Good', points: 73 };
    else savingsScore = { status: 'Excellent', points: 100 };

    const debtToIncomeRatio = (monthlyEmi / income) * 100;
    let debtScore;
    if (debtToIncomeRatio > 50) debtScore = { status: 'Poor', points: 25 };
    else if (debtToIncomeRatio >= 30 && debtToIncomeRatio <= 50) debtScore = { status: 'Fair', points: 50 };
    else if (debtToIncomeRatio >= 10 && debtToIncomeRatio < 30) debtScore = { status: 'Good', points: 75 };
    else debtScore = { status: 'Excellent', points: 82 };

    const emergencyMonths = emergencyFund / expenses;
    let emergencyFundScore;
    if (emergencyMonths < 1) emergencyFundScore = { status: 'Poor', points: 15 };
    else if (emergencyMonths >= 1 && emergencyMonths < 3) emergencyFundScore = { status: 'Needs Improvement', points: 43 };
    else if (emergencyMonths >= 3 && emergencyMonths < 6) emergencyFundScore = { status: 'Good', points: 70 };
    else emergencyFundScore = { status: 'Excellent', points: 100 };

    let insuranceScore;
    if (insurance === 'None') insuranceScore = { status: 'Poor', points: 9 };
    else if (insurance === 'Health' || insurance === 'Terms') insuranceScore = { status: 'Fair', points: 50 };
    else if (insurance === 'Both') insuranceScore = { status: 'Excellent', points: 100 };

    const uniqueInvestments = [...new Set(investments)];
    let investmentScore;
    if (uniqueInvestments.length < 3) investmentScore = { status: 'Poor', points: 10 };
    else if (uniqueInvestments.length === 3) investmentScore = { status: 'Fair', points: 50 };
    else if (uniqueInvestments.length > 3) investmentScore = { status: 'Excellent', points: 100 };

    // Calculate final score
    const finalScore = (
      (savingsScore.points * 0.3) +
      (debtScore.points * 0.2) +
      (emergencyFundScore.points * 0.2) +
      (insuranceScore.points * 0.15) +
      (investmentScore.points * 0.15)
    );

    let overallStatus;
    if (finalScore >= 81) overallStatus = 'Excellent';
    else if (finalScore >= 61) overallStatus = 'Good';
    else if (finalScore >= 41) overallStatus = 'Fair';
    else overallStatus = 'Poor';

    // Create the response format
    const response = {
      message: "Data retrieved successfully",
      data: [
        {
          metric: "Savings Rate",
          value: savingsRate.toFixed(2),
          status: savingsScore.status,
          points: savingsScore.points
        },
        {
          metric: "Debt-to-Income Ratio",
          value: debtToIncomeRatio.toFixed(2),
          status: debtScore.status,
          points: debtScore.points
        },
        {
          metric: "Emergency Fund Adequacy",
          value: emergencyMonths.toFixed(2),
          status: emergencyFundScore.status,
          points: emergencyFundScore.points
        },
        {
          metric: "Insurance Coverage",
          healthInsurance: insurance === 'Health' ? 1 : 0,
          lifeInsurance: insurance === 'Life' ? 1 : 0,
          status: insuranceScore.status,
          points: insuranceScore.points
        },
        {
          metric: "Investment Diversification",
          status: investmentScore.status,
          points: investmentScore.points
        },
        {
          metric: "Overall Score",
          value: finalScore.toFixed(2),
          status: overallStatus
        }
      ]
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
