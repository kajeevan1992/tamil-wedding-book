'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { budgetPlannerFallbackData } from '../../data/coupleDashboardData';

const blankCategory = { name: '', icon: 'bi-pie-chart', categoryExpenses: [] };
const blankExpense = { name: '', estimatedCost: 0, finalCost: 0, note: '', payments: [] };
const blankPayment = { amount: 0, paid: false, paidBy: '', paymentDate: '', dueDate: '' };

function currency(value) {
  return `£${Number(value || 0).toFixed(2)}`;
}

function sumExpenses(categories, key) {
  return categories.reduce((total, category) => total + category.categoryExpenses.reduce((categoryTotal, expense) => categoryTotal + Number(expense[key] || 0), 0), 0);
}

function sumPayments(categories, paid = null) {
  return categories.reduce((total, category) => total + category.categoryExpenses.reduce((expenseTotal, expense) => expenseTotal + expense.payments.reduce((paymentTotal, payment) => {
    if (paid !== null && payment.paid !== paid) return paymentTotal;
    return paymentTotal + Number(payment.amount || 0);
  }, 0), 0), 0);
}

function categoryTotal(category, key) {
  return category.categoryExpenses.reduce((total, expense) => total + Number(expense[key] || 0), 0);
}

function categoryPayments(category) {
  return category.categoryExpenses.reduce((total, expense) => total + expense.payments.reduce((paymentTotal, payment) => paymentTotal + Number(payment.amount || 0), 0), 0);
}

function getPathCategoryId() {
  if (typeof window === 'undefined') return null;
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] === 'budget-planner' ? null : parts[parts.length - 1];
}

export default function CoupleBudgetPlannerPage({ categoryRoute = false }) {
  const [budgetPlanner, setBudgetPlanner] = useState(budgetPlannerFallbackData);
  const [selectedTab, setSelectedTab] = useState('budget-planner');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(blankCategory);
  const [selectedPaymentExpenseId, setSelectedPaymentExpenseId] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentForm, setPaymentForm] = useState(blankPayment);
  const [noteModal, setNoteModal] = useState(null);

  const categories = budgetPlanner.budgetPlannerCategories;
  const pathCategoryId = getPathCategoryId();
  const selectedCategory = categoryRoute ? categories.find((category) => String(category.id) === String(pathCategoryId)) || categories[0] : null;
  const estimatedCost = sumExpenses(categories, 'estimatedCost');
  const finalCost = sumExpenses(categories, 'finalCost');
  const paidTotal = sumPayments(categories, true);
  const pendingTotal = sumPayments(categories, false);

  const chartData = useMemo(() => categories.map((category) => ({
    name: category.name,
    total: categoryTotal(category, 'finalCost'),
    percentage: finalCost ? Math.round((categoryTotal(category, 'finalCost') / finalCost) * 100) : 0,
  })), [categories, finalCost]);

  const openCategoryModal = (action = 'add', category = blankCategory) => {
    setEditingCategoryId(action === 'edit' ? category.id : null);
    setCategoryForm({ ...blankCategory, ...category });
    setShowCategoryModal(true);
  };

  const saveCategory = (event) => {
    event.preventDefault();
    if (!categoryForm.name.trim()) return;

    setBudgetPlanner((current) => ({
      ...current,
      budgetPlannerCategories: editingCategoryId
        ? current.budgetPlannerCategories.map((category) => (category.id === editingCategoryId ? { ...category, name: categoryForm.name, icon: categoryForm.icon } : category))
        : [...current.budgetPlannerCategories, { ...categoryForm, id: `temp-${Date.now()}`, name: categoryForm.name.trim(), categoryExpenses: [], temporary: true }],
    }));
    setShowCategoryModal(false);
  };

  const deleteCategory = (categoryId) => {
    setBudgetPlanner((current) => ({ ...current, budgetPlannerCategories: current.budgetPlannerCategories.filter((category) => category.id !== categoryId) }));
  };

  const updateCategoryExpenses = (categoryId, updater) => {
    setBudgetPlanner((current) => ({
      ...current,
      budgetPlannerCategories: current.budgetPlannerCategories.map((category) => (category.id === categoryId ? { ...category, categoryExpenses: updater(category.categoryExpenses) } : category)),
    }));
  };

  const addNewExpense = (categoryId) => {
    updateCategoryExpenses(categoryId, (expenses) => [...expenses, { ...blankExpense, id: `temp-expense-${Date.now()}`, temporary: true }]);
  };

  const updateExpense = (categoryId, expenseId, field, value) => {
    updateCategoryExpenses(categoryId, (expenses) => expenses.map((expense) => (expense.id === expenseId ? { ...expense, [field]: ['estimatedCost', 'finalCost'].includes(field) ? Number(value) : value } : expense)));
  };

  const deleteExpense = (categoryId, expenseId) => {
    updateCategoryExpenses(categoryId, (expenses) => expenses.filter((expense) => expense.id !== expenseId));
  };

  const openPaymentModal = (categoryId, expenseId, payment = blankPayment) => {
    setPaymentModal({ categoryId, expenseId, paymentId: payment.id || null });
    setPaymentForm({ ...blankPayment, ...payment });
  };

  const savePayment = (event) => {
    event.preventDefault();
    if (!paymentModal) return;
    updateCategoryExpenses(paymentModal.categoryId, (expenses) => expenses.map((expense) => {
      if (expense.id !== paymentModal.expenseId) return expense;
      return {
        ...expense,
        payments: paymentModal.paymentId
          ? expense.payments.map((payment) => (payment.id === paymentModal.paymentId ? { ...payment, ...paymentForm, amount: Number(paymentForm.amount || 0) } : payment))
          : [...expense.payments, { ...paymentForm, id: `temp-payment-${Date.now()}`, amount: Number(paymentForm.amount || 0), temporary: true }],
      };
    }));
    setPaymentModal(null);
  };

  const deletePayment = (categoryId, expenseId, paymentId) => {
    updateCategoryExpenses(categoryId, (expenses) => expenses.map((expense) => (expense.id === expenseId ? { ...expense, payments: expense.payments.filter((payment) => payment.id !== paymentId) } : expense)));
  };

  const togglePaymentStatus = (categoryId, expenseId, paymentId) => {
    updateCategoryExpenses(categoryId, (expenses) => expenses.map((expense) => (expense.id === expenseId ? { ...expense, payments: expense.payments.map((payment) => (payment.id === paymentId ? { ...payment, paid: !payment.paid } : payment)) } : expense)));
  };

  const updateNote = (event) => {
    event.preventDefault();
    if (!noteModal) return;
    updateExpense(noteModal.categoryId, noteModal.expenseId, 'note', noteModal.note);
    setNoteModal(null);
  };

  const renderSidebar = () => (
    <div className="mb-3">
      <div className="d-flex align-items-center mb-3">
        <h3 className="fw-600 mb-0">Categories</h3>
        <button type="button" onClick={() => openCategoryModal('add')} className="btn btn-sm text-theme"><span className="bi bi-plus-circle fs-20px"></span></button>
      </div>
      <button type="button" className="btn btn-outline-primary btn-block mb-2 btn-sm-collapse"><span className="bi bi-list"></span> Menu</button>
      <div className="sm-collapse show">
        <ul className="list-group">
          <li className="list-group-item p-1"><Link href="/couple/budget-planner" className="nav-link"><span className="mr-2 bi bi-pie-chart"></span><span>Stats</span></Link></li>
          {categories.map((category) => <li className="list-group-item p-1" key={category.id}><Link href={`/couple/budget-planner/${category.id}`} className="nav-link"><span className={`mr-2 bi ${category.icon}`}></span><span className="text-capitalize">{category.name}</span></Link></li>)}
        </ul>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="col-md-12 mt-11px">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-5 mt-2"><div className="d-flex justify-content-center align-items-center"><div className="text-center"><span className="bi bi-bank fs-24px"></span><h4 className="mt-3">Estimated Cost</h4><h3 className="fw-600 mt-3">{currency(estimatedCost)}</h3></div></div></div>
            <div className="col-2 d-flex justify-content-center"><div className="vertical-separator"></div></div>
            <div className="col-5 mt-2"><div className="d-flex justify-content-center align-items-center"><div className="text-center"><span className="bi bi-cash-coin fs-24px"></span><h4 className="mt-3">Final Cost</h4><h3 className="fw-600 text-theme mt-3">{currency(finalCost)}</h3><div className="d-flex justify-content-between mt-3"><div className="mx-2"><span className="fw-600">Paid:</span> {currency(paidTotal)}</div><div className="mx-2"><span className="fw-600">Pending:</span> {currency(pendingTotal)}</div></div></div></div></div>
            <div className="col-12"><hr /></div>
            <div className="col-12 mt-4">
              {chartData.map((item) => <div className="mb-3" key={item.name}><div className="d-flex justify-content-between"><strong>{item.name}</strong><span>{currency(item.total)} ({item.percentage}%)</span></div><div className="progress mt-1"><div className="progress-bar" role="progressbar" style={{ width: `${item.percentage}%`, backgroundColor: '#eb2327' }} aria-valuenow={item.percentage} aria-valuemin="0" aria-valuemax="100"></div></div></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategory = (category) => {
    const catEstimated = categoryTotal(category, 'estimatedCost');
    const catFinal = categoryTotal(category, 'finalCost');
    const remaining = catEstimated - catFinal;
    const remainingPercent = catEstimated ? Math.max(0, Math.round((remaining / catEstimated) * 100)) : 0;

    return (
      <div className="col-md-12 mt-11px">
        <div className="card"><div className="card-body"><div className="row">
          <div className="col-12 mt-2"><div className="d-flex justify-content-center align-items-center"><div className="text-center"><span className={`bi ${category.icon} fs-50px`}></span><h3 className="mt-3">{category.name}</h3><div className="d-flex gap-10 justify-content-center"><button type="button" onClick={() => openCategoryModal('edit', category)} className="btn btn-sm btn-outline-success"><span className="bi bi-pencil"></span></button><button type="button" onClick={() => deleteCategory(category.id)} className="btn btn-sm btn-outline-danger"><span className="bi bi-trash"></span></button></div><div className="d-flex justify-content-between mt-3"><div className="mx-2"><span className="fw-600">Estimated Cost:</span> {currency(catEstimated)}</div><div className="mx-2"><span className="fw-600">Final Cost:</span> {currency(catFinal)}</div></div><div className="progress mt-4"><div className="progress-bar" role="progressbar" style={{ width: `${remainingPercent}%`, backgroundColor: '#eb2327' }}>{currency(remaining)}</div></div></div></div></div>
          <div className="col-12 mt-5"><table className="table vertical-align-middle table-responsive"><thead><tr><th>Expenses</th><th className="text-right">Estimated Cost</th><th className="text-right">Final Cost</th><th className="text-right">Paid</th><th className="text-center">Note</th><th className="text-center">Action</th></tr></thead><tbody>{category.categoryExpenses.map((expense) => <tr key={expense.id}><td><input type="text" value={expense.name} className="hvr-fcs-b-1 no-focus b-0" placeholder="Expense Name" onChange={(event) => updateExpense(category.id, expense.id, 'name', event.target.value)} /></td><td><div className="d-flex align-items-center justify-content-end gap-4"><span>£</span><input type="number" value={expense.estimatedCost} className="hvr-fcs-b-1 no-counter no-focus b-0 text-right" onChange={(event) => updateExpense(category.id, expense.id, 'estimatedCost', event.target.value)} /></div></td><td><div className="d-flex align-items-center justify-content-end gap-4"><span>£</span><input type="number" value={expense.finalCost} className="hvr-fcs-b-1 no-counter no-focus b-0 text-right" onChange={(event) => updateExpense(category.id, expense.id, 'finalCost', event.target.value)} /></div></td><td className="text-right"><button type="button" onClick={() => setSelectedPaymentExpenseId(selectedPaymentExpenseId === expense.id ? null : expense.id)} className="btn btn-sm p-0 text-no-wrap"><span className={`bi bi-eye${selectedPaymentExpenseId === expense.id ? '-slash' : ''} text-danger`}></span> {currency(expense.payments.reduce((total, payment) => total + Number(payment.amount || 0), 0))}</button></td><td className="text-center"><button type="button" onClick={() => setNoteModal({ categoryId: category.id, expenseId: expense.id, note: expense.note || '' })} className="btn btn-sm"><span className="bi bi-pen fs-20px"></span></button></td><td className="text-center"><button type="button" onClick={() => deleteExpense(category.id, expense.id)} className="btn btn-sm"><span className="bi bi-trash text-danger"></span></button></td></tr>)}</tbody><tfoot><tr><td colSpan={6}><button type="button" onClick={() => addNewExpense(category.id)} className="btn btn-sm btn-link text-theme px-0"><span className="bi bi-plus-circle"></span> Add new expense</button></td></tr><tr><th>Total</th><th className="text-right">{currency(catEstimated)}</th><th className="text-right text-success">{currency(catFinal)}</th><th className="text-right">{currency(categoryPayments(category))}</th><th></th><th>&nbsp;</th></tr></tfoot></table></div>
          {category.categoryExpenses.map((expense) => selectedPaymentExpenseId === expense.id && <div className="col-12 bg-light pt-0" key={`payments-${expense.id}`}><table className="table table-sm"><tbody><tr className="no-bt"><th className="text-center">No.</th><th className="text-center">Amount</th><th>Detail</th><th className="text-center">Action</th></tr>{expense.payments.map((payment, index) => <tr key={payment.id}><td className="text-center text-danger">#{index + 1}</td><th className="text-center">{currency(payment.amount)}</th><td><small>{payment.paid ? <span className="text-success">Paid</span> : <span className="text-danger">Pending</span>}<br />{payment.paid ? payment.paymentDate : `Due on ${payment.dueDate}`}<br />{payment.paidBy && <span>By: {payment.paidBy}</span>}</small></td><td className="text-center"><button type="button" onClick={() => togglePaymentStatus(category.id, expense.id, payment.id)} className="btn btn-outline-primary btn-sm mr-2">{payment.paid ? 'Mark Pending' : 'Mark Paid'}</button><button type="button" onClick={() => openPaymentModal(category.id, expense.id, payment)} className="btn btn-outline-success btn-sm"><span className="bi bi-pencil"></span></button><button type="button" onClick={() => deletePayment(category.id, expense.id, payment.id)} className="btn btn-outline-danger btn-sm ml-2"><span className="bi bi-trash"></span></button></td></tr>)}</tbody><tfoot><tr><td colSpan={4} className="text-center vertical-middle"><button type="button" onClick={() => openPaymentModal(category.id, expense.id)} className="btn btn-sm btn-outline-primary mt-3"><span className="bi bi-plus"></span>Add Paymnet</button></td></tr></tfoot></table></div>)}
        </div></div></div>
      </div>
    );
  };

  const renderPayments = () => {
    const rows = categories.flatMap((category, categoryIndex) => category.categoryExpenses.flatMap((expense) => expense.payments.map((payment) => ({ category, categoryIndex, expense, payment }))));
    return <div className="col-md-12 mt-11px"><div className="card"><div className="card-header d-flex align-items-center"><strong>Show: &nbsp;</strong><ul className="nav">{['all', 'paid', 'pending'].map((type) => <li className={`nav-item ${paymentFilter === type ? 'active' : ''}`} key={type}><button type="button" onClick={() => setPaymentFilter(type)} className="btn btn-sm nav-link text-capitalize">{type}</button></li>)}</ul></div><div className="card-body"><table className="table"><thead><tr><th>Status</th><th>Expense</th><th>Details</th><th className="text-right">Amount</th><th className="text-center">Action</th></tr></thead><tbody>{rows.filter(({ payment }) => paymentFilter === 'all' || (paymentFilter === 'paid' && payment.paid) || (paymentFilter === 'pending' && !payment.paid)).map(({ category, expense, payment }) => <tr key={payment.id}><td className="va-middle">{payment.paid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-warning">Pending</span>}</td><td className="va-middle"><strong>{expense.name}</strong><br /><small className="text-muted">{category.name}</small></td><td className="text-muted va-middle"><small>{payment.paid ? payment.paymentDate : `Due on ${payment.dueDate}`}</small><br />{payment.paidBy && <small>By: {payment.paidBy}</small>}</td><td className="va-middle text-right">{currency(payment.amount)}</td><td className="va-middle text-center"><button type="button" onClick={() => openPaymentModal(category.id, expense.id, payment)} className="btn btn-outline-success btn-sm"><span className="bi bi-pencil"></span></button></td></tr>)}</tbody></table></div></div></div>;
  };

  return (
    <div className="container spacer mb-5">
      <div className="row">
        {selectedTab === 'budget-planner' && <div className="col-md-3">{renderSidebar()}</div>}
        <div className={`col-md-${selectedTab === 'budget-planner' ? 9 : 12}`}>
          <div className="row">
            <div className="col-md-12"><div className="d-flex align-items-center justify-content-between"><ul className="nav nav-tabs"><li className="nav-item"><button type="button" onClick={() => setSelectedTab('budget-planner')} className={`nav-link ${selectedTab === 'budget-planner' ? 'active' : ''}`}>Budget Planner</button></li><li className="nav-item"><button type="button" onClick={() => setSelectedTab('payments')} className={`nav-link ${selectedTab === 'payments' ? 'active' : ''}`}>Payments</button></li></ul><button type="button" className="btn btn-white btn-sm text-danger"><span className="bi bi-cloud-download"></span> PDF</button></div></div>
            <div className="col-md-12"><div className="row">{selectedTab === 'budget-planner' ? (selectedCategory ? renderCategory(selectedCategory) : renderStats()) : renderPayments()}</div></div>
          </div>
        </div>
      </div>

      {showCategoryModal && <div className="modal d-block" id="categoryActionModal" tabIndex="-1" aria-labelledby="categoryActionModal"><div className="modal-dialog couple-dashboard-step-modal"><div className="modal-content"><div className="modal-header fs-16px"><div className="modal-title text-capitalize">{editingCategoryId ? 'edit' : 'add'} Category</div><button className="btn p-0" type="button" onClick={() => setShowCategoryModal(false)}><span className="bi bi-x-lg"></span></button></div><div className="modal-body w-100"><form className="auth-register-form col-12" onSubmit={saveCategory}><div className="mb-4"><input className="form-control" value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} placeholder="Name" /><select className="form-control mt-3" value={categoryForm.icon} onChange={(event) => setCategoryForm((current) => ({ ...current, icon: event.target.value }))}><option value="bi-pie-chart">Pie chart</option><option value="bi-bank">Bank</option><option value="bi-cash-coin">Cash</option><option value="bi-camera">Camera</option></select></div><hr /><div className="d-flex justify-content-end"><button type="button" onClick={() => setShowCategoryModal(false)} className="btn btn-warning btn-sm mr-2">Cancel</button><button type="submit" className="btn btn-primary btn-sm">{editingCategoryId ? 'Update' : 'Add'}</button></div></form></div></div></div></div>}

      {paymentModal && <div className="modal d-block" id="expensePaymentModal" tabIndex="-1"><div className="modal-dialog couple-dashboard-step-modal"><div className="modal-content"><div className="modal-header fs-16px"><div className="modal-title">Payment</div><button className="btn p-0" type="button" onClick={() => setPaymentModal(null)}><span className="bi bi-x-lg"></span></button></div><div className="modal-body"><form onSubmit={savePayment}><div className="row"><div className="col-md-6 mb-3"><label>Amount</label><input className="form-control" type="number" value={paymentForm.amount} onChange={(event) => setPaymentForm((current) => ({ ...current, amount: event.target.value }))} /></div><div className="col-md-6 mb-3"><label>Status</label><select className="form-control" value={paymentForm.paid ? 'paid' : 'pending'} onChange={(event) => setPaymentForm((current) => ({ ...current, paid: event.target.value === 'paid' }))}><option value="paid">Paid</option><option value="pending">Pending</option></select></div><div className="col-md-6 mb-3"><label>Payment Date</label><input className="form-control" type="date" value={paymentForm.paymentDate} onChange={(event) => setPaymentForm((current) => ({ ...current, paymentDate: event.target.value }))} /></div><div className="col-md-6 mb-3"><label>Due Date</label><input className="form-control" type="date" value={paymentForm.dueDate} onChange={(event) => setPaymentForm((current) => ({ ...current, dueDate: event.target.value }))} /></div><div className="col-md-12 mb-3"><label>Paid By</label><input className="form-control" value={paymentForm.paidBy} onChange={(event) => setPaymentForm((current) => ({ ...current, paidBy: event.target.value }))} /></div></div><hr /><div className="d-flex justify-content-end"><button type="button" onClick={() => setPaymentModal(null)} className="btn btn-warning btn-sm mr-2">Cancel</button><button type="submit" className="btn btn-primary btn-sm">Save</button></div></form></div></div></div></div>}

      {noteModal && <div className="modal d-block" id="expenseNoteModal" tabIndex="-1"><div className="modal-dialog couple-dashboard-step-modal"><div className="modal-content"><div className="modal-header fs-16px"><div className="modal-title">Note</div><button className="btn p-0" type="button" onClick={() => setNoteModal(null)}><span className="bi bi-x-lg"></span></button></div><div className="modal-body"><form onSubmit={updateNote}><textarea className="form-control" rows="4" value={noteModal.note} onChange={(event) => setNoteModal((current) => ({ ...current, note: event.target.value }))}></textarea><hr /><div className="d-flex justify-content-end"><button type="button" onClick={() => setNoteModal(null)} className="btn btn-warning btn-sm mr-2">Cancel</button><button type="submit" className="btn btn-primary btn-sm">Save</button></div></form></div></div></div></div>}
    </div>
  );
}
