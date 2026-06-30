import Sidebar from "@components/couple/budget-planner/Sidebar";
import { Outlet, useParams } from "react-router-dom";
import Header from "@components/couple/budget-planner/Header";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import { useEffect, useRef, useState } from "react";
import CategoryActionModal from "@components/couple/budget-planner/CategoryActionModal";
import {
    loadBudgetPlanner,
    // loadBudgetPlannerCategory,
    deleteBudgetPlannerCategory,
    createUpdateExpense,
    deleteExpense,
    deleteExpensePayment,
} from "@services/CoupleService";
import { useNavigate } from "react-router-dom";
import { statusMessages } from "@utilities/CommonUtil";
import Payments from "@components/couple/budget-planner/Payments";
import generatePDF, { Margin, usePDF } from "react-to-pdf";
import BPPdfHeader from "@components/couple/budget-planner/BPPdfHeader";
import '@components/couple/budget-planner/style.css';

function BudgetPlanner() {
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();
    let { id } = useParams();
    const navigate = useNavigate();
    const [state, setState] = useState({
        budgetPlanner: null,
        stats: [],
        selectedTab: 'budget-planner', //? budget-planner, payments
        selectedCategory: null,
        generatingPdf: false,
    });

    useEffect(() => {
        if (app.profile && app.profile.couple) {
            init(app.profile.couple.id);
        }
    }, [app.profile]);

    useEffect(() => {
        if (id && state.budgetPlanner?.budgetPlannerCategories) {
            let category = state.budgetPlanner.budgetPlannerCategories.filter((category) => category.id === parseInt(id))[0];
            setState((currentState) => ({
                ...currentState,
                selectedCategory: category
            }));
        }
    }, [id, state.budgetPlanner]);


    async function init(coupleId) {
        try {
            dispatch(toggleLoading(true));
            if (!state.budgetPlanner) {
                const categoriesResponse = await loadBudgetPlanner(coupleId);
                setState((currentState) => ({
                    ...currentState,
                    budgetPlanner: categoriesResponse.data.budgetPlanner,
                }));

                // if (id) {
                //     let category = categoriesResponse.data.budgetPlanner.budgetPlannerCategories.filter((item) => item.id === id)[0];
                //     const categoryResponse = await loadBudgetPlannerCategory(coupleId, id);
                //     setState((currentState) => ({
                //         ...currentState,
                //         selectedCategory: categoryResponse.data.budgetPlannerCategory
                //     }));
                // }
            }

            // if (id) {
            //     let category = state
            //     const categoryResponse = await loadBudgetPlannerCategory(coupleId, id);
            //     setState((currentState) => ({
            //         ...currentState,
            //         selectedCategory: categoryResponse.data.budgetPlannerCategory
            //     }));
            // }

            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
        }
    }

    const categoryActionModal = useRef(null);
    const showCategoryActionModal = (action, item = {}) => {
        categoryActionModal.current.showModal(
            action,
            state.budgetPlanner,
            item,
        );
    }
    const hideCategoryActionModal = () => {
        categoryActionModal.current.hideModal();
    }

    const addCategory = (item) => {
        let budgetPlanner = state.budgetPlanner;
        item.categoryExpenses = [];
        budgetPlanner.budgetPlannerCategories.push(item);
        setState((currentState) => ({
            ...currentState,
            budgetPlanner: budgetPlanner
        }));
    }
    const updateCategory = (item) => {
        let budgetPlanner = state.budgetPlanner;
        budgetPlanner.budgetPlannerCategories = budgetPlanner.budgetPlannerCategories.map((category) => {
            if (category.id === item.id) {
                return {
                    ...category,
                    name: item.name,
                    icon: item.icon
                }
            }

            return category;
        });
        setState((currentState) => ({
            ...currentState,
            budgetPlanner: budgetPlanner
        }));
    }

    const tryDeleteCategory = async () => {
        if (!window.confirm(`Are you sure you want to delete ${state.selectedCategory.name} category?`)) {
            return;
        }

        try {
            dispatch(toggleLoading(true));
            await deleteBudgetPlannerCategory(state.selectedCategory.id);
            let budgetPlanner = state.budgetPlanner;
            budgetPlanner.budgetPlannerCategories = budgetPlanner.budgetPlannerCategories.filter((category) => {
                return category.id !== state.selectedCategory.id
            });
            setState((currentState) => ({
                ...currentState,
                budgetPlanner: budgetPlanner
            }));

            navigate('/couple/budget-planner');
            dispatch(toggleLoading(false));
        } catch (error) {
            statusMessages(error);
            dispatch(toggleLoading(false));
        }
    }

    const addNewExpense = () => {
        let selectedCategory = state.selectedCategory;
        selectedCategory.categoryExpenses.push({
            coupleBudgetPlannerCategoryId: state.selectedCategory.id,
            name: '',
            estimatedCost: 0,
            finalCost: 0,
            note: '',
            payments: []
        });

        setState((currentState) => ({
            ...currentState,
            selectedCategory: selectedCategory
        }));
    }

    const handleInputChange = (e) => {
        setState((currentState) => ({
            ...currentState,
            selectedCategory: currentState.selectedCategory
        }));
    }

    const tryCreateUpdateExpense = async (item, index) => {
        try {
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

            dispatch(toggleLoading(true));

            const { data } = await createUpdateExpense(item);
            toast.success(data.message);

            let selectedCategory = state.selectedCategory;
            for (const key in data.expense) {
                selectedCategory.categoryExpenses[index][key] = data.expense[key];
            }
            setState((currentState) => ({
                ...currentState,
                selectedCategory: selectedCategory
            }));

            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    }

    const tryDeleteExpense = async (expense, index) => {
        if (!window.confirm(`Are you sure you want to delete ${expense.name} expense?`)) {
            return;
        }

        try {
            dispatch(toggleLoading(true));
            const { data } = await deleteExpense(expense.id);
            toast.success(data.message);
            let selectedCategory = state.selectedCategory;
            delete selectedCategory.categoryExpenses[index];
            setState((currentState) => ({
                ...currentState,
                selectedCategory: selectedCategory
            }));
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    const addPayment = (payment, indexExpense) => {
        state.selectedCategory.categoryExpenses[indexExpense].payments.push(payment);
    }
    const updatePayment = (categoryIndex = null, payment, indexExpense, indexPayment) => {
        if (state.selectedCategory) {
            state.selectedCategory.categoryExpenses[indexExpense].payments[indexPayment] = payment;
        }

        if (state.selectedTab === 'payments') {
            let budgetPlanner = state.budgetPlanner;
            budgetPlanner.budgetPlannerCategories[categoryIndex].categoryExpenses[indexExpense].payments[indexPayment] = payment;

            setState((currentState) => ({
                ...currentState,
                budgetPlanner: budgetPlanner
            }));
        }
    }

    const tryDeleteExpensePayment = async (payment, indexExpense, indexPayment) => {
        if (!window.confirm(`Are you sure you want to delete ${payment.amount} amount?`)) {
            return;
        }

        try {
            dispatch(toggleLoading(true));
            const { data } = await deleteExpensePayment(payment.id);
            toast.success(data.message);
            let selectedCategory = state.selectedCategory;
            delete selectedCategory.categoryExpenses[indexExpense].payments[indexPayment];
            setState((currentState) => ({
                ...currentState,
                selectedCategory: selectedCategory
            }));
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    const changeTab = async (tab) => {
        setState((currentState) => ({
            ...currentState,
            selectedTab: tab
        }));
    }

    const { toPDF, targetRef } = usePDF({
        method: "save",
        filename: `${app.profile.fullName}-${state.selectedTab === 'budget-planner' ? 'budget-planner' : 'payments'}-${state.selectedCategory ? state.selectedCategory.name : ''}.pdf`,
        page: { margin: Margin.SMALL },
    });
    const exportToPdf = () => {
        setState((currentState) => ({
            ...currentState,
            generatingPdf: true,
        }));

        setTimeout(() => {
            toPDF().then((_) => {
                setState((currentState) => ({
                    ...currentState,
                    generatingPdf: false,
                }));
            });
        });
    }

    return (
        <div className="container spacer mb-5">
            <div className="row">
                {state.selectedTab === 'budget-planner' && <div className="col-md-3">
                    <Sidebar
                        app={app}
                        categories={state.budgetPlanner?.budgetPlannerCategories}
                        onShowCategoryActionModal={() => showCategoryActionModal('add')}
                    />
                </div>}
                <div className={`col-md-${state.selectedTab === 'budget-planner' ? 9 : 12}`}>
                    <div className="row">
                        <Header
                            selectedTab={state.selectedTab}
                            onTabSelect={(tab) => changeTab(tab)}
                            onExportToPdf={() => exportToPdf()}
                        />
                        <div className="col-md-12">
                            <div className="row" ref={targetRef}>
                                {state.generatingPdf && <div className="col-md-12">
                                    <BPPdfHeader app={app} />
                                </div>}
                                {state.selectedTab === 'budget-planner' ? <Outlet
                                    context={{
                                        app: app,
                                        budgetPlanner: state.budgetPlanner,
                                        category: state.selectedCategory,
                                        onShowCategoryActionModal: () => showCategoryActionModal('edit', state.selectedCategory),
                                        onDeleteCategory: () => tryDeleteCategory(),
                                        onAddNewExpense: () => addNewExpense(),
                                        onHandleInputChange: (e) => handleInputChange(e),
                                        onCreateUpdateExpense: (expense, index) => tryCreateUpdateExpense(expense, index),
                                        onDeleteExpense: (expense, index) => tryDeleteExpense(expense, index),
                                        onAddPayment: (payment, indexExpense) => addPayment(payment, indexExpense),
                                        onUpdatePayment: (payment, indexExpense, indexPayment) => updatePayment(null, payment, indexExpense, indexPayment),
                                        onDeleteExpensePayment: (payment, indexExpense, indexPayment) => tryDeleteExpensePayment(payment, indexExpense, indexPayment),
                                        generatingPdf: state.generatingPdf
                                    }}
                                /> : <Payments
                                    app={app}
                                    budgetPlanner={state.budgetPlanner}
                                    onUpdatePayment={(categoryIndex, payment, indexExpense, indexPayment) => updatePayment(categoryIndex, payment, indexExpense, indexPayment)}
                                    generatingPdf={state.generatingPdf}
                                />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CategoryActionModal
                app={app}
                ref={categoryActionModal}
                onHideModal={hideCategoryActionModal}
                onItemCreated={(item) => addCategory(item)}
                onItemUpdated={(item) => updateCategory(item)}
            />
        </div>
    );
}

export default BudgetPlanner;