import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "@utilities/Modal";
import * as validateUtil from '@utilities/ValidateUtil';
import { createUpdateChecklist, createUpdateExpense, deleteExpense, loadVendorsByCategory } from '@services/CoupleService';
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { statusMessages, vendorTypes } from "@utilities/CommonUtil";
import BudgetPlannerExpenses from "@components/couple/guest-list/BudgetPlannerExpenses";
import { Rating } from "react-simple-star-rating";
import { useNavigate } from "react-router-dom";

const empty = {
    title: '',
    description: '',
    coupleId: '',
    checklistCategoryId: '',
    vendorType: null,
    vendorCategoryId: null,
    budgetPlannerCategoryId: null,
    checklistFilterId: '',
    note: '',
    categories: [],
    filters: [],
};

const ChecklistAddUpdateModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        checklist: empty,

        categoryVendors: [],
        action: 'add',
        errors: {}
    });

    const categoryRef = useRef('');
    const filterRef = useRef('');
    const vendorTypeRef = useRef('');
    const vendorCategoryRef = useRef('');
    const budgetPlannerCategoryRef = useRef('');

    let modal = null;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
        showModal(action, checklist) {
            modal = new Modal('#checklistAddUpdateModal', {
                backdrop: true
            });

            modal.show();

            let checklistData = empty;
            if (action === 'edit') {
                categoryRef.current.setValue({ name: checklist.checklistCategory.name, id: checklist.checklistCategoryId });
                filterRef.current.setValue({ name: checklist.checklistFilter.name, id: checklist.checklistFilterId });
                if (checklist.vendorType) {
                    vendorTypeRef.current.setValue(vendorTypes.filter((vt) => vt.name === checklist.vendorType));
                }
                // if (checklist.vendorCategoryId) {
                //     vendorCategoryRef.current.setValue({ name: checklist.vendorCategory.name, id: checklist.vendorCategoryId });
                // }
                if (checklist.budgetPlannerCategory) {
                    budgetPlannerCategoryRef.current.setValue({ name: checklist.budgetPlannerCategory.name, id: checklist.budgetPlannerCategoryId });
                }

                checklistData = checklist;
            }

            setState((currentState) => ({
                ...currentState,
                action: action,
                checklist: checklistData
            }));
        },
        hideModal() {
            categoryRef.current.clearValue();
            filterRef.current.clearValue();
            budgetPlannerCategoryRef.current.clearValue();
            vendorTypeRef.current.clearValue();

            modal = new Modal('#checklistAddUpdateModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            checklist: {
                ...currentState.checklist,
                [name]: value,
            }
        }));
    }

    const handleSearchChange = (selected, type) => {
        setState((currentState) => ({
            ...currentState,
            checklist: {
                ...currentState.checklist,
                [type]: selected,
            }
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((currentState) => ({
            ...currentState,
            errors: {}
        }));

        let errors = {};
        let validationFlag = true;

        if (validateUtil.isEmpty(state.checklist.title)) {
            validationFlag = false;
            errors.title = ['Title is required'];
        } else if (validateUtil.isGreaterThan(state.checklist.title, 255)) {
            validationFlag = false;
            errors.title = ['Title must not be greater than 255 characters!'];
        }
        if (validateUtil.isEmpty(state.checklist.checklistCategoryId)) {
            validationFlag = false;
            errors.checklistCategoryId = ['Category is required'];
        }
        if (validateUtil.isEmpty(state.checklist.checklistFilterId)) {
            validationFlag = false;
            errors.checklistFilterId = ['Date is required'];
        }

        if (!validationFlag) {
            setState((currentState) => ({
                ...currentState,
                errors: errors
            }));
        } else {
            submit();
        }
    }

    const addNewExpense = () => {
        let checklist = state.checklist;
        checklist?.budgetPlannerCategory?.categoryExpenses.push({
            coupleBudgetPlannerCategoryId: checklist?.budgetPlannerCategory.id,
            name: '',
            estimatedCost: 0,
            finalCost: 0,
            note: '',
            payments: []
        });

        setState((currentState) => ({
            ...currentState,
            checklist: checklist
        }));
    }

    const handleBudgetPlannerInputChange = (e) => {
        setState((currentState) => ({
            ...currentState,
            checklist: currentState.checklist
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

            let checklist = state.checklist;
            for (const key in data.expense) {
                checklist.budgetPlannerCategory.categoryExpenses[index][key] = data.expense[key];
            }

            setState((currentState) => ({
                ...currentState,
                checklist: checklist
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
            let checklist = state.checklist;
            delete checklist.budgetPlannerCategory.categoryExpenses[index];
            setState((currentState) => ({
                ...currentState,
                checklist: checklist
            }));
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    useEffect(() => {
        if (state.checklist.vendorCategoryId) {
            tryLoadVendorsByCategory();
        } else {
            setState((currentState) => ({
                ...currentState,
                categoryVendors: []
            }));
        }
    }, [state.checklist.vendorCategoryId])

    useEffect(() => {
        if (!state.checklist.vendorType) {
            setState((currentState) => ({
                ...currentState,
                categoryVendors: []
            }));
        }
    }, [state.checklist.vendorType])

    async function tryLoadVendorsByCategory() {
        try {
            dispatch(toggleLoading(true));
            const response = await loadVendorsByCategory(props.app.profile?.couple?.id, state.checklist.vendorCategoryId);
            setState((currentState) => ({
                ...currentState,
                categoryVendors: response.data.vendors
            }));
            dispatch(toggleLoading(false));
        } catch (error) {
            console.log(error)
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    async function submit() {
        try {
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

            dispatch(toggleLoading(true));

            state.checklist.action = state.action;
            state.checklist.coupleId = props.app.profile?.couple?.id;
            const response = await createUpdateChecklist(state.checklist);
            if (state.action === 'add') {
                props.onTaskAdded(response.data.checklist);
            } else {
                props.onTaskUpdated(response.data.checklist);
            }

            dispatch(toggleLoading(false));
            toast.success(response.data.message);
        } catch (error) {
            console.log(error)
            dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    }

    const navigateToSearchVendor = () => {
        props.onHideModal();

        let link = '';
        if (state.checklist.vendorType === 'venue') {
            link = '/couple/vendors/search?category=venue';
        } else {
            let category = props.supplierCategories.filter(c => c.id === state.checklist.vendorCategoryId);
            link = `/couple/vendors/search?category=${category[0].slug}`;
        }

        navigate(link);
    }

    return (
        <>
            <div className="modal fade" id="checklistAddUpdateModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="checklistAddUpdateModalLabel">
                <div className="modal-dialog modal-lg couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title">{state.action === 'add' ? 'Add new task' : 'Edit task'}</div>
                            <button className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row px-3">
                                <div className="col-12">
                                    <form className="auth-register-form mt-1" action="#" method="POST" onSubmit={onSubmit}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-4">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={state.checklist.title}
                                                        id="title"
                                                        onChange={handleInputChange}
                                                        placeholder="Name of the task"
                                                        className="form-control own-input only-b-brdr-grey fs-24px dark-color fw-600"
                                                    />
                                                    {
                                                        state.errors.title &&
                                                        <div className="invalid-feedback">
                                                            {state.errors.title[0]}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-4">
                                                    <input
                                                        type="text"
                                                        name="description"
                                                        value={state.checklist.description}
                                                        id="description"
                                                        onChange={handleInputChange}
                                                        placeholder="Description of the task"
                                                        className="form-control own-input only-b-brdr-grey"
                                                    />

                                                    {
                                                        state.errors.description &&
                                                        <div className="invalid-feedback">
                                                            {state.errors.description[0]}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-sm-4 mb-4">
                                                        <Select
                                                            ref={categoryRef}
                                                            className=""
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            placeholder="Category"
                                                            name="checklistCategoryId"
                                                            defaultValue={props.checklistCategories.filter((c) => c.id === state.checklist.checklistCategoryId)}
                                                            getOptionLabel={(option) => option.name}
                                                            getOptionValue={(option) => option.id}
                                                            onChange={(option) => { handleSearchChange(option !== null ? option.id : '', 'checklistCategoryId') }}
                                                            options={props.checklistCategories}
                                                        />
                                                        {
                                                            state.errors.checklistCategoryId &&
                                                            <div className="invalid-feedback">
                                                                {state.errors.checklistCategoryId[0]}
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="col-sm-4 mb-4">
                                                        <Select
                                                            ref={filterRef}
                                                            className=""
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            placeholder="Start Date"
                                                            name="checklistFilterId"
                                                            defaultValue={props.checklistFilters.filter((c) => c.id === state.checklist.checklistFilterId)}
                                                            getOptionLabel={(option) => option.name}
                                                            getOptionValue={(option) => option.id}
                                                            onChange={(option) => { handleSearchChange(option !== null ? option.id : '', 'checklistFilterId') }}
                                                            options={props.checklistFilters}
                                                        />
                                                        {
                                                            state.errors.checklistFilterId &&
                                                            <div className="invalid-feedback">
                                                                {state.errors.checklistFilterId[0]}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <hr />
                                            </div>
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="row">
                                                            <div className="col-md-4 mb-3">
                                                                <label>
                                                                    <span className="bi bi-bookmark-plus"></span> Related Supplier</label>
                                                                <Select
                                                                    ref={vendorTypeRef}
                                                                    className=""
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                    placeholder="Select a group"
                                                                    defaultValue={vendorTypes.filter((vt) => vt.name === state.checklist.vendorType)}
                                                                    getOptionLabel={(option) => option.label}
                                                                    getOptionValue={(option) => option.name}
                                                                    onChange={(option) => { handleSearchChange(option !== null ? option.name : null, 'vendorType') }}
                                                                    options={vendorTypes}
                                                                />
                                                                {state.errors.vendorType && (
                                                                    <div className="invalid-feedback">
                                                                        {state.errors.vendorType[0]}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {state.checklist.vendorType && <div className="col-md-4">
                                                                <label>
                                                                    <span className="bi bi-shop"></span> Supplier Category
                                                                </label>
                                                                <Select
                                                                    ref={vendorCategoryRef}
                                                                    className=""
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                    placeholder="Business category"
                                                                    defaultValue={state.checklist.vendorType === "venue"
                                                                        ? props.venueCategories.filter((c) => c.id === state.checklist.vendorCategoryId)
                                                                        : state.checklist.vendorType === "supplier"
                                                                            ? props.supplierCategories.filter(c => c.id === state.checklist.vendorCategoryId) : null}
                                                                    getOptionLabel={(option) => option.name}
                                                                    getOptionValue={(option) => option.id}
                                                                    onChange={(option) => { handleSearchChange(option !== null ? option.id : null, 'vendorCategoryId') }}
                                                                    options={
                                                                        state.checklist.vendorType === "venue"
                                                                            ? props.venueCategories
                                                                            : state.checklist.vendorType === "supplier"
                                                                                ? props.supplierCategories
                                                                                : []
                                                                    }
                                                                />
                                                                {state.errors.vendorCategoryId && (
                                                                    <div className="invalid-feedback">
                                                                        {state.errors.vendorCategoryId[0]}
                                                                    </div>
                                                                )}
                                                            </div>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    {state.categoryVendors.map((category, key) => {
                                                        return (
                                                            <div className="col-lg-4 col-md-6 text-center mb-4" key={`main-category-${key}`}>
                                                                <div className="card img-fluid w-h-100 relative">
                                                                    <img className="card-img-top card-cat-img" src={`${category.coupleVendor.user.photo ? props.app.serverPath + category.coupleVendor.user.photo : '/assets/images/placeholder.png'}`}
                                                                        alt="" />

                                                                    <div className="card-img-overlay card-cat-img text-left">
                                                                        <div className="mt-3">
                                                                            <small className="badge badge-warning mt-3">
                                                                                {category.coupleVendor.category.name}
                                                                            </small>
                                                                            <strong className="text-light block mt-1">{category.coupleVendor.user.fullName}</strong>
                                                                            <small className="block text-light">
                                                                                {category.coupleVendor.user.address}
                                                                            </small>
                                                                            <div className="card-rating">
                                                                                <Rating
                                                                                    initialValue={3}
                                                                                    readonly={true}
                                                                                    size={12}
                                                                                    allowFraction={true}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {(state.checklist.vendorCategoryId && !state.categoryVendors?.length) && <div className="col-md-4">

                                                        <button onClick={() => navigateToSearchVendor()} className="card">
                                                            <div className="card-body text-center">
                                                                <span className="bi bi-shop fs-3rem"></span> <br /><br />
                                                                <h3>Search Vendor</h3>
                                                            </div>
                                                        </button>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <hr />
                                            </div>
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <label>
                                                            <span className="bi bi-coin"></span> Related Expense
                                                        </label>
                                                        <Select
                                                            ref={budgetPlannerCategoryRef}
                                                            className=""
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            placeholder="Add Expense"
                                                            name="budgetPlannerCategoryId"
                                                            defaultValue={props.budgetPlannerCategories.filter((c) => c.id === state.checklist.budgetPlannerCategoryId)}
                                                            getOptionLabel={(option) => option.name}
                                                            getOptionValue={(option) => option.id}
                                                            onChange={(option) => { handleSearchChange(option !== null ? option.id : null, 'budgetPlannerCategoryId') }}
                                                            options={props.budgetPlannerCategories}
                                                        />
                                                        {
                                                            state.errors.budgetPlannerCategoryId &&
                                                            <div className="invalid-feedback">
                                                                {state.errors.budgetPlannerCategoryId[0]}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                {state.checklist.budgetPlannerCategory && <div className="row mt-2">
                                                    <div className="col-md-12">
                                                        <BudgetPlannerExpenses
                                                            budgetPlannerCategory={state.checklist?.budgetPlannerCategory}
                                                            onAddNewExpense={() => addNewExpense()}
                                                            onHandleInputChange={(e) => handleBudgetPlannerInputChange(e)}
                                                            onCreateUpdateExpense={(expense, index) => tryCreateUpdateExpense(expense, index)}
                                                            onDeleteExpense={(expense, index) => tryDeleteExpense(expense, index)}
                                                        />
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-12">
                                                <div className="py-2">
                                                    <button type="submit" className="btn btn-primary">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default ChecklistAddUpdateModal;