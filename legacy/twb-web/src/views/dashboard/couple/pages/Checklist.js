/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import ChecklistAddUpdateModal from '@components/couple/checklist/ChecklistAddUpdateModal';
import ChecklistFilters from '@components/couple/checklist/Filters';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import * as coupleService from '@services/CoupleService';
import { toast } from 'react-hot-toast';
import { slugify, subtractAndformatDate, formatDate, statusMessages } from "@utilities/CommonUtil";
import { convertToNumber } from "@utilities/CommonUtil";
import CurrencyFormat from "@components/shared/CurrencyFormat";
import ChecklistFiltersModal from '@components/couple/checklist/FiltersModal';

function Checklist() {
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();
    useEffect(() => {
        if (app.profile && app.profile.couple) {
            init(app.profile.couple.id);
        }
    }, [app.profile]);

    const [state, setState] = useState({
        coupleId: '',
        checklists: [],
        checklistCategories: [],
        checklistFilters: [],
        venueCategories: [],
        supplierCategories: [],
        budgetPlannerCategories: [],
        counts: {
            completed: 0,
            total: 0
        },
        resultsFilters: [
            {
                name: 'To Do',
                type: 'status',
                className: 'to-do'
            }
        ],
        dateGrouped: [],
        categoryGrouped: [],
        updated: false,

        errors: {}
    });

    useEffect(() => {
        filterTasks();
    }, [state.resultsFilters]);

    useEffect(() => {
        if (state.updated) {
            mapChecklistsToState(state.checklists);
            filterTasks();
        }

        setState((currentState) => ({
            ...currentState,
            updated: false,
        }));

    }, [state.updated]);

    useEffect(() => {
        if (app.categories.length) {
            let venueCategories = [];
            let supplierCategories = [];

            app.categories.forEach((category) => {
                if (category.type === "venue") {
                    venueCategories.push(category);
                } else {
                    supplierCategories.push(category);
                }
            });

            setState((currentState) => ({
                ...currentState,
                venueCategories: venueCategories,
                supplierCategories: supplierCategories,
            }));
        }
    }, [app.categories]);

    const filterTasks = () => {
        for (const box of document.getElementsByClassName('tamil-task-operational-parent')) {
            box.classList.remove('hidden');
        }
        for (const box of document.getElementsByClassName('tamil-task-operational')) {
            box.classList.remove('hidden');
        }

        let statusFilter = '';
        let dateFilter = '';
        let categoryFilter = '';

        state.resultsFilters.forEach(filter => {
            if (filter.type === 'status') statusFilter = filter.className;
            if (filter.type === 'date') dateFilter = filter.className;
            if (filter.type === 'category') categoryFilter = filter.className;
        });

        if (dateFilter !== '') {
            for (const box of document.getElementsByClassName('tamil-task-operational-parent')) {
                box.classList.add('hidden');
            }

            for (const box of document.getElementsByClassName(`${dateFilter}`)) {
                box.classList.remove('hidden');
            }
        }

        if (statusFilter !== '' && categoryFilter !== '') {
            for (const box of document.querySelectorAll('.tamil-task-operational')) {
                box.classList.add('hidden');
                box.closest('.tamil-task-operational-parent').classList.add('hidden');
            }

            let totalFound = 0;
            for (const box of document.querySelectorAll(`${dateFilter !== '' ? '.' + dateFilter : ''} .${statusFilter}.${categoryFilter}`)) {
                totalFound++;
                box.classList.remove('hidden');
                if (dateFilter === '') {
                    box.closest('.tamil-task-operational-parent').classList.remove('hidden');
                }
            }

            if (dateFilter !== '' && totalFound < 1) {
                for (const box of document.getElementsByClassName(`${dateFilter}`)) {
                    box.classList.add('hidden');
                }
            } else {
                for (const box of document.getElementsByClassName(`${dateFilter}`)) {
                    box.classList.remove('hidden');
                }
            }
        } else if (statusFilter !== '' || categoryFilter !== '') {
            for (const box of document.querySelectorAll('.tamil-task-operational')) {
                box.classList.add('hidden');
                if (dateFilter === '') {
                    box.closest('.tamil-task-operational-parent').classList.add('hidden');
                }
            }

            let totalFound = 0;
            for (const box of document.querySelectorAll(`${dateFilter !== '' ? '.' + dateFilter : ''} .${statusFilter !== '' ? statusFilter : categoryFilter}`)) {
                totalFound++;
                box.classList.remove('hidden');
                if (dateFilter === '') {
                    box.closest('.tamil-task-operational-parent').classList.remove('hidden');
                }
            }

            if (dateFilter !== '' && totalFound < 1) {
                for (const box of document.getElementsByClassName(`${dateFilter}`)) {
                    box.classList.add('hidden');
                }
            } else {
                for (const box of document.getElementsByClassName(`${dateFilter}`)) {
                    box.classList.remove('hidden');
                }
            }
        }
    }

    async function init(coupleId) {
        try {
            dispatch(toggleLoading(true));
            const { data } = await coupleService.loadChecklists(coupleId);

            mapChecklistsToState(data.checklists);

            setState((currentState) => ({
                ...currentState,
                coupleId: coupleId,
                checklists: data.checklists,
                checklistCategories: data.checklistCategories,
                checklistFilters: data.checklistFilters,
                budgetPlannerCategories: data.budgetPlannerCategories
            }));

            setTimeout(() => {
                filterTasks();
                let mainTaskContainer = document.getElementById('main-task-container');
                if (mainTaskContainer) {
                    mainTaskContainer.style.display = 'block';
                }
            }, 1000);

            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
        }
    }

    function mapChecklistsToState(checklists) {
        let counts = state.counts;
        let dateGrouped = state.dateGrouped;
        let categoryGrouped = state.categoryGrouped;

        checklists.forEach(checklist => {
            if (checklist.completed) {
                counts.completed++;
            }
            counts.total++;

            let filterExists = dateGrouped.find(e => e.name === checklist.checklistFilter.name);
            if (filterExists) {
                filterExists.count++;
                filterExists.checklists.push(checklist);
            } else {
                dateGrouped.push({
                    name: checklist.checklistFilter.name,
                    count: 1,
                    checklists: [checklist]
                });
            }

            let categoryExists = categoryGrouped.find(e => e.name === checklist.checklistCategory.name);
            if (categoryExists) {
                categoryExists.count++;
                categoryExists.checklists.push(checklist)
            } else {
                categoryGrouped.push({
                    name: checklist.checklistCategory.name,
                    count: 1,
                    checklists: [checklist]
                });
            }
        });

        setState((currentState) => ({
            ...currentState,
            counts: counts,
            dateGrouped: dateGrouped,
            categoryGrouped: categoryGrouped
        }));
    }

    const addFilter = (filter) => {
        console.log('add filter')
        if (state.resultsFilters.find(e => e.name === filter.name)) return;

        let resultsFilters = state.resultsFilters;

        resultsFilters = resultsFilters.filter(rF => {
            return rF.type !== filter.type;
        });

        resultsFilters.push(filter);

        setState((currentState) => ({
            ...currentState,
            resultsFilters: resultsFilters
        }));
    }

    const removeFilter = (filter) => {
        console.log('remove filter')
        let resultsFilters = state.resultsFilters;
        resultsFilters = resultsFilters.filter(rF => {
            return rF.type !== filter.type;
        });

        setState((currentState) => ({
            ...currentState,
            resultsFilters: resultsFilters
        }));
    }

    const checklistAddUpdateModal = useRef(null);


    const showChecklistAddUpdateModal = (action = 'add', checklist = {}) => {
        checklistAddUpdateModal.current.showModal(action, checklist);
    }
    const hideChecklistAddUpdateModal = () => {
        checklistAddUpdateModal.current.hideModal();
    }

    const checklistFiltersModal = useRef(null);
    const showChecklistFiltersModal = (action = 'add', checklist = {}) => {
        checklistFiltersModal.current.showModal(action, checklist);
    }
    const hideChecklistFiltersModal = () => {
        console.log('hide')
        checklistFiltersModal.current.hideModal();
    }

    const addTask = (checklist) => {
        mapChecklistsToState(checklist);
        hideChecklistAddUpdateModal();
    }

    const updateTask = (checklist) => {
        setState((currentState) => ({
            ...currentState,
            checklists: currentState.checklists.map(c => {
                if (c.id === checklist.id) {
                    return checklist;
                }

                return c;
            }),
            counts: {
                completed: 0,
                total: 0
            },
            dateGrouped: [],
            categoryGrouped: [],
            updated: true
        }));
        hideChecklistAddUpdateModal();
    }

    const toggleTaskStatus = async (checklist) => {
        try {
            dispatch(toggleLoading(true));

            const { data } = await coupleService.changeChecklistStatus(checklist);

            let counts = state.counts;
            let dateGrouped = state.dateGrouped;
            let categoryGrouped = state.categoryGrouped;
            checklist.completed = !checklist.completed;

            if (checklist.completed) {
                counts.completed++;
            } else {
                counts.completed--;
            }


            let filterExists = dateGrouped.find(e => e.name === checklist.checklistFilter.name);
            if (filterExists) {
                filterExists.checklists.forEach(cl => {
                    if (cl.id === checklist.id) {
                        if (checklist.completed) {
                            cl.completed = false;
                        } else {
                            cl.completed = true;
                        }
                    }
                });
            }

            let categoryExists = categoryGrouped.find(e => e.name === checklist.checklistCategory.name);
            if (categoryExists) {
                categoryExists.checklists.forEach(cl => {
                    if (cl.id === checklist.id) {
                        if (checklist.completed) {
                            cl.completed = false;
                        } else {
                            cl.completed = true;
                        }
                    }
                });
            }

            setState((currentState) => ({
                ...currentState,
                counts: counts,
                dateGrouped: dateGrouped,
                categoryGrouped: categoryGrouped
            }));

            dispatch(toggleLoading(false));
            toast.success(data.message);
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

    const sumeOfAllPyaments = (category) => {
        let total = 0.00;
        category?.categoryExpenses.forEach(expense => {
            total += convertToNumber(expense.estimatedCost);
        });

        return (<CurrencyFormat
            value={total.toFixed(2)}
        />);
    }

    const calculateDate = (filter) => {
        switch (filter.name) {
            case 'From 10 to 12 months':
                return `Before ${subtractAndformatDate(app.profile.couple.weddingDetail.date, 10, 'months', 'MMMM YYYY')}`;
            case 'From 7 to 9 months':
                return `Before ${subtractAndformatDate(app.profile.couple.weddingDetail.date, 7, 'months', 'MMMM YYYY')}`;
            case 'From 4 to 6 months':
                return `Before ${subtractAndformatDate(app.profile.couple.weddingDetail.date, 4, 'months', 'MMMM YYYY')}`;
            case 'From 2 to 3 months':
                return `Before ${subtractAndformatDate(app.profile.couple.weddingDetail.date, 2, 'months', 'MMMM YYYY')}`;
            case 'The last month':
                return `Before ${subtractAndformatDate(app.profile.couple.weddingDetail.date, 1, 'months', 'MMMM YYYY')}`;
            case '2 weeks':
                return `Before ${subtractAndformatDate(app.profile.couple.weddingDetail.date, 2, 'weeks', 'MMMM YYYY')}`;
            case 'Last weeks':
                return `Before ${subtractAndformatDate(app.profile.couple.weddingDetail.date, 1, 'weeks', 'MMMM YYYY')}`;
            case 'Last day':
                return `Before ${subtractAndformatDate(app.profile.couple.weddingDetail.date, 1, 'days', 'MMMM YYYY')}`;
            case 'Wedding day':
                return '';
            case 'After the wedding':
                return `After ${formatDate(app.profile.couple.weddingDetail.date, 'MMMM YYYY')}`;
            default:
                return '';
        }
    }

    return (
        <>
            <div className="container spacer">
                <div className="row">
                    <div className="col-md-3 mb-md-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="mb-3 fw-600">
                                Checklist
                            </h3>
                            <a href="#" className="checklist-filter-btn mb-3 d-block d-md-none" onClick={() => showChecklistFiltersModal()}>
                                <i className="bi bi-filter text-theme"></i> Apply Filters
                            </a>
                        </div>
                        <div className="d-md-block d-none">
                            <ChecklistFilters state={state} addFilter={addFilter} removeFilter={removeFilter} />
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-7">
                                <p className="mb-2">You Have Completed <strong>{state.counts.completed} out of {state.counts.total}</strong> Tasks</p>
                                <div className="progress mt-1">
                                    {/* (state.counts.total * 100)/state.counts.completed */}
                                    <div className="progress-bar" role="progressbar" style={{ width: `${Math.round((state.counts.completed / state.counts.total) * 100)}%`, backgroundColor: '#eb2327' }}
                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                        {/* {Math.round((state.counts.completed / state.counts.total) * 100)} */}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-md-5">
                                <p className="mb-0">&nbsp;</p>
                                <div className="d-flex justify-content-end">
                                    <button className="btn pt-0">
                                        <i className="bi bi-arrow-down-circle"></i>
                                        &nbsp;Download
                                    </button>
                                    <button className="btn pt-0">
                                        <i className="bi bi-printer-fill"></i>
                                        &nbsp;Print
                                    </button>
                                </div>
                            </div> */}
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <div className="card mt-3 bg-light-grey">
                                    <a href="#" className="card-body c-p p-095-09" onClick={() => showChecklistAddUpdateModal()}>
                                        <div className="row sm-text-center">
                                            <div className="col-md-1">
                                                <div className="ml-2">
                                                    <i className="bi bi-plus-circle plus-icon fs-32px"></i>
                                                </div>
                                            </div>
                                            <div className="col-md-11">
                                                <div className="mt-2">
                                                    <h4 className="text-muted">
                                                        {/* <span className="sm-d-none">&nbsp;&nbsp;&nbsp;</span> */}
                                                        Add new task</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-12" style={{ display: 'none' }} id="main-task-container">
                                <div className="row">
                                    {state.checklistFilters.map((filter, indexFilter) => <React.Fragment key={`checklist-filters-${indexFilter}`}>
                                        {state.dateGrouped.find(e => e.name === filter.name) && state.dateGrouped.find(e => e.name === filter.name).checklists.length && <div className={`col-md-12 tamil-task-operational-parent ${slugify(filter.name)}`} >
                                            <div className="row mt-5">
                                                <div className="col">
                                                    <h6>{filter.name}</h6>
                                                </div>
                                                <div className="col text-right">
                                                    <small>{calculateDate(filter)}</small>
                                                </div>
                                                <div className="col-md-12">
                                                    <ul className="list-group">
                                                        {state.dateGrouped.find(e => e.name === filter.name).checklists.map((checklist, checklistIndex) =>
                                                            <li key={`From-10-to-12-months-${checklistIndex}`} className={`list-group-item tamil-task-operational ${checklist.completed ? 'done' : 'to-do'} ${slugify(checklist.checklistCategory.name)}`}>
                                                                <div className="row">
                                                                    <div className="col-md-1">
                                                                        <div className="task-icon-bg ml-1 mt-1"
                                                                            onMouseOver={(div) => { div.target.closest('.tamil-task-operational').classList.add('done-temp') }}
                                                                            onMouseLeave={(div) => { div.target.closest('.tamil-task-operational').classList.remove('done-temp') }}
                                                                            onClick={() => { toggleTaskStatus(checklist) }}
                                                                        >
                                                                            <i className="bi bi-check2 text-muted"></i>
                                                                        </div>
                                                                    </div>
                                                                    <a href="#" className="col-md-11" onClick={() => showChecklistAddUpdateModal('edit', checklist)}>
                                                                        <div className="d-flex justify-content-between align-items-center gap-10">
                                                                            <div>
                                                                                <p className="task-title">{checklist.title}</p>
                                                                                <small
                                                                                    className="badge badge-light text-muted fn-10">{checklist.checklistCategory.name}</small>
                                                                            </div>
                                                                            <div>
                                                                                {checklist.budgetPlannerCategory && <div>
                                                                                    <span className="bi bi-coin"></span> <span>{sumeOfAllPyaments(checklist.budgetPlannerCategory)}</span>
                                                                                </div>}
                                                                            </div>
                                                                        </div>
                                                                    </a>
                                                                </div>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>}
                                    </React.Fragment>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChecklistAddUpdateModal
                app={app}
                venueCategories={state.venueCategories}
                supplierCategories={state.supplierCategories}
                ref={checklistAddUpdateModal}
                onHideModal={hideChecklistAddUpdateModal}
                onTaskAdded={addTask}
                onTaskUpdated={updateTask}
                checklistCategories={state.checklistCategories}
                checklistFilters={state.checklistFilters}
                budgetPlannerCategories={state.budgetPlannerCategories}
            />

            <ChecklistFiltersModal
                ref={checklistFiltersModal}
                state={state} addFilter={addFilter} removeFilter={removeFilter}
                onHideModal={hideChecklistFiltersModal}
            />
        </>
    );
}

export default Checklist;