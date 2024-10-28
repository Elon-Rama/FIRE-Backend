const User = require("../../Model/emailModel");
const Profile = require("../../Model/userModel");
const nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const ExpensesMaster = require("../../Model/expensesModel");
const ExpensesAllocation = require("../../Model/ExpensesAllocation");
const ChildExpenses = require("../../Model/ChildExpensesModel");
const RealityExpenses = require("../../Model/Reality/ExpensesRealityModel");

const cryptr = new Cryptr(process.env.JWT_SECRET);

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.Signin = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email } = req.body;

  if (!email) {
    return res.status(200).json({ error: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(200).json({ error: "Invalid email format" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        userId: new mongoose.Types.ObjectId(),
        loggedIn: false,
      });
    }

    if (user.loggedIn) {
      return res.status(200).json({ error: "User is already logged in" });
    }

    const otp = generateOTP();
    const encryptedOtp = cryptr.encrypt(otp);

    user.otp = encryptedOtp;
    user.loggedIn = false;
    await user.save();

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(200).json({ error: "Failed to send OTP email" });
      } else {
        res.status(201).json({
          success: true,
          message: "OTP sent to email",
          userId: user.userId,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({ error: "Failed to sign in" });
  }
};

// exports.verifyOTP = async (req, res) => {
//   //#swagger.tags = ['Login-User']
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({ error: "Email and OTP are required" });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (user.loggedIn) {
//       return res.status(400).json({ error: "User is already logged in" });
//     }

//     const decryptedOtp = cryptr.decrypt(user.otp);
//     if (decryptedOtp !== otp) {
//       return res.status(400).json({ error: "Invalid OTP" });
//     }

//     const sessionId = uuidv4();
//     const sessionExpiresAt = Date.now() + 59 * 60 * 1000; // 59 minutes
//     const token = generateToken(user.email, user._id);

//     user.loggedIn = true;
//     user.otp = null;
//     user.token = token;
//     user.sessionId = sessionId;
//     user.sessionExpiresAt = sessionExpiresAt;
//     await user.save();

//     const existingExpenses = await ExpensesMaster.findOne({ userId: user._id });

//     if (!existingExpenses) {
//       const defaultExpenses = [
//         { title: "Housing", active: true, userId: user._id },
//         { title: "Entertainment", active: true, userId: user._id },
//         { title: "Transportation", active: true, userId: user._id },
//         { title: "Loans", active: true, userId: user._id },
//         { title: "Insurance", active: true, userId: user._id },
//       ];

//       const createdMasterExpenses = await ExpensesMaster.insertMany(
//         defaultExpenses
//       );

//       const subcategoriesMapping = [
//         {
//           title: "Housing",
//           expensesId: createdMasterExpenses[0]._id,
//           category: ["Rent", "Mortgage", "Utilities", "Phone", "Gas"],
//           active: true,
//           userId: user._id,
//         },
//         {
//           title: "Entertainment",
//           expensesId: createdMasterExpenses[1]._id,
//           category: ["Movies", "Music", "Events"],
//           active: true,
//           userId: user._id,
//         },
//         {
//           title: "Transportation",
//           expensesId: createdMasterExpenses[2]._id,
//           category: ["Car", "Fuel", "Public Transport"],
//           active: true,
//           userId: user._id,
//         },
//         {
//           title: "Loans",
//           expensesId: createdMasterExpenses[3]._id,
//           category: ["Personal Loan", "Car Loan", "Student Loan"],
//           active: true,
//           userId: user._id,
//         },
//         {
//           title: "Insurance",
//           expensesId: createdMasterExpenses[4]._id,
//           category: ["Health Insurance", "Car Insurance", "Life Insurance"],
//           active: true,
//           userId: user._id,
//         },
//       ];

//       await ChildExpenses.insertMany(subcategoriesMapping);

//       const currentMonth = new Date().toLocaleString("default", {
//         month: "long",
//       });
//       const currentYear = new Date().getFullYear();

//       const expensesMaster = await ExpensesMaster.find({ userId: user._id });

//       if (expensesMaster.length) {
//         const expensesTitles = expensesMaster.map((expense) => ({
//           title: expense.title,
//           active: expense.active,
//           amount: 0,
//         }));

//         const newExpensesAllocation = new ExpensesAllocation({
//           userId: user._id,
//           month: currentMonth,
//           year: currentYear,
//           titles: expensesTitles,
//         });

//         await newExpensesAllocation.save();
//       }
//     }

//     const existingRealityExpenses = await RealityExpenses.findOne({ userId: user._id });
//     if (!existingRealityExpenses) {
//       const realityExpensesTitles = [
//         { title: "Housing", subCategory: [{ name: "Rent", amount: 0 }] },
//         { title: "Entertainment", subCategory: [{ name: "Movies", amount: 0 }] },
//         { title: "Transportation", subCategory: [{ name: "Fuel", amount: 0 }] },
//         { title: "Loans", subCategory: [{ name: "Car Loan", amount: 0 }] },
//         { title: "Insurance", subCategory: [{ name: "Health Insurance", amount: 0 }] },
//       ];

//       const newRealityExpenses = new RealityExpenses({
//         userId: user._id,
//         month: currentMonth,
//         year: currentYear,
//         titles: realityExpensesTitles,
//         totalExpenses: 0,
//         active: true,
//       });

//       await newRealityExpenses.save();
//     }

//     const userProfile = await Profile.findOne({ userId: user._id });

//     res.status(201).json({
//       success: true,
//       message: "OTP is valid, user logged in, and default expenses created",
//       token,
//       sessionId,
//       sessionExpiresAt,
//       loggedIn: user.loggedIn,
//       userId: user._id,
//       userProfile: !!userProfile,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to verify OTP" });
//   }
// };

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.loggedIn) {
      return res.status(400).json({ error: "User is already logged in" });
    }

    const decryptedOtp = cryptr.decrypt(user.otp);
    if (decryptedOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const sessionId = uuidv4();
    const sessionExpiresAt = Date.now() + 59 * 60 * 1000; // 59 minutes
    const token = generateToken(user.email, user._id);

    user.loggedIn = true;
    user.otp = null;
    user.token = token;
    user.sessionId = sessionId;
    user.sessionExpiresAt = sessionExpiresAt;
    await user.save();

    const existingExpenses = await ExpensesMaster.findOne({ userId: user._id });

    if (!existingExpenses) {
      const defaultExpenses = [
        { title: "Housing", active: true, userId: user._id },
        { title: "Entertainment", active: true, userId: user._id },
        { title: "Transportation", active: true, userId: user._id },
        { title: "Loans", active: true, userId: user._id },
        { title: "Insurance", active: true, userId: user._id },
      ];

      const createdMasterExpenses = await ExpensesMaster.insertMany(defaultExpenses);

      const subcategoriesMapping = [
        {
          title: "Housing",
          expensesId: createdMasterExpenses[0]._id,
          category: ["Rent", "Mortgage", "Utilities", "Phone", "Gas"],
          active: true,
          userId: user._id,
        },
        {
          title: "Entertainment",
          expensesId: createdMasterExpenses[1]._id,
          category: ["Movies", "Music", "Events"],
          active: true,
          userId: user._id,
        },
        {
          title: "Transportation",
          expensesId: createdMasterExpenses[2]._id,
          category: ["Car", "Fuel", "Public Transport"],
          active: true,
          userId: user._id,
        },
        {
          title: "Loans",
          expensesId: createdMasterExpenses[3]._id,
          category: ["Personal Loan", "Car Loan", "Student Loan"],
          active: true,
          userId: user._id,
        },
        {
          title: "Insurance",
          expensesId: createdMasterExpenses[4]._id,
          category: ["Health Insurance", "Car Insurance", "Life Insurance"],
          active: true,
          userId: user._id,
        },
      ];

      await ChildExpenses.insertMany(subcategoriesMapping);
    }

    // Define the current month and year
    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    const currentYear = new Date().getFullYear();

    const expensesMaster = await ExpensesMaster.find({ userId: user._id });

    if (expensesMaster.length) {
      const expensesTitles = expensesMaster.map((expense) => ({
        title: expense.title,
        active: expense.active,
        amount: 0,
      }));

      const newExpensesAllocation = new ExpensesAllocation({
        userId: user._id,
        month: currentMonth,
        year: currentYear,
        titles: expensesTitles,
      });

      await newExpensesAllocation.save();
    }

    const existingRealityExpenses = await RealityExpenses.findOne({ userId: user._id });
    if (!existingRealityExpenses) {
      const realityExpensesTitles = [
        {
          title: "Housing",
          subCategory: [{ name: "Rent", amount: 0 }],
        },
        {
          title: "Entertainment",
          subCategory: [
            { name: "Movies", amount: 500 },  // Adjust default amounts as needed
            { name: "Music", amount: 1000 },
            { name: "Events", amount: 500 },
          ],
        },
        {
          title: "Transportation",
          subCategory: [{ name: "Fuel", amount: 0 }],
        },
        {
          title: "Loans",
          subCategory: [{ name: "Personal Loan", amount: 0 }],
        },
        {
          title: "Insurance",
          subCategory: [{ name: "Health Insurance", amount: 0 }],
        },
      ];

      const newRealityExpenses = new RealityExpenses({
        userId: user._id,
        month: currentMonth,
        year: currentYear,
        titles: realityExpensesTitles,
        totalExpenses: 0,
        active: true,
      });

      await newRealityExpenses.save();
    }

    const userProfile = await Profile.findOne({ userId: user._id });

    res.status(201).json({
      success: true,
      message: "OTP is valid, user logged in, and default expenses created",
      token,
      sessionId,
      sessionExpiresAt,
      loggedIn: user.loggedIn,
      userId: user._id,
      userProfile: !!userProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};


exports.checkSession = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(200).json({ error: "Session ID is required" });
  }

  try {
    const user = await User.findOne({ sessionId });

    if (!user) {
      return res.status(200).json({ error: "Invalid session ID" });
    }

    if (Date.now() > user.sessionExpiresAt) {
      user.loggedIn = false;
      user.sessionId = null;
      await user.save();
      return res.status(200).json({
        error: "Session has expired. Please log in again.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Session is active",
      sessionExpiresIn: user.sessionExpiresAt - Date.now(),
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      error: "Failed to check session",
    });
  }
};

exports.refreshToken = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = generateToken(decoded.email, decoded.userId);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.Validate = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(200).json({ error: "Email and token are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== email) {
      return res.status(200).json({ error: "Invalid token or email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    res.status(201).json({ success: true, message: "Valid email and token" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const user = await User.findOne({ email });

      if (user) {
        user.loggedIn = false;
        await user.save();
        return res
          .status(200)
          .json({ error: "Token expired. User has been logged out." });
      }
    } else {
      console.error(err);
      return res.status(200).json({ error: "Invalid token or email" });
    }
  }
};

exports.logout = async (req, res) => {
  //#swagger.tags = ['Login-User']
  const { userId } = req.body;

  if (!userId) {
    return res.status(200).json({ error: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    user.loggedIn = false;
    user.sessionId = null;
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(200).json({ error: "Failed to log out" });
  }
};
