'use client';

import { useMemo, useState } from 'react';
import { checklistItems } from '../../data/coupleDashboardData';

const emptyTask = {
  title: '',
  category: '10-12 months',
  due: 'Before wedding',
  cost: '',
  status: 'Pending',
};

export default function CoupleChecklistPage() {
  const [tasks, setTasks] = useState(checklistItems);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formTask, setFormTask] = useState(emptyTask);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const completedCount = tasks.filter((task) => task.status === 'Done').length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'completed') return tasks.filter((task) => task.status === 'Done');
    if (statusFilter === 'pending') return tasks.filter((task) => task.status !== 'Done');
    return tasks;
  }, [statusFilter, tasks]);

  const groupedTasks = useMemo(() => filteredTasks.reduce((groups, task) => {
    groups[task.category] = groups[task.category] || [];
    groups[task.category].push(task);
    return groups;
  }, {}), [filteredTasks]);

  const resetForm = () => {
    setFormTask(emptyTask);
    setEditingId(null);
    setShowForm(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormTask((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
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

    resetForm();
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setFormTask({ title: task.title, category: task.category, due: task.due, cost: task.cost || '', status: task.status });
    setShowForm(true);
  };

  const toggleTask = (id) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status: task.status === 'Done' ? 'Pending' : 'Done' } : task)));
  };

  const deleteTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="container wide-tb-50">
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">Checklist Filters</h5>
              <div className="nav flex-column nav-pills budget-tab">
                {[
                  ['all', 'All'],
                  ['pending', 'Pending'],
                  ['completed', 'Completed'],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={`nav-link nav-list-item text-left ${statusFilter === value ? 'active' : ''}`}
                    onClick={() => setStatusFilter(value)}
                  >
                    <i className="tamilweddingbook_checklist"></i> <span>{label}</span>
                  </button>
                ))}
              </div>
              <hr />
              <h6 className="mb-2">Progress</h6>
              <div className="progress mt-1">
                <div className="progress-bar" role="progressbar" style={{ width: `${progressPercent}%`, backgroundColor: '#eb2327' }} aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <p className="mt-2 mb-0"><strong>{completedCount}</strong> of <strong>{tasks.length}</strong> tasks completed</p>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3>Checklist</h3>
              <p className="text-muted mb-0">Temporary frontend checklist. Changes stay in local React state only.</p>
            </div>
            <div>
              <button type="button" className="btn btn-sm btn-outline-primary mr-2">Download</button>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => setShowForm(true)}>Add Task</button>
            </div>
          </div>

          {showForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h5>{editingId ? 'Edit Task' : 'Add Task'}</h5>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3"><input className="form-control" name="title" value={formTask.title} onChange={handleInputChange} placeholder="Task name" /></div>
                    <div className="col-md-6 mb-3"><select className="form-control" name="category" value={formTask.category} onChange={handleInputChange}>{['12+ months', '10-12 months', '8-10 months', '6-8 months', '4-6 months', '2-4 months', '1 month', 'Wedding week', 'After wedding'].map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select></div>
                    <div className="col-md-4 mb-3"><input className="form-control" name="due" value={formTask.due} onChange={handleInputChange} placeholder="Due timing" /></div>
                    <div className="col-md-4 mb-3"><input className="form-control" name="cost" value={formTask.cost} onChange={handleInputChange} placeholder="Estimated cost" /></div>
                    <div className="col-md-4 mb-3"><select className="form-control" name="status" value={formTask.status} onChange={handleInputChange}><option value="Pending">Pending</option><option value="Done">Done</option></select></div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">{editingId ? 'Update Task' : 'Create Task'}</button>&nbsp;&nbsp;
                  <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>Cancel</button>
                </form>
              </div>
            </div>
          )}

          {Object.keys(groupedTasks).length === 0 && <div className="card"><div className="card-body text-center"><p className="text-muted mb-0">No checklist tasks match this filter.</p></div></div>}

          {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
            <div className="card-shadow pos-rel mb-4" key={category}>
              <div className="card-shadow-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">{category}</h5>
                  <small className="text-muted">{categoryTasks.filter((task) => task.status === 'Done').length} / {categoryTasks.length} completed</small>
                </div>
                <div className="row">
                  {categoryTasks.map((task) => (
                    <div className="col-md-12 mb-3" key={task.id}>
                      <div className="card">
                        <div className="card-body c-p p-095-09">
                          <div className="row align-items-center">
                            <div className="col-md-1 col-2 text-center">
                              <input type="checkbox" className="form-check-input w-h-17px theme-color-bg position-static" checked={task.status === 'Done'} onChange={() => toggleTask(task.id)} />
                            </div>
                            <div className="col-md-7 col-10">
                              <h6 className={`mb-1 ${task.status === 'Done' ? 'text-muted' : ''}`}>{task.title}</h6>
                              <small className="text-muted">{task.due}</small>
                              {task.temporary && <small className="text-theme ml-2">Temporary</small>}
                            </div>
                            <div className="col-md-2 col-6 mt-3 mt-md-0"><span className={`badge ${task.status === 'Done' ? 'bg-success' : 'bg-secondary'}`}>{task.status}</span></div>
                            <div className="col-md-2 col-6 text-right mt-3 mt-md-0">
                              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => editTask(task)}>Edit</button>&nbsp;
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
