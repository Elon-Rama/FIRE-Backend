const FinancialHealth = require('../Model/financialModel');
const User = require('../Model/emailModel');

const calculateScore = (score) => {
    if (score < 26) return 'Poor';
    if (score < 51) return 'Needs Improvement';
    if (score < 76) return 'Good';
    return 'Excellent';
};

exports.createFinancialData = async (req, res) => {
    try {
        const { userId, monthlyIncome, monthlyExpenses, Savings, debt, Insurance, emergencyFund } = req.body;
    
        // Check if the userId exists in the User schema
        const userExists = await User.findById(userId);
        if (!userExists) {
          return res.status(400).json({ statusCode: '1', message: 'Invalid UserId' });
        }
    
        // Prepare the data with default values for missing fields
        const financialHealthData = {
          userId,
          monthlyIncome: monthlyIncome || '0',
          monthlyExpenses: monthlyExpenses || '0',
          Savings: Savings || [{ totalSavings: '0', investments: '0' }],
          debt: debt || [{ monthlyDebtPayments: '0', totalDebtBalance: '0' }],
          Insurance: Insurance || [{ health: '0', life: '0' }],
          emergencyFund: emergencyFund || '0',
        };
    
        // Save the data in the database
        const newFinancialHealth = new FinancialHealth(financialHealthData);
        await newFinancialHealth.save();
    
        return res.status(201).json({
          statusCode: '0',
          message: 'Financial health created successfully',
          userId,
          data: newFinancialHealth,
        });
      } catch (error) {
        console.error('Error creating financial health:', error);
        return res.status(500).json({ statusCode: '1', message: 'Internal Server Error' });
      }
    };
    

exports.getFinancialAnalysis = async (req, res) => {
    try {
        const { income, expenses, savings, debt, insurance, emergencyFund, investments } = req.body;

        // Calculations
        const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
        const savingsScore = calculateScore(
            savingsRate < 10 ? 25 : savingsRate < 20 ? 50 : savingsRate < 30 ? 75 : 100
        );

        const dti = income > 0 ? (debt.monthlyDebtPayments / income) * 100 : 0;
        const dtiScore = calculateScore(
            dti > 50 ? 25 : dti > 30 ? 50 : dti > 10 ? 75 : 100
        );

        const emergencyMonths = expenses > 0 ? emergencyFund / expenses : 0;
        const emergencyScore = calculateScore(
            emergencyMonths < 1 ? 25 : emergencyMonths < 3 ? 50 : emergencyMonths < 6 ? 75 : 100
        );

        const healthCoverage = insurance.healthCover / income;
        const lifeCoverage = insurance.lifeCover / (income * 12);
        const insuranceScore = calculateScore(
            healthCoverage < 5 || lifeCoverage < 10 ? 25 :
                healthCoverage < 10 || lifeCoverage < 20 ? 50 : 100
        );

        const diversificationScore = calculateScore(
            investments.length === 0 ? 25 : investments.length < 3 ? 50 : 100
        );

        res.status(200).json({
            success: true,
            analysis: {
                savings: { rate: savingsRate.toFixed(2), score: savingsScore },
                debtToIncome: { ratio: dti.toFixed(2), score: dtiScore },
                emergencyFund: { months: emergencyMonths.toFixed(2), score: emergencyScore },
                insurance: { score: insuranceScore },
                investments: { score: diversificationScore }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
