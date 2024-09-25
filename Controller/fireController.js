const User = require("../Model/emailModel");
const FireQuestion = require("../Model/fireModel");

function formatNumberWithCommas(number) {
  const numStr = number.toString();
  const [integerPart, decimalPart] = numStr.split(".");

  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart
    .slice(0, -3)
    .replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  const formattedInteger = otherDigits
    ? `${otherDigits},${lastThreeDigits}`
    : lastThreeDigits;

  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

exports.Create = async (req, res) => {
  //#swagger.tags = ['FIRE-Question']
  const {
    userId,
    occupation,
    city,
    age,
    retireage,
    expense,
    inflation,
    monthlysavings,
    retirementsavings,
    prereturn,
    postreturn,
    expectancy,
  } = req.body;

  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found. FireQuestion cannot be created.",
      });
    }

    const fireQuestionData = new FireQuestion({
      userId,
      occupation,
      city,
      age,
      retireage,
      expense,
      inflation,
      monthlysavings,
      retirementsavings,
      prereturn,
      postreturn,
      expectancy,
    });

    await fireQuestionData.save();

    res.status(201).json({
      success: true,
      message: "FireQuestion created successfully",
      fireId: fireQuestionData._id,
      fireQuestionData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating FireQuestion",
      error: error.message,
    });
  }
};

exports.Calculate = async (req, res) => {
  //#swagger.tags = ['FIRE-Question']
  const { fireId } = req.params;

  try {
    const fireQuestionData = await FireQuestion.findById(fireId);

    if (!fireQuestionData) {
      return res.status(404).json({
        success: false,
        message: "FireQuestion not found for the user.",
      });
    }

    const {
      age,
      retireage,
      expense,
      inflation,
      monthlysavings,
      retirementsavings,
      prereturn,
      postreturn,
      expectancy,
    } = fireQuestionData;

    const yearsToRetirement = retireage - age;
    const postRetirementYears = expectancy - retireage;

    const adjustedExpense =
      expense * Math.pow(1 + inflation / 100, yearsToRetirement);
    const targetSavings = adjustedExpense * 12 * postRetirementYears;

    const savingsAtRetirement =
      retirementsavings * Math.pow(1 + prereturn / 100, yearsToRetirement);

    const monthlyRate = prereturn / 100 / 12;
    const monthsToRetirement = yearsToRetirement * 12;

    const accumulatedSavingsFromMonthly =
      monthlysavings *
      ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);

    const totalSavingsAtRetirement =
      savingsAtRetirement + accumulatedSavingsFromMonthly;

    const savingsShortfall = targetSavings - totalSavingsAtRetirement;

    const extraOneTimeSavings = savingsShortfall > 0 ? savingsShortfall : 0;

    const extraMonthlySavings =
      extraOneTimeSavings > 0
        ? (extraOneTimeSavings * (prereturn / 100)) /
          (Math.pow(1 + prereturn / 100, yearsToRetirement) - 1) /
          12
        : 0;

    const results = {
      yearsLeftForRetirement: Math.round(yearsToRetirement),
      monthlyExpensesAfterRetirement: Math.round(adjustedExpense),
      targetedSavings: Math.round(targetSavings),
      totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement),
      accumulatedSavings: Math.round(accumulatedSavingsFromMonthly),
      shortfallInSavings: Math.round(savingsShortfall),
      existingSavingsGrowth: Math.round(savingsAtRetirement),
      extraOneTimeSavingsRequired: Math.round(extraOneTimeSavings),
      extraMonthlySavingsRequired: Math.round(extraMonthlySavings),
    };

    fireQuestionData.yearsLeftForRetirement = results.yearsLeftForRetirement;
    fireQuestionData.monthlyExpensesAfterRetirement =
      results.monthlyExpensesAfterRetirement;
    fireQuestionData.totalSavingsAtRetirement =
      results.totalSavingsAtRetirement;
    fireQuestionData.targetedSavings = results.targetedSavings;
    fireQuestionData.shortfallInSavings = results.shortfallInSavings;
    fireQuestionData.accumulatedSavings = results.accumulatedSavings;
    fireQuestionData.existingSavingsGrowth = results.existingSavingsGrowth;
    fireQuestionData.extraOneTimeSavingsRequired =
      results.extraOneTimeSavingsRequired;
    fireQuestionData.extraMonthlySavingsRequired =
      results.extraMonthlySavingsRequired;

    await fireQuestionData.save();

    res.status(200).json({
      success: true,
      message: "Retirement calculation successful and data saved",
      data: {
        yearsLeftForRetirement: formatNumberWithCommas(
          Math.round(yearsToRetirement)
        ),
        monthlyExpensesAfterRetirement: formatNumberWithCommas(
          Math.round(adjustedExpense)
        ),
        targetedSavings: formatNumberWithCommas(Math.round(targetSavings)),
        totalSavingsAtRetirement: formatNumberWithCommas(
          Math.round(totalSavingsAtRetirement)
        ),
        accumulatedSavings: formatNumberWithCommas(
          Math.round(accumulatedSavingsFromMonthly)
        ),
        shortfallInSavings: formatNumberWithCommas(
          Math.round(savingsShortfall)
        ),
        existingSavingsGrowth: formatNumberWithCommas(
          Math.round(savingsAtRetirement)
        ),
        extraOneTimeSavingsRequired: formatNumberWithCommas(
          Math.round(extraOneTimeSavings)
        ),
        extraMonthlySavingsRequired: formatNumberWithCommas(
          Math.round(extraMonthlySavings)
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating retirement",
      error: error.message,
    });
  }
};
