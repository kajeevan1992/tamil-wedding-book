'use client';

import { useMemo, useState } from 'react';
import { checklistItems } from '../../data/coupleDashboardData';

const emptyChecklist = {
  title: '',
  description: '',
  checklistCategory: { name: 'Planning' },
  checklistFilter: { name: 'From 10 to 12 months' },
  completed: false,
  temporary: true,
};

const dateFilters = [
  'From 10 to 12 months',
  'From 7 to 9 months',
  'From 4 to 6 months',
  'From 2 to 3 months',
  'The last month',
  '2 weeks',
  'Last weeks',
  'Last day',
  'Wedding day',
  'After the wedding',
];

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calculateDate(filterName) {
  switch (filterName) {
    case 'From 10 to 12 months':
      return 'Before 10 to 12 months';
    case 'From 7 to 9 months':
      return 'Before 7 to 9 months';
    case 'From 4 to 6 months':
      return 'Before 4 to 6 months';
    case 'From 2 to 3 months':
      return 'Before 2 to 3 months';
    case 'The last month':
      return 'Before the last month';
    case '2 weeks':
      return 'Before 2 weeks';
    case 'Last weeks':
      return 'Before last weeks';
    case 'Last day':
      return 'Before last day';
    case 'After the wedding':
      return 'After the wedding';
    default:
      return '';
  }
}

function buildInitialForm(task = emptyChecklist) {
  return {
    title: task.title || '',
    description: task.description || '',
    checklistCategory: task.checklistCategory || { name: 'Planning' },
    checklistFilter: task.checklistFilter || { name: 'From 10 to 12 months' },
    completed: Boolean(task.completed),
    temporary: task.temporary ?? true,
  };
}

export default function CoupleChecklistPage() {
  const [tasks, setTasks] = useState(checklistItems);
  const [resultsFilters, setResultsFilters] = useState([{ name: 'To Do', type: 'status', className: 'to-do' }]);
  const [formTask, setFormTask] = useState(buildInitialForm());
  const [editingId, setEditingId] = useState(null);
  const [showChecklistAddUpdateModal, setShowChecklistAddUpdateModal] = useState(false);
  const [showChecklistFiltersModal, setShowChecklistFiltersModal] = useState(false);

  const counts = useMemo(() => ({
    completed: tasks.filter((task) => task.completed).length,
    total: tasks.length,
  }), [tasks]);

  const dateGrouped = useMemo(() => dateFilters
    .map((name) => {
      const checklists = tasks.filter((task) => task.checklistFilter.name === name);
      return { name, count: checklists.length, checklists };
    })
    .filter((group) => group.count > 0), [tasks]);

  const categoryGrouped = useMemo(() => Object.values(tasks.reduce((groups, task) => {
    const name = task.checklistCategory.name;
    groups[name] = groups[name] || { name, count: 0, checklists: [] };
    groups[name].count += 1;
    groups[name].checklists.push(task);
    return groups;
  }, {})), [tasks]);

  const filteredDateGrouped = useMemo(() => {
    const statusFilter = resultsFilters.find((filter) => filter.type === 'status');
    const dateFilter = resultsFilters.find((filter) => filter.type === 'date');
    const categoryFilter = resultsFilters.find((filter) => filter.type === 'category');

    return dateGrouped
      .filter((group) => !dateFilter || group.name === dateFilter.name)
      .map((group) => ({
        ...group,
        checklists: group.checklists.filter((task) => {
          const statusMatches = !statusFilter || (statusFilter.name === 'Done' ? task.completed : !task.completed);
          const categoryMatches = !categoryFilter || task.checklistCategory.name === categoryFilter.name;
          return statusMatches && categoryMatches;
        }),
      }))
      .filter((group) => group.checklists.length > 0);
  }, [dateGrouped, resultsFilters]);

  const progressPercent = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;

  const addFilter = (filter) => {
    setResultsFilters((current) => [...current.filter((item) => item.type !== filter.type), filter]);
  };

  const removeFilter = (filter) => {
    setResultsFilters((current) => current.filter((item) => item.type !== filter.type));
  };

  const openChecklistModal = (action = 'add', checklist = null) => {
    setEditingId(action === 'edit' && checklist ? checklist.id : null);
    setFormTask(buildInitialForm(action === 'edit' && checklist ? checklist : emptyChecklist));
    setShowChecklistAddUpdateModal(true);
  };

  const closeChecklistModal = () => {
    setEditingId(null);
    setFormTask(buildInitialForm());
    setShowChecklistAddUpdateModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;

    if (name === 'checklistCategory') {
      setFormTask((current) => ({ ...current, checklistCategory: { name: value } }));
      return;
    }

    if (name === 'checklistFilter') {
      setFormTask((current) => ({ ...current, checklistFilter: { name: value } }));
      return;
    }

    setFormTask((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitTask = (event) => {
    event.preventDefault();
    if (!formTask.title.trim()) return;

    if (editingId) {
      setTasks((current) => current.map((task) => (task.id === editingId ? { ...task, ...formTask, title: formTask.title.trim() } : task)));
    } else {
      setTasks((current) => [
        ...current,
        {
          ...formTask,
          id: `temp-${Date.now()}`,
          title: formTask.title.trim(),
          temporary: true,
        },
      ]);
    }

    closeChecklistModal();
  };

  const toggleTaskStatus = (checklist) => {
    setTasks((current) => current.map((task) => (task.id === checklist.id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = () => {
    if (!editingId) return;
    setTasks((current) => current.filter((task) => task.id !== editingId));
    closeChecklistModal();
  };

  const renderFilters = () => (
    <div className="row">
      <div className="col-md-12 mt-3">
        <h5>Results</h5>
      </div>
      <div className="col-md-12 mt-2">
        {resultsFilters.map((resultsFilter, indexResultsFilter) => (
          <button key={`date-filters-${indexResultsFilter}`} type="button" className="btn btn-sm rounded-pill bg-white mb-1" onClick={() => removeFilter(resultsFilter)}>
            <span className="text-muted">{resultsFilter.name}</span>
            <i className="bi bi-x-lg ml-1"></i>
          </button>
        ))}
      </div>
      <div className="col-md-12 mt-4">
        <h5>Status</h5>
      </div>
      <div className="col-md-12">
        {counts.completed > 0 && <div className="d-flex justify-content-between mb-2">
          <div className="d-flex gap-5">
            <div><i className="bi bi-circle-fill text-success fs-12px"></i></div>
            <button type="button" className={`btn-link text-dark p-0 border-0 bg-transparent ${resultsFilters.find((e) => e.name === 'Done') ? 'active-filter' : ''}`} onClick={() => addFilter({ name: 'Done', type: 'status', className: 'done' })}>Done</button>
          </div>
          <span className="fn-grey">{counts.completed}</span>
        </div>}

        {(counts.total - counts.completed) > 0 && <div className="d-flex justify-content-between">
          <div className="d-flex gap-5">
            <div><i className="bi bi-circle-fill text-warning fs-12px"></i></div>
            <button type="button" className={`btn-link text-dark p-0 border-0 bg-transparent ${resultsFilters.find((e) => e.name === 'To Do') ? 'active-filter' : ''}`} onClick={() => addFilter({ name: 'To Do', type: 'status', className: 'to-do' })}>To Do</button>
          </div>
          <span className="fn-grey">{counts.total - counts.completed}</span>
        </div>}
      </div>
      <div className="col-md-12 mt-5">
        <h5>By date</h5>
      </div>
      <div className="col-md-12 mt-3">
        <div className="timeline">
          <div className="timeline-outer">
            {dateGrouped.map((filter, indexFilter) => (
              <div className="timeline-inner mb-3" key={`date-filters-${indexFilter}`}>
                <div className="timeline-info">
                  <button type="button" className={`timeline-title pl-3 p-0 border-0 bg-transparent ${resultsFilters.find((e) => e.name === filter.name) ? 'active-filter' : ''}`} onClick={() => addFilter({ name: filter.name, type: 'date', className: slugify(filter.name === '2 weeks' ? 'weeks-2' : filter.name) })}>{filter.name}</button>
                  <span className="fn-grey">{filter.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-md-12 mt-5">
        <h5>By Category</h5>
      </div>
      <div className="col-md-12 mt-3">
        {categoryGrouped.map((category, indexCategory) => (
          <div className="d-flex justify-content-between" key={`categories-filters-${indexCategory}`}>
            <button type="button" className={`timeline-title pl-3 mb-2 p-0 border-0 bg-transparent ${resultsFilters.find((e) => e.name === category.name) ? 'active-filter' : ''}`} onClick={() => addFilter({ name: category.name, type: 'category', className: slugify(category.name) })}>{category.name}</button>
            <span className="fn-grey">{category.count}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="container spacer">
        <div className="row">
          <div className="col-md-3 mb-md-3">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-3 fw-600">Checklist</h3>
              <button type="button" className="checklist-filter-btn mb-3 d-block d-md-none btn p-0" onClick={() => setShowChecklistFiltersModal(true)}>
                <i className="bi bi-filter text-theme"></i> Apply Filters
              </button>
            </div>
            <div className="d-md-block d-none">
              {renderFilters()}
            </div>
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-7">
                <p className="mb-2">You Have Completed <strong>{counts.completed} out of {counts.total}</strong> Tasks</p>
                <div className="progress mt-1">
                  <div className="progress-bar" role="progressbar" style={{ width: `${progressPercent}%`, backgroundColor: '#eb2327' }} aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="card mt-3 bg-light-grey">
                  <button type="button" className="card-body c-p p-095-09 border-0 text-left w-100" onClick={() => openChecklistModal()}>
                    <div className="row sm-text-center">
                      <div className="col-md-1">
                        <div className="ml-2"><i className="bi bi-plus-circle plus-icon fs-32px"></i></div>
                      </div>
                      <div className="col-md-11">
                        <div className="mt-2"><h4 className="text-muted">Add new task</h4></div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="col-md-12" id="main-task-container">
                <div className="row">
                  {filteredDateGrouped.map((filter, indexFilter) => (
                    <div className={`col-md-12 tamil-task-operational-parent ${slugify(filter.name)}`} key={`checklist-filters-${indexFilter}`}>
                      <div className="row mt-5">
                        <div className="col"><h6>{filter.name}</h6></div>
                        <div className="col text-right"><small>{calculateDate(filter.name)}</small></div>
                        <div className="col-md-12">
                          <ul className="list-group">
                            {filter.checklists.map((checklist, checklistIndex) => (
                              <li key={`checklist-task-${checklistIndex}`} className={`list-group-item tamil-task-operational ${checklist.completed ? 'done' : 'to-do'} ${slugify(checklist.checklistCategory.name)}`}>
                                <div className="row">
                                  <div className="col-md-1">
                                    <button type="button" className="task-icon-bg ml-1 mt-1 border-0" onClick={() => toggleTaskStatus(checklist)}>
                                      <i className="bi bi-check2 text-muted"></i>
                                    </button>
                                  </div>
                                  <button type="button" className="col-md-11 btn p-0 text-left" onClick={() => openChecklistModal('edit', checklist)}>
                                    <div className="d-flex justify-content-between align-items-center gap-10">
                                      <div>
                                        <p className="task-title">{checklist.title}</p>
                                        <small className="badge badge-light text-muted fn-10">{checklist.checklistCategory.name}</small>
                                        {checklist.temporary && <small className="badge badge-light text-muted fn-10 ml-1">Temporary</small>}
                                      </div>
                                      {checklist.cost && <div><span className="bi bi-coin"></span> <span>{checklist.cost}</span></div>}
                                    </div>
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredDateGrouped.length === 0 && <div className="col-md-12 mt-5"><div className="list-group-item text-center text-muted">No checklist tasks match the selected filters.</div></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showChecklistAddUpdateModal && <div className="modal d-block" id="checklistAddUpdateModal" tabIndex="-1" aria-labelledby="checklistAddUpdateModalLabel">
        <div className="modal-dialog modal-lg couple-dashboard-step-modal">
          <div className="modal-content">
            <div className="modal-header fs-16px">
              <div className="modal-title">{editingId ? 'Edit task' : 'Add new task'}</div>
              <button className="btn p-0" type="button" onClick={closeChecklistModal}><span className="bi bi-x-lg"></span></button>
            </div>
            <div className="modal-body">
              <div className="row px-3">
                <div className="col-12">
                  <form className="auth-register-form mt-1" action="#" method="POST" onSubmit={submitTask}>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-4">
                          <input type="text" name="title" value={formTask.title} id="title" onChange={handleInputChange} placeholder="Name of the task" className="form-control own-input only-b-brdr-grey fs-24px dark-color fw-600" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-4">
                          <input type="text" name="description" value={formTask.description} id="description" onChange={handleInputChange} placeholder="Description of the task" className="form-control own-input only-b-brdr-grey" />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-sm-4 mb-4">
                            <select className="form-control" name="checklistCategory" value={formTask.checklistCategory.name} onChange={handleInputChange}>
                              {categoryGrouped.map((category) => <option key={category.name} value={category.name}>{category.name}</option>)}
                            </select>
                          </div>
                          <div className="col-sm-4 mb-4">
                            <select className="form-control" name="checklistFilter" value={formTask.checklistFilter.name} onChange={handleInputChange}>
                              {dateFilters.map((filter) => <option key={filter} value={filter}>{filter}</option>)}
                            </select>
                          </div>
                          <div className="col-sm-4 mb-4">
                            <label className="d-flex gap-5 align-items-center"><input type="checkbox" name="completed" checked={formTask.completed} onChange={handleInputChange} /> Done</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 d-flex gap-10">
                        <div className="py-2"><button type="submit" className="btn btn-primary">Submit</button></div>
                        {editingId && <div className="py-2"><button type="button" className="btn btn-outline-danger" onClick={deleteTask}>Delete</button></div>}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {showChecklistFiltersModal && <div className="modal d-block" id="checklistFiltersModal" tabIndex="-1" aria-labelledby="checklistFiltersModalLabel">
        <div className="modal-dialog modal-lg couple-dashboard-step-modal">
          <div className="modal-content">
            <div className="modal-header fs-16px">
              <div className="modal-title">Filters</div>
              <button className="btn p-0" type="button" onClick={() => setShowChecklistFiltersModal(false)}><span className="bi bi-x-lg"></span></button>
            </div>
            <div className="modal-body">
              <div className="px-3">{renderFilters()}</div>
              <div className="row mt-4">
                <div className="col-12 text-center">
                  <hr />
                  <div className="py-2"><button type="button" onClick={() => setShowChecklistFiltersModal(false)} className="btn btn-primary btn-sm">Done</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
}
