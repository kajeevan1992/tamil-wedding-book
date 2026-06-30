import { http, httpFile } from './HttpService';
import { store } from '../store/Index';
import { authenticate } from "../store/AppSlice";

// My Wedding
export function loadWeddingData(coupleId) {
    return http().get(`/couple/account/wedding-details/${coupleId}`);
}
export function updateLastStepWeddingDetails(weddingDetails) {
    return http().post('/couple/account/update-laststep-wedding-details', weddingDetails);
}

export async function linkAccountInvitation(partner) {
    const response = await http().post('/couple/account/link-account-invitation', partner);
    if (response.status === 201) {
        store.dispatch(authenticate(response.data.user));
    }

    return response;
}

export async function removeLinkedAccount() {
    const response = await http().post('/couple/account/remove-linked-account');
    if (response.status === 200) {
        store.dispatch(authenticate(response.data.user));
    }

    return response;
}

export async function acceptLinkingAccountInvitation(hash) {
    const response = await http().post('/couple/account/accept-linking-account-invitation', hash);
    if (response.status === 200) {
        if (response.data.type === 'loggedInAndMatched' && response.data.user) {
            store.dispatch(authenticate(response.data.user));
        }
    }

    return response;
}

// Update profiles
export function updateProfileAndWeddingDetail(profile) {
    return httpFile().post('/couple/account/update-profile-and-wedding-detail', profile);
}

export function updateWeddingCardPhoto(photo) {
    return httpFile().post('/couple/account/update-wedding-card-photo', photo);
}

// Checklist
export function loadChecklists(coupleId) {
    return http().get(`/couple/checklist/load-checklists/${coupleId}`);
}
export function createUpdateChecklist(checklist) {
    return http().post('/couple/checklist/create-update-checklist', checklist);
}
// export function updateChecklist(checklist) {
//     return http().post('/couple/checklist/update-checklist', checklist);
// }
export function changeChecklistStatus(checklist) {
    return http().post('/couple/checklist/change-checklist-status', checklist);
}
export function deleteChecklist(checklist) {
    return http().post('/couple/checklist/delete-checklist', checklist);
}

// Vendors
export function loadSuppliers(coupleId) {
    return http().get(`/couple/suppliers/load-suppliers/${coupleId}`);
}
export function loadVendorsByCategory(coupleId, vendorCategoryId) {
    return http().get(`/couple/suppliers/load-vendors/${coupleId}/${vendorCategoryId}`);
}
export function storeSupplier(supplier) {
    return http().post('/couple/suppliers/store-supplier', supplier);
}
export function searchSupplier(search) {
    return http().post('/couple/suppliers/search', search);
}
export function createAndInviteVendor(vendor) {
    return http().post('/couple/suppliers/create-and-invite-vendor', vendor);
}
export function changeSelectedVendor(vendor) {
    return http().post('/couple/suppliers/change-selected-vendor', vendor);
}
export function removeSelectedVendor(vendor) {
    return http().post('/couple/suppliers/remove-selected-vendor', vendor);
}

// Guestlist
export function loadGuestsData(coupleId) {
    return http().get(`/couple/guests/load-guests/${coupleId}`);
}
export function createUpdateEvent(event) {
    return http().post('/couple/guests/create-update-event', event);
}
export function deleteEventOption(data) {
    return http().post('/couple/guests/delete-event-option', data);
}
export function deleteEvent(eventId) {
    return http().post(`/couple/guests/delete-event/${eventId}`);
}
export function loadSelectedFilterData(data) {
    return http().post('/couple/guests/load-selected-filter-data', data);
}
export function createUpdateItem(item) {
    return http().post('/couple/guests/create-update-item', item);
}
export function deleteCollectionItem(item) {
    return http().post('/couple/guests/delete-item', item);
}
export function addGuest(guest) {
    return http().post('/couple/guests/add-guest', guest);
}
export function updateGuest(guest) {
    return http().post('/couple/guests/update-guest', guest);
}
export function actionOnCompanion(data) {
    return http().post('/couple/guests/action-on-companion', data);
}
export function deleteGuestWithCompanions(guest) {
    return http().delete(`/couple/guests/delete-guest-with-companions/${guest.id}`);
}
export function actionOnMultipleSelectedGuests(guests) {
    return http().post('/couple/guests/action-on-multiple-guests', guests);
}
export function changeGuestEventStatus(data) {
    return http().post('/couple/guests/change-guest-event-status', data);
}
export function bulkCreateBySpreadsheet(data) {
    return httpFile().post('/couple/guests/bulk-create-by-spreadsheet', data);
}

//? Guest invitation by link
export function addGuestByLink(data) {
    return http().post('/couple/guests/add-guest-by-link', data);
}

// Seating chart
export function loadWeddingEvents(coupleId) {
    return http().get(`/couple/seating-chart/load-wedding-events/${coupleId}`);
}
export function loadEventTablesAndGuests(eventId) {
    return http().get(`/couple/seating-chart/load-event-tables-and-guests/${eventId}`);
}
export function setTablePosition(data) {
    return http().post('/couple/seating-chart/set-table-position', data);
}
export function setGuestSeat(data) {
    return http().post('/couple/seating-chart/set-guest-seat', data);
}
export function unSeatGuest(data) {
    return http().post('/couple/seating-chart/un-seat-guest', data);
}
export function deleteTable(eventId, tableId) {
    return http().delete(`/couple/seating-chart/delete-table/${eventId}/${tableId}`);
}

export function changeWindowSize(data) {
    return http().post('/couple/seating-chart/change-window-height', data);
}

// Budget Planner
export function loadBudgetPlanner(coupleId) {
    return http().get(`/couple/budget-planner/load/${coupleId}`);
}
// export function loadBudgetPlannerCategory(coupleId, id) {
//     return http().get(`/couple/budget-planner/load-category/${coupleId}/${id}`);
// }
export function budgetPlannerCategoryAction(item) {
    return http().post('/couple/budget-planner/create-update-category', item);
}
export function deleteBudgetPlannerCategory(categoryId) {
    return http().delete(`/couple/budget-planner/delete-category/${categoryId}`);
}
export function createUpdateExpense(item) {
    return http().post('/couple/budget-planner/create-update-expense', item);
}
export function deleteExpense(expenseId) {
    return http().delete(`/couple/budget-planner/delete-expense/${expenseId}`);
}
export function createUpdateExpensePayment(payment) {
    return http().post('/couple/budget-planner/create-update-expense-payment', payment);
}
export function deleteExpensePayment(paymentId) {
    return http().delete(`/couple/budget-planner/delete-expense-payment/${paymentId}`);
}
// export function loadBudgetPlannerPayments(coupleId) {
//     return http().get(`/couple/budget-planner/load-payments/${coupleId}`);
// }