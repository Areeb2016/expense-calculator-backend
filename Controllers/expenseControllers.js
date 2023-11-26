const Expense = require("../models/expense");

const getExpenses = async (req, res) => {
  try {
    const userId = req.params.id;
    const expenses = await Expense.find({ user: userId }).sort({
      date: "desc",
    });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

const getSingleExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

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
    const { user, name, amount, category, description, date } = req.body;

    const newExpense = new Expense({
      user: user,
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
    const { id } = req.params;
    const { user, name, amount, category, description, date } = req.body;

    const expense = await Expense.findOne({ _id: id, user: user });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

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
    const user = req.body.user;
    const id = req.params.id;

    const expense = await Expense.findOne({ _id: id, user: user });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne({ _id: id });

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
