const models = require("../../../models");
const Validator = require('validatorjs');

const loadChecklists = async (req, res) => {
    try {
        const [
            checklists,
            checklistCategories,
            checklistFilters,
            coupleBudgetPlanner
        ] = await Promise.all([
            models.Checklist.findAll({
                where: { coupleId: req.params.coupleId },
                include: [
                    {
                        model: models.ChecklistCategory,
                        as: 'checklistCategory',
                    },
                    {
                        model: models.ChecklistFilter,
                        as: 'checklistFilter',
                    },
                    {
                        model: models.Category,
                        as: 'vendorCategory',
                    },
                    {
                        model: models.CoupleBudgetPlannerCategory,
                        as: 'budgetPlannerCategory',
                        include: {
                            model: models.CoupleBudgetPlannerCategoryExpense,
                            as: 'categoryExpenses'
                        }
                    }
                ],
            }),
            models.ChecklistCategory.findAll(),
            models.ChecklistFilter.findAll({ order: [['id', 'ASC']] }),
            models.CoupleBudgetPlanner.findOne({
                where: { coupleId: req.params.coupleId },
                include: {
                    model: models.CoupleBudgetPlannerCategory,
                    as: 'budgetPlannerCategories'
                }
            }),
        ]);

        return res.status(200).json({
            checklists: checklists,
            checklistCategories: checklistCategories,
            checklistFilters: checklistFilters,
            budgetPlannerCategories: coupleBudgetPlanner.budgetPlannerCategories
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const createUpdateChecklist = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'action': 'required|in:add,edit',
            'id': 'required_if:action,edit',
            'coupleId': 'required',
            'title': 'required|min:4|max:255',
            'checklistCategoryId': 'required',
            'checklistFilterId': 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        let checklistData = {
            title: req.body.title,
            description: req.body.description,
            coupleId: req.body.coupleId,
            checklistCategoryId: req.body.checklistCategoryId,
            checklistFilterId: req.body.checklistFilterId,
            vendorType: req.body.vendorType,
            vendorCategoryId: req.body.vendorCategoryId,
            budgetPlannerCategoryId: req.body.budgetPlannerCategoryId,
            // budgetPlannerCategoryId: (req.body.budgetPlannerCategoryId != '' && req.body.budgetPlannerCategoryId != null) ? req.body.budgetPlannerCategoryId : null,
        };

        let checklist = req.body.action === 'add' ?
            await models.Checklist.create(checklistData) :
            await models.Checklist.update(checklistData, { where: { id: req.body.id } });


        const clist = await models.Checklist.findOne({
            where: { id: req.body.action === 'add' ? checklist.id : req.body.id },
            include: [
                {
                    model: models.ChecklistCategory,
                    as: 'checklistCategory',
                },
                {
                    model: models.ChecklistFilter,
                    as: 'checklistFilter',
                },
                {
                    model: models.CoupleBudgetPlannerCategory,
                    as: 'budgetPlannerCategory',
                    include: {
                        model: models.CoupleBudgetPlannerCategoryExpense,
                        as: 'categoryExpenses'
                    }
                }
            ],
        });

        return res.status(200).json({
            message: 'Task created successfully',
            checklist: req.body.action === 'add' ? [clist] : clist
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const changeChecklistStatus = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'id': 'required',
        });

        if (validation.fails()) {
            return res.status(501).json({
                message: 'Checklist not found',
            });
        }

        const checklist = await models.Checklist.findByPk(req.body.id);
        if (!checklist) {
            return res.status(404).json({
                message: 'Checklist not found',
            });
        }
        checklist.completed = !checklist.completed;
        await checklist.save();

        return res.status(200).json({
            message: 'Task status changed successfully!',
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = {
    loadChecklists,
    createUpdateChecklist,
    changeChecklistStatus
}