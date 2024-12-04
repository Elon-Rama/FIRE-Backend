// riskController.js
const PersonalRisk = require('../Model/riskModel');
const User = require('../Model/emailModel');


exports.saveRiskProfile = async (req, res) => {
     //#swagger.tags = ['PersonalRisk-Tolerance]
    try {
        const { userId, answers } = req.body;

        const userExists = await User.findById(userId);
        if (!userExists) {
          return res.status(404).json({ message: "User not found" });
        }

        if (!userId || !answers || answers.length !== 7) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Assign points based on answers
        const pointsMap = { a: 1, b: 2, c: 3, d: 4 };
        let totalScore = 0;

        const processedAnswers = answers.map((item, index) => {
            const points = pointsMap[item.answer.toLowerCase()] || 0;
            totalScore += points;
            return {
                question: `Question ${index + 1}`,
                answer: item.answer,
                points,
            };
        });

        // Determine risk profile based on total score
        let riskProfile = '';
        if (totalScore <= 10) riskProfile = 'Conservative Risk Profile (Low risk tolerance)';
        else if (totalScore <= 15) riskProfile = 'Moderate Conservative Risk Profile';
        else if (totalScore <= 20) riskProfile = 'Balanced Risk Profile';
        else if (totalScore <= 25) riskProfile = 'Aggressive Risk Profile';
        else riskProfile = 'Very Aggressive Risk Profile (High risk tolerance)';

        // Save to database
        const riskData = new PersonalRisk({ userId, answers: processedAnswers, totalScore, riskProfile });
        await riskData.save();

        res.status(201).json({ message: 'Risk profile saved successfully', riskData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getRiskProfile = async (req, res) => {
    //#swagger.tags = ['PersonalRisk-Tolerance]
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const riskData = await Risk.findOne({ userId });
        if (!riskData) {
            return res.status(404).json({ message: 'Risk profile not found' });
        }

        res.status(200).json({ riskData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


