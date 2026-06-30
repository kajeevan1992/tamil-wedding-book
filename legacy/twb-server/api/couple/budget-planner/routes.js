const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../../services/auth_service")

router.get('/load/:coupleId',
    [auth.requireLogin, auth.onlyCouple],
    controller.loadBudgetPlanner
);

// router.get('/load-category/:coupleId/:categoryId',
//     [auth.requireLogin, auth.onlyCouple],
//     controller.loadBudgetPlannerCategory
// );

router.post('/create-update-category',
    [auth.requireLogin, auth.onlyCouple],
    controller.createUpdateCategory
);

router.delete('/delete-category/:categoryId',
    [auth.requireLogin, auth.onlyCouple],
    controller.deleteCategory
);

router.post('/create-update-expense',
    [auth.requireLogin, auth.onlyCouple],
    controller.createUpdateExpense
);

router.delete('/delete-expense/:expenseId',
    [auth.requireLogin, auth.onlyCouple],
    controller.deleteExpense
);

router.post('/create-update-expense-payment',
    [auth.requireLogin, auth.onlyCouple],
    controller.createUpdateExpensePayment
)
router.delete('/delete-expense-payment/:paymentId',
    [auth.requireLogin, auth.onlyCouple],
    controller.deleteExpensePayment
);

module.exports = router;