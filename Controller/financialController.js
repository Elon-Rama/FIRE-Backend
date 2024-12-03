// const FinancialHealth = require('../Model/financialModel');
// const User = require('../Model/emailModel');

// const calculateScore = (score) => {
//     if (score < 26) return 'Poor';
//     if (score < 51) return 'Needs Improvement';
//     if (score < 76) return 'Good';
//     return 'Excellent';
// };

// exports.createFinancialData = async (req, res) => {
//     try {
//         const { userId, monthlyIncome, monthlyExpenses, Savings, debt, Insurance, emergencyFund } = req.body;
    
        
//         const userExists = await User.findById(userId);
//         if (!userExists) {
//           return res.status(400).json({ statusCode: '1', message: 'Invalid UserId' });
//         }
    
        
//         const financialHealthData = {
//           userId,
//           monthlyIncome: monthlyIncome || '0',
//           monthlyExpenses: monthlyExpenses || '0',
//           Savings: Savings || [{ totalSavings: '0', investments: '0' }],
//           debt: debt || [{ monthlyDebtPayments: '0', totalDebtBalance: '0' }],
//           Insurance: Insurance || [{ health: '0', life: '0' }],
//           emergencyFund: emergencyFund || '0',
//         };
    
                                     
//         const newFinancialHealth = new FinancialHealth(financialHealthData);
//         await newFinancialHealth.save();
    
//         return res.status(201).json({
//           statusCode: '0',
//           message: 'Financial health created successfully',
//           userId,
//           data: newFinancialHealth,
//         });
//       } catch (error) {
//         console.error('Error creating financial health:', error);
//         return res.status(500).json({ statusCode: '1', message: 'Internal Server Error' });
//       }
//     };
    

// exports.getFinancialAnalysis = async (req, res) => {
//     try {
//         const { income, expenses, savings, debt, insurance, emergencyFund, investments } = req.body;

//         // Calculations
//         const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
//         const savingsScore = calculateScore(
//             savingsRate < 10 ? 25 : savingsRate < 20 ? 50 : savingsRate < 30 ? 75 : 100
//         );

//         const dti = income > 0 ? (debt.monthlyDebtPayments / income) * 100 : 0;
//         const dtiScore = calculateScore(
//             dti > 50 ? 25 : dti > 30 ? 50 : dti > 10 ? 75 : 100
//         );

//         const emergencyMonths = expenses > 0 ? emergencyFund / expenses : 0;
//         const emergencyScore = calculateScore(
//             emergencyMonths < 1 ? 25 : emergencyMonths < 3 ? 50 : emergencyMonths < 6 ? 75 : 100
//         );

//         const healthCoverage = insurance.healthCover / income;
//         const lifeCoverage = insurance.lifeCover / (income * 12);
//         const insuranceScore = calculateScore(
//             healthCoverage < 5 || lifeCoverage < 10 ? 25 :
//                 healthCoverage < 10 || lifeCoverage < 20 ? 50 : 100
//         );

//         const diversificationScore = calculateScore(
//             investments.length === 0 ? 25 : investments.length < 3 ? 50 : 100
//         );

//         res.status(200).json({
//             success: true,
//             analysis: {
//                 savings: { rate: savingsRate.toFixed(2), score: savingsScore },
//                 debtToIncome: { ratio: dti.toFixed(2), score: dtiScore },
//                 emergencyFund: { months: emergencyMonths.toFixed(2), score: emergencyScore },
//                 insurance: { score: insuranceScore },
//                 investments: { score: diversificationScore }
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

const FinancialHealth = require('../Model/financialModel');
const User = require('../Model/emailModel');

// Helper function to calculate scores
const calculateScores = (data) => {
  const scores = {};

  // Savings Rate
  const savingsRate = ((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome) * 100;
  if (savingsRate < 10) scores.savingsRate = 25;
  else if (savingsRate < 20) scores.savingsRate = 50;
  else if (savingsRate < 30) scores.savingsRate = 75;
  else scores.savingsRate = 100;

  // Debt-to-Income Ratio
  const debtToIncome = (data.monthlyEMI / data.monthlyIncome) * 100;
  if (debtToIncome > 50) scores.debtToIncome = 25;
  else if (debtToIncome > 30) scores.debtToIncome = 50;
  else if (debtToIncome > 10) scores.debtToIncome = 75;
  else scores.debtToIncome = 100;

  // Emergency Fund Adequacy
  const emergencyMonths = data.emergencyFund / data.monthlyExpenses;
  if (emergencyMonths < 1) scores.emergencyFundAdequacy = 25;
  else if (emergencyMonths < 3) scores.emergencyFundAdequacy = 50;
  else if (emergencyMonths < 6) scores.emergencyFundAdequacy = 75;
  else scores.emergencyFundAdequacy = 100;

  // Insurance Coverage
  if (data.insuranceCoverage === 'None') scores.insuranceCoverage = 25;
  else if (data.insuranceCoverage === 'Health' || data.insuranceCoverage === 'Terms') scores.insuranceCoverage = 50;
  else if (data.insuranceCoverage === 'Both') scores.insuranceCoverage = 100;

  // Investment Diversification
  const diversified = data.investments.length;
  if (diversified === 0) scores.investmentDiversification = 25;
  else if (diversified < 3) scores.investmentDiversification = 50;
  else if (diversified < 4) scores.investmentDiversification = 75;
  else scores.investmentDiversification = 100;

  // Overall Score
  scores.overallScore = (
    scores.savingsRate * 0.3 +
    scores.debtToIncome * 0.2 +
    scores.emergencyFundAdequacy * 0.2 +
    scores.insuranceCoverage * 0.15 +
    scores.investmentDiversification * 0.15
  );

  return scores;
};


exports.createFinancialData = async (req, res) => { 
  try {
    const {
      userId,
      monthlyIncome,
      monthlyExpenses,
      totalDebt,
      monthlyEMI,
      insuranceCoverage,
      emergencyFund,
      investments,
    } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ statusCode: '1', message: 'Invalid UserId' });
    }

    const scores = calculateScores({
      monthlyIncome,
      monthlyExpenses,
      totalDebt,
      monthlyEMI,
      insuranceCoverage,
      emergencyFund,
      investments,
    });

    const financialHealth = new FinancialHealth({
      userId,
      monthlyIncome,
      monthlyExpenses,
      totalDebt,
      monthlyEMI,
      insuranceCoverage,
      emergencyFund,
      investments,
      scores,
    });
    await financialHealth.save();

    res.status(201).json({ message: 'Financial Health record created successfully', data: financialHealth });
  } catch (error) {
    res.status(500).json({ message: 'Error creating financial health record', error: error.message });
  }
};



exports.getFinancialAnalysis = async (req, res) => {
  //#swagger.tags = ['Financial-Health']
  try {
    const { userId } = req.params;
    const record = await FinancialHealth.findOne({ userId });

    if (!record) return res.status(404).json({ message: 'Financial Health record not found' });

    res.status(200).json({ data: record });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving financial health record', error: error.message });
  }
};