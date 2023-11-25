const express = require("express");
const expenseController = require("../Controllers/expenseControllers");
const router = express.Router();

router.get("/:id", expenseController.getExpenses);
router.post("/", expenseController.addExpense);
router.put("/:id", expenseController.editExpense);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
