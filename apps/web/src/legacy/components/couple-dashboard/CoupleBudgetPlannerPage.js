'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { budgetPlannerFallbackData } from '../../data/coupleDashboardData';

const blankExpense = {
  name: '',
  estimatedCost: 0,
  finalCost: 0,
  note: '',
  payments: [],
};

const blankPayment = {
  amount: 0,
  paid: true,
  paymentDate: '2026-07-01',
  dueDate: '2026-07-01',
  paidBy: '',
  paymentMethod: '',
};

function currency(value) {
  return `£${Number(value || 0).toFixed(2)}`;
}

function categoryTotals(category) {
  const estimated = category?.categoryExpenses.reduce((total, expense) => total + Number(expense.estimatedCost || 0), 0) || 0;
  const final = category?.categoryExpenses.reduce((total, expense) => total + Number(expense.finalCost || 0), 0) || 0;
  const paid = category?.categoryExpenses.reduce((total, expense) => total + expense.payments.filter((payment) => payment.paid).reduce((sum, payment) => sum + Number(payment.amount || 0), 0), 0) || 0;
  const pending = category?.categoryExpenses.reduce((total, expense) => total + expense.payments.filter((payment) => !payment.paid).reduce((sum, payment) => sum + Number(payment.amount || 0), 0), 0) || 0;
  return { estimated, final, paid, pending, remaining: Math.max(final - paid, 0) };
}

function plannerTotals(planner) {
  return planner.budgetPlannerCategories.reduce((totals, category) => {
    const categoryTotal = categoryTotals(category);
    return {
      estimated: totals.estimated + categoryTotal.estimated,
      final: totals.final + categoryTotal.final,
      paid: totals.paid + categoryTotal.paid,
      pending: totals.pending + categoryTotal.pending,
      remaining: totals.remaining + categoryTotal.remaining,
    };
  }, { estimated: 0, final: 0, paid: 0, pending: 0, remaining: 0 });
}

export default function CoupleBudgetPlannerPage({ category = false }) {
  const params = useParams();
  const [budgetPlanner, setBudgetPlanner] = useState(budgetPlannerFallbackData);
  const [selectedTab, setSelectedTab] = useState('budget-planner');
  const [searchValue, setSearchValue] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showCategoryActionModal, setShowCategoryActionModal] = useState(false);
  const [showExpensePaymentModal, setShowExpensePaymentModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'bi bi-heart' });
  const [paymentContext, setPaymentContext] = useState(null);
  const [paymentForm, setPaymentForm] = useState(blankPayment);

  const selectedCategory = useMemo(() => {
    const id = params?.id ? Number(params.id) : null;
    return id ? budgetPlanner.budgetPlannerCategories.find((item) => item.id === id) : null;
  }, [budgetPlanner, params]);

  const totals = plannerTotals(budgetPlanner);

  const updateCategory = (categoryId, updater) => {
    setBudgetPlanner((current) => ({
      ...current,
      budgetPlannerCategories: current.budgetPlannerCategories.map((item) => (item.id === categoryId ? updater(item) : item)),
    }));
  };

  const addNewExpense = () => {
    if (!selectedCategory) return;
    updateCategory(selectedCategory.id, (item) => ({
      ...item,
      categoryExpenses: [...item.categoryExpenses, { ...blankExpense, id: `temp-expense-${Date.now()}`, temporary: true }],
    }));
  };

  const updateExpense = (categoryId, expenseId, field, value) => {
    updateCategory(categoryId, (item) => ({
      ...item,
      categoryExpenses: item.categoryExpenses.map((expense) => (expense.id === expenseId ? { ...expense, [field]: value } : expense)),
    }));
  };

  const deleteExpense = (categoryId, expenseId) => {
    updateCategory(categoryId, (item) => ({ ...item, categoryExpenses: item.categoryExpenses.filter((expense) => expense.id !== expenseId) }));
  };

  const openCategoryModal = (action, item = { name: '', icon: 'bi bi-heart' }) => {
    setEditingCategoryId(action === 'edit' ? item.id : null);
    setCategoryForm({ name: item.name || '', icon: item.icon || 'bi bi-heart' });
    setShowCategoryActionModal(true);
  };

  const saveCategory = (event) => {
    event.preventDefault();
    if (!categoryForm.name.trim()) return;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, (item) => ({ ...item, ...categoryForm, name: categoryForm.name.trim() }));
    } else {
      setBudgetPlanner((current) => ({
        ...current,
        budgetPlannerCategories: [...current.budgetPlannerCategories, { id: Date.now(), ...categoryForm, name: categoryForm.name.trim(), categoryExpenses: [], temporary: true }],
      }));
    }

    setShowCategoryActionModal(false);
  };

  const deleteCategory = () => {
    if (!selectedCategory) return;
    setBudgetPlanner((current) => ({ ...current, budgetPlannerCategories: current.budgetPlannerCategories.filter((item) => item.id !== selectedCategory.id) }));
  };

  const openPaymentModal = (categoryId, expense, payment = null) => {
    setPaymentContext({ categoryId, expenseId: expense.id, paymentId: payment?.id || null, expenseName: expense.name });
    setPaymentForm(payment || { ...blankPayment, amount: expense.finalCost || 0 });
    setShowExpensePaymentModal(true);
  };

  const savePayment = (event) => {
    event.preventDefault();
    if (!paymentContext) return;

    updateCategory(paymentContext.categoryId, (categoryItem) => ({
      ...categoryItem,
      categoryExpenses: categoryItem.categoryExpenses.map((expense) => {
        if (expense.id !== paymentContext.expenseId) return expense;
        const payment = { ...paymentForm, amount: Number(paymentForm.amount || 0), id: paymentContext.paymentId || `temp-payment-${Date.now()}`, temporary: true };
        return {
          ...expense,
          payments: paymentContext.paymentId ? expense.payments.map((item) => (item.id === paymentContext.paymentId ? payment : item)) : [...expense.payments, payment],
        };
      }),
    }));

    setShowExpensePaymentModal(false);
  };

  const togglePaymentStatus = (categoryId, expenseId, paymentId) => {
    updateCategory(categoryId, (categoryItem) => ({
      ...categoryItem,
      categoryExpenses: categoryItem.categoryExpenses.map((expense) => (expense.id === expenseId
        ? { ...expense, payments: expense.payments.map((payment) => (payment.id === paymentId ? { ...payment, paid: !payment.paid } : payment)) }
        : expense)),
    }));
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
          {budgetPlanner.budgetPlannerCategories.map((item) => <li className="list-group-item p-1" key={item.id}><Link href={`/couple/budget-planner/${item.id}`} className="nav-link"><span className={`mr-2 ${item.icon}`}></span><span className="text-capitalize">{item.name}</span></Link></li>)}
        </ul>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="col-md-12">
      <div className="d-flex align-items-center justify-content-between">
        <ul className="nav nav-tabs">
          <li className="nav-item"><button type="button" onClick={() => setSelectedTab('budget-planner')} className={`nav-link ${selectedTab === 'budget-planner' ? 'active' : ''}`}>Budget Planner</button></li>
          <li className="nav-item"><button type="button" onClick={() => setSelectedTab('payments')} className={`nav-link ${selectedTab === 'payments' ? 'active' : ''}`}>Payments</button></li>
        </ul>
        <button type="button" className="btn btn-white btn-sm text-danger"><span className="bi bi-cloud-download"></span> PDF</button>
      </div>
    </div>
  );

  const renderStatsHeader = () => (
    <>
      <div className="col-5 mt-2"><div className="d-flex justify-content-center align-items-center"><div className="text-center"><span className="bi bi-bank fs-24px"></span><h4 className="mt-3">Estimated Cost</h4><h3 className="fw-600 mt-3">{currency(totals.estimated)}</h3></div></div></div>
      <div className="col-2 d-flex justify-content-center"><div className="vertical-separator"></div></div>
      <div className="col-5 mt-2"><div className="d-flex justify-content-center align-items-center"><div className="text-center"><span className="bi bi-cash-coin fs-24px"></span><h4 className="mt-3">Final Cost</h4><h3 className="fw-600 text-theme mt-3">{currency(totals.final)}</h3><div className="d-flex justify-content-between mt-3"><div className="mx-2"><span className="fw-600">Paid:</span> {currency(totals.paid)}</div><div className="mx-2"><span className="fw-600">Pending:</span> {currency(totals.pending)}</div></div></div></div></div>
    </>
  );

  const renderStats = () => (
    <div className="col-md-12 mt-11px">
      <div className="card"><div className="card-body"><div className="row">{renderStatsHeader()}<div className="col-12"><hr /></div><div className="col-12 mt-4"><div className="row">{budgetPlanner.budgetPlannerCategories.map((item) => { const itemTotals = categoryTotals(item); const width = totals.final ? Math.round((itemTotals.final / totals.final) * 100) : 0; return <div className="col-md-6 mb-3" key={item.id}><div className="d-flex justify-content-between"><strong><span className={`${item.icon} mr-1`}></span>{item.name}</strong><span>{currency(itemTotals.final)}</span></div><div className="progress mt-1"><div className="progress-bar" style={{ width: `${width}%`, backgroundColor: '#eb2327' }}></div></div></div>; })}</div></div></div></div></div>
    </div>
  );

  const renderCategory = () => {
    if (!selectedCategory) return <div className="col-md-12 mt-11px"><div className="card"><div className="card-body text-center text-muted">Budget category not found.</div></div></div>;
    const totalsForCategory = categoryTotals(selectedCategory);
    const filteredExpenses = selectedCategory.categoryExpenses.filter((expense) => expense.name.toLowerCase().includes(searchValue.toLowerCase()));

    return (
      <div className="col-md-12 mt-11px">
        <div className="card"><div className="card-body"><div className="row">
          <div className="col-md-12"><div className="d-flex justify-content-between align-items-center"><div><h3><span className={`${selectedCategory.icon} mr-2`}></span>{selectedCategory.name}</h3><small>Estimated Cost : {currency(totalsForCategory.estimated)} &nbsp; Final Cost : {currency(totalsForCategory.final)}</small></div><div><button type="button" onClick={() => openCategoryModal('edit', selectedCategory)} className="btn btn-outline-primary btn-sm mr-2"><span className="bi bi-pencil"></span> Category</button><button type="button" onClick={deleteCategory} className="btn btn-outline-danger btn-sm"><span className="bi bi-trash"></span></button></div></div></div>
          <div className="col-md-12 mt-3"><div className="d-flex justify-content-between sm-block-100"><input className="form-control py-2 w-300px bg-white sm-w-100" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search Expenses" /><button type="button" onClick={addNewExpense} className="btn btn-primary btn-sm mx-1"><span className="bi bi-plus-lg"></span> Add Expense</button></div></div>
          <div className="col-12 mt-5"><table className="table vertical-align-middle table-responsive"><thead><tr><th>Expenses</th><th className="text-right">Estimated Cost</th><th className="text-right">Final Cost</th><th className="text-right">Paid</th><th className="text-center">Note</th><th className="text-center">Action</th></tr></thead><tbody>{filteredExpenses.map((expense) => <tr key={expense.id}><td><input type="text" name="name" value={expense.name} className="hvr-fcs-b-1 no-focus b-0" placeholder="Expense Name" onChange={(event) => updateExpense(selectedCategory.id, expense.id, 'name', event.target.value)} />{expense.temporary && <small className="badge badge-light text-muted fn-10 ml-1">Temporary</small>}</td><td><div className="d-flex align-items-center justify-content-end gap-4"><span>£</span><input type="number" name="estimatedCost" value={expense.estimatedCost} className="hvr-fcs-b-1 no-counter no-focus b-0 text-right" onChange={(event) => updateExpense(selectedCategory.id, expense.id, 'estimatedCost', Number(event.target.value))} /></div></td><td><div className="d-flex align-items-center justify-content-end gap-4"><span>£</span><input type="number" name="finalCost" value={expense.finalCost} className="hvr-fcs-b-1 no-counter no-focus b-0 text-right" onChange={(event) => updateExpense(selectedCategory.id, expense.id, 'finalCost', Number(event.target.value))} /></div></td><td className="text-right"><button type="button" onClick={() => setSelectedPayment(selectedPayment === expense.id ? null : expense.id)} className="btn btn-sm p-0 text-no-wrap"><span className={`bi bi-eye${selectedPayment === expense.id ? '-slash' : ''} text-danger`}></span> {currency(expense.payments.filter((payment) => payment.paid).reduce((sum, payment) => sum + Number(payment.amount || 0), 0))}</button></td><td className="text-center"><button type="button" className="btn btn-sm"><span className="bi bi-pen fs-20px"></span></button></td><td className="text-center"><button type="button" onClick={() => deleteExpense(selectedCategory.id, expense.id)} className="btn btn-sm"><span className="bi bi-trash text-danger"></span>&nbsp; Delete</button></td></tr>)}</tbody></table></div>
          {selectedCategory.categoryExpenses.map((expense) => selectedPayment === expense.id && <div className="col-12 bg-light pt-2" key={`payments-${expense.id}`}><table className="table table-sm"><tbody><tr className="no-bt"><th className="text-center">No.</th><th className="text-center">Amount</th><th>Detail</th><th className="text-center">Action</th></tr>{expense.payments.map((payment, indexPayment) => <tr key={payment.id}><td className="text-center text-danger">#{indexPayment + 1}</td><th className="text-center">{currency(payment.amount)}</th><td>{payment.paid ? <small>{payment.paymentDate} <br /> {payment.paymentMethod}</small> : <small>Due on {payment.dueDate}</small>}<br />{payment.paidBy && <small>By: {payment.paidBy}</small>}</td><td className="text-center"><button type="button" onClick={() => togglePaymentStatus(selectedCategory.id, expense.id, payment.id)} className={`btn btn-outline-${payment.paid ? 'success' : 'warning'} btn-sm mr-2`}>{payment.paid ? 'Paid' : 'Pending'}</button><button type="button" onClick={() => openPaymentModal(selectedCategory.id, expense, payment)} className="btn btn-outline-success btn-sm"><span className="bi bi-pencil"></span></button></td></tr>)}<tr><td colSpan={4} className="text-center"><button type="button" onClick={() => openPaymentModal(selectedCategory.id, expense)} className="btn btn-primary btn-sm">Add Payment</button></td></tr></tbody></table></div>)}
        </div></div></div>
      </div>
    );
  };

  const renderPayments = () => (
    <div className="col-md-12 mt-11px"><div className="card"><div className="card-body table-responsive"><table className="table"><thead><tr><th>Status</th><th>Expense</th><th>Detail</th><th className="text-right">Amount</th><th className="text-center">Action</th></tr></thead><tbody>{budgetPlanner.budgetPlannerCategories.flatMap((categoryItem) => categoryItem.categoryExpenses.flatMap((expense) => expense.payments.map((payment) => <tr key={`${expense.id}-${payment.id}`}><td className="va-middle">{payment.paid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-warning">Pending</span>}</td><td className="va-middle"><strong>{expense.name}</strong><br /><small className="text-muted">{categoryItem.name}</small></td><td className="text-muted va-middle">{payment.paid ? <small>{payment.paymentDate}<br />{payment.paymentMethod}</small> : <small>Due on {payment.dueDate}</small>}<br />{payment.paidBy && <small>By: {payment.paidBy}</small>}</td><td className="va-middle text-right">{currency(payment.amount)}</td><td className="va-middle text-center"><button type="button" onClick={() => togglePaymentStatus(categoryItem.id, expense.id, payment.id)} className="btn btn-outline-success btn-sm"><span className="bi bi-pencil"></span></button></td></tr>)))}</tbody></table></div></div></div>
  );

  return (
    <>
      <div className="container spacer mb-5"><div className="row">{selectedTab === 'budget-planner' && <div className="col-md-3">{renderSidebar()}</div>}<div className={`col-md-${selectedTab === 'budget-planner' ? 9 : 12}`}><div className="row">{renderHeader()}<div className="col-md-12"><div className="row">{selectedTab === 'budget-planner' ? (category ? renderCategory() : renderStats()) : renderPayments()}</div></div></div></div></div></div>

      {showCategoryActionModal && <div className="modal d-block" id="categoryActionModal" tabIndex="-1" aria-labelledby="categoryActionModal"><div className="modal-dialog couple-dashboard-step-modal"><div className="modal-content"><div className="modal-header fs-16px"><div className="modal-title text-capitalize">{editingCategoryId ? 'edit' : 'add'} Category</div><button className="btn p-0" type="button" onClick={() => setShowCategoryActionModal(false)}><span className="bi bi-x-lg"></span></button></div><div className="modal-body w-100"><div className="row mr-0 ml-0 w-100"><div className="col-12 w-100"><form className="auth-register-form col-12" action="#" method="POST" onSubmit={saveCategory}><div className="mb-4"><input className="form-control mb-3" name="name" value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} placeholder="Name" /><select className="form-control" value={categoryForm.icon} onChange={(event) => setCategoryForm((current) => ({ ...current, icon: event.target.value }))}><option value="bi bi-heart">Heart</option><option value="bi bi-bank">Bank</option><option value="bi bi-camera">Camera</option><option value="bi bi-flower1">Flower</option></select></div><hr /><div className="d-flex justify-content-end"><button type="button" onClick={() => setShowCategoryActionModal(false)} className="btn btn-warning btn-sm mr-2">Cancel</button><button type="submit" className="btn btn-primary btn-sm">{editingCategoryId ? 'Update' : 'Add'}</button></div></form></div></div></div></div></div></div>}

      {showExpensePaymentModal && <div className="modal d-block" id="expensePaymentModal" tabIndex="-1" aria-labelledby="expensePaymentModal"><div className="modal-dialog couple-dashboard-step-modal"><div className="modal-content"><div className="modal-header fs-16px"><div className="modal-title text-capitalize">{paymentContext?.paymentId ? 'edit' : 'add'} Payment {paymentContext?.paymentId ? 'of' : 'to'} {paymentContext?.expenseName}</div><button className="btn p-0" type="button" onClick={() => setShowExpensePaymentModal(false)}><span className="bi bi-x-lg"></span></button></div><div className="modal-body w-100"><form className="auth-register-form col-12" action="#" method="POST" onSubmit={savePayment}><div className="row"><div className="col-sm-8 mb-4"><input type="number" className="form-control" name="amount" value={paymentForm.amount} onChange={(event) => setPaymentForm((current) => ({ ...current, amount: event.target.value }))} placeholder="Amount" /></div><div className="col-sm-4 mb-4 mt-2"><label><input type="checkbox" checked={paymentForm.paid} onChange={(event) => setPaymentForm((current) => ({ ...current, paid: event.target.checked }))} /> Paid</label></div><div className="col-sm-6 mb-4"><input type="date" className="form-control" value={paymentForm.paymentDate} onChange={(event) => setPaymentForm((current) => ({ ...current, paymentDate: event.target.value }))} /></div><div className="col-sm-6 mb-4"><input type="date" className="form-control" value={paymentForm.dueDate} onChange={(event) => setPaymentForm((current) => ({ ...current, dueDate: event.target.value }))} /></div><div className="col-sm-6 mb-4"><input className="form-control" value={paymentForm.paidBy} onChange={(event) => setPaymentForm((current) => ({ ...current, paidBy: event.target.value }))} placeholder="Paid By" /></div><div className="col-sm-6 mb-4"><input className="form-control" value={paymentForm.paymentMethod} onChange={(event) => setPaymentForm((current) => ({ ...current, paymentMethod: event.target.value }))} placeholder="Payment Method" /></div></div><hr /><div className="d-flex justify-content-end"><button type="button" onClick={() => setShowExpensePaymentModal(false)} className="btn btn-warning btn-sm mr-2">Cancel</button><button type="submit" className="btn btn-primary btn-sm">{paymentContext?.paymentId ? 'Update' : 'Add'}</button></div></form></div></div></div></div>}
    </>
  );
}
