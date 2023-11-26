const Expense = require("../models/expense");

// Get all expenses of a user
const getExpenses = async (req, res) => {
  try {
    // Get user-specific expenses
    const userId = req.params.userId; // Assuming userId is attached to the request during authentication
    const expenses = await Expense.find({ user: userId }).sort({
      date: "desc",
    });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all expenses irrespective of users
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({
      date: "desc",
    });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get single expense
const getSingleExpense = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is attached to the request during authentication
    const { id } = req.params;

    // Check if the expense belongs to the user
    const expense = await Expense.findOne({ _id: id, user: userId });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addExpense = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is attached to the request during authentication
    const { name, amount, category, description, date } = req.body;

    // Create a new expense
    const newExpense = new Expense({
      user: userId,
      name,
      amount,
      category,
      description,
      date,
    });
    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense added successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editExpense = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is attached to the request during authentication
    const { id } = req.params;
    const { name, amount, category, description, date } = req.body;

    // Check if the expense belongs to the user
    const expense = await Expense.findOne({ _id: id, user: userId });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Update expense details
    expense.name = name;
    expense.amount = amount;
    expense.category = category;
    expense.description = description;
    expense.date = date;

    await expense.save();

    res.json({ message: "Expense updated successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is attached to the request during authentication
    const { id } = req.params;

    // Check if the expense belongs to the user
    const expense = await Expense.findOne({ _id: id, user: userId });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Remove the expense
    await expense.remove();

    res.json({ message: "Expense deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getExpenses,
  getAllExpenses,
  getSingleExpense,
  addExpense,
  editExpense,
  deleteExpense,
};
