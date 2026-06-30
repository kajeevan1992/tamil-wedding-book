const models = require("../../../models");
const Validator = require('validatorjs');
const commonUtil = require('../../../utilities/common');
const dotenv = require('dotenv');
dotenv.config();

const loadBudgetPlanner = async (req, res) => {
    try {
        const budgetPlanner = await models.CoupleBudgetPlanner.findOne({
            where: { coupleId: req.params.coupleId },
            order: [
                ['budgetPlannerCategories', 'id', 'ASC']
            ],
            include: {
                model: models.CoupleBudgetPlannerCategory,
                as: 'budgetPlannerCategories',
                // order: [['id', 'ASC']],
                include: {
                    model: models.CoupleBudgetPlannerCategoryExpense,
                    as: 'categoryExpenses',
                    include: {
                        model: models.CoupleBudgetPlannerExpensePayment,
                        as: 'payments',
                        order: [['createdAt', 'ASC']]
                    }
                }
            }
        });

        return res.status(200).json({ budgetPlanner });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

// const loadBudgetPlannerCategory = async (req, res) => {
//     try {
//         const budgetPlanner = await models.CoupleBudgetPlanner.findOne({
//             where: { coupleId: req.params.coupleId },
//         });
//         if (!budgetPlanner) {
//             return res.status(404).json({
//                 message: 'Budget planner not found'
//             });
//         }

//         const budgetPlannerCategory = await models.CoupleBudgetPlannerCategory.findOne({
//             where: {
//                 coupleBudgetPlannerId: budgetPlanner.id,
//                 id: req.params.categoryId
//             },
//             order: [
//                 ['categoryExpenses', 'createdAt', 'ASC'],
//             ],
//             include: {
//                 model: models.CoupleBudgetPlannerCategoryExpense,
//                 as: 'categoryExpenses',
//                 include: {
//                     model: models.CoupleBudgetPlannerExpensePayment,
//                     as: 'payments',
//                     order: [['createdAt', 'ASC']]
//                 }
//             }
//         });

//         if (!budgetPlannerCategory) {
//             return res.status(404).json({
//                 message: 'Budget planner category not found'
//             });
//         }

//         return res.status(200).json({ budgetPlannerCategory });
//     } catch (error) {
//         console.log(error)
//         return res.status(501).json({
//             message: 'Something went wrong, please try again',
//         });
//     }
// }

const createUpdateCategory = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'coupleBudgetPlannerId': 'required',
            'action': 'required|in:add,edit',
            'id': 'required_if:action,edit',
            'name': 'required|max:100',
            'icon': 'required|max:30',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        if (req.body.action === 'add') {
            let data = {
                coupleBudgetPlannerId: req.body.coupleBudgetPlannerId,
                name: req.body.name,
                icon: req.body.icon,
            };
            item = await models.CoupleBudgetPlannerCategory.create(data);
        } else {
            item = await models.CoupleBudgetPlannerCategory.findByPk(req.body.id);
            item.name = req.body.name;
            item.icon = req.body.icon;
            await item.save();
        }

        return res.status(200).json({
            message: `Category ${req.body.action === 'add' ? 'created' : 'updated'} successfully`,
            item: item,
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const deleteCategory = async (req, res) => {
    try {
        if (!req.params.categoryId) {
            return res.status(422).json({
                message: 'Some data are missing, please try again',
            });
        }

        await models.CoupleBudgetPlannerCategory.destroy({ where: { id: req.params.categoryId } });

        return res.status(200).json({
            message: 'Category deleted successfully',
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const createUpdateExpense = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'name': 'required|max:100',
            'estimatedCost': 'required|numeric|min:0',
            'finalCost': 'required|numeric|min:0',
            'note': 'max:250',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        let item = null;
        if (!req.body.id) {
            let data = {
                coupleBudgetPlannerCategoryId: req.body.coupleBudgetPlannerCategoryId,
                name: req.body.name,
                estimatedCost: req.body.estimatedCost,
                finalCost: req.body.finalCost,
                note: req.body.note,
            };
            item = await models.CoupleBudgetPlannerCategoryExpense.create(data);
        } else {
            item = await models.CoupleBudgetPlannerCategoryExpense.findByPk(req.body.id);
            item.name = req.body.name;
            item.estimatedCost = req.body.estimatedCost;
            item.finalCost = req.body.finalCost;
            item.note = req.body.note;
            await item.save();
        }

        if (item) {
            return res.status(200).json({
                message: `Expense ${!req.body.id ? 'created' : 'updated'} successfully`,
                expense: item,
            });
        } else {
            return res.status(501).json({
                message: 'Something went wrong, please try again',
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const deleteExpense = async (req, res) => {
    try {
        if (!req.params.expenseId) {
            return res.status(422).json({
                message: 'Some data are missing, please try again',
            });
        }

        await models.CoupleBudgetPlannerCategoryExpense.destroy({ where: { id: req.params.expenseId } });

        return res.status(200).json({
            message: 'Expense deleted successfully',
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const createUpdateExpensePayment = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'expenseId': 'required',
            'action': 'required|in:add,edit',
            'id': 'required_if:action,edit',
            'amount': 'required|numeric|min:1|max:1000000000',
            'paid': 'required|boolean',
            'paymentDate': 'required_if:paid,true|date',
            'dueDate': 'required_if:paid,false|date',
            'paidBy': 'string|max:30',
            'paymentMethod': 'string|max:50',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        if (req.body.action === 'add') {
            const data = {
                expenseId: req.body.expenseId,
                amount: commonUtil.convertToNumber(req.body.amount),
                paid: req.body.paid,
                paymentDate: req.body.paymentDate != '' ? req.body.paymentDate : null,
                dueDate: req.body.dueDate != '' ? req.body.dueDate : null,
                paidBy: req.body.paidBy,
                paymentMethod: req.body.paymentMethod,
            }
            item = await models.CoupleBudgetPlannerExpensePayment.create(data);
        } else {
            item = await models.CoupleBudgetPlannerExpensePayment.findByPk(req.body.id);
            item.amount = commonUtil.convertToNumber(req.body.amount);
            item.paid = req.body.paid;
            item.paymentDate = req.body.paymentDate != '' ? req.body.paymentDate : null;
            item.dueDate = req.body.dueDate != '' ? req.body.dueDate : null;
            item.paidBy = req.body.paidBy;
            item.paymentMethod = req.body.paymentMethod;
            await item.save();
        }

        return res.status(200).json({
            message: `Payment ${req.body.action === 'add' ? 'created' : 'updated'} successfully`,
            payment: item,
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const deleteExpensePayment = async (req, res) => {
    try {
        if (!req.params.paymentId) {
            return res.status(422).json({
                message: 'Some data are missing, please try again',
            });
        }

        await models.CoupleBudgetPlannerExpensePayment.destroy({ where: { id: req.params.paymentId } });

        return res.status(200).json({
            message: 'Payment deleted successfully',
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = {
    loadBudgetPlanner,
    // loadBudgetPlannerCategory,
    createUpdateCategory,
    deleteCategory,
    createUpdateExpense,
    deleteExpense,
    createUpdateExpensePayment,
    deleteExpensePayment
}