import { http, httpFile } from "./HttpService";
// import { getUserId } from './AuthService';

export function loadStoreFrontInitials() {
    return http().get("/vendor/storefront/store-front-initials");
}

export function updateStoreFront(data) {
    return httpFile().post("/vendor/storefront/store-front-initials", data);
}

export function deleteStorefrontImage(file) {
    return http().post("/vendor/storefront/delete-storefront-image", file);
}

export function updateFaqs(faqs) {
    return http().post("/vendor/storefront/update-faqs", faqs);
}

export function getSocialLinks(vendorId) {
    return http().get(`/vendor/storefront/get-social-links/${vendorId}`);
}

export function updateSocialLinks(vendorId, data) {
    return http().post(
        `/vendor/storefront/update-social-links/${vendorId}`,
        data
    );
}

// Events
export function loadEvents(vendorId, itemsPerPage, page) {
    return http().get(
        `/vendor/storefront/events/${vendorId}?itemsPerPage=${itemsPerPage}${
            page ? `&page=${page}` : ""
        }`
    );
}

export function createEvent(event) {
    return httpFile().post(`/vendor/storefront/events`, event);
}

export function updateEvent(id, event) {
    return httpFile().post(`/vendor/storefront/events/${id}`, event);
}

export function deleteEvent(id) {
    return http().delete(`/vendor/storefront/events/${id}`);
}

//Deals
export function loadDeals(vendorId, itemsPerPage, page) {
    return http().get(
        `/vendor/storefront/deals/${vendorId}?itemsPerPage=${itemsPerPage}${
            page ? `&page=${page}` : ""
        }`
    );
}

export function createDeal(deal) {
    return httpFile().post(`/vendor/storefront/deals`, deal);
}

export function updateDeal(id, deal) {
    return httpFile().post(`/vendor/storefront/deals/${id}`, deal);
}

export function deleteDeal(id) {
    return http().delete(`/vendor/storefront/deals/${id}`);
}

// Menus
export function loadMenus(vendorId, itemsPerPage, page) {
    return http().get(
        `/vendor/storefront/menus/${vendorId}?itemsPerPage=${itemsPerPage}${
            page ? `&page=${page}` : ""
        }`
    );
}

export function createMenu(menu) {
    return httpFile().post(`/vendor/storefront/menus`, menu);
}

export function updateMenu(id, menu) {
    return httpFile().post(`/vendor/storefront/menus/${id}`, menu);
}

export function deleteMenu(id) {
    return http().delete(`/vendor/storefront/menus/${id}`);
}

// Preferred Vendors
export function loadPreferredVendors(vendorId) {
    return http().get(`/vendor/storefront/preferred-vendor/${vendorId}`);
}

// export function searchPreferVendor(search, page) {
//     return http().post(`/vendor/storefront/preferred-vendor/search${page ? `?page=${page}` : ''}`, search);
// }

export function searchPreferVendor(search) {
    return http().post("/vendor/storefront/preferred-vendor/search", search);
}

export function preferVendor(vendorId) {
    return http().post(`/vendor/storefront/preferred-vendor`, vendorId);
}

export function createAndInviteVendor(vendor) {
    return http().post("/vendor/storefront/create-and-invite-vendor", vendor);
}

export function deletePreferredVendor(id) {
    return http().delete(`/vendor/storefront/preferred-vendor/${id}`);
}

export function acceptPreferredVendorInvitation(id) {
    return http().post(`/vendor/storefront/preferred-vendor/${id}`);
}

// Settings
export function getSettings(vendorId) {
    return http().get(`/vendor/settings/${vendorId}`);
}

export function updateSettings(id, data) {
    return http().post(`/vendor/settings/${id}`, data);
}

// Reviews
export function reviewRequest(data) {
    return http().post("/vendor/reviews/request", data);
}

export function loadReviews(vendorId) {
    return http().get(`/vendor/reviews/${vendorId}`);
}
// Enquiries
export function loadEnquiries(vendorId, itemsPerPage, page, filter = null) {
    let queryParams = `itemsPerPage=${itemsPerPage}`;
    if (page) {
        queryParams += `&page=${page}`;
    }
    if (filter) {
        queryParams += `&filter=${filter}`;
    }
    return http().get(`/vendor/enquiries/${vendorId}?${queryParams}`);
}

export function loadEnquiry(vendorId, enquiryId) {
    return http().get(`/vendor/enquiries/${vendorId}/${enquiryId}`);
}

export function postEnquiryReply(reply) {
    return http().post("/vendor/enquiries/reply", reply);
}

export function deleteEnquiry(vendorId, enquiryId) {
    return http().delete(`/vendor/enquiries/${vendorId}/${enquiryId}`);
}

export function exportToExcel(vendorId, filter = null) {
    const axiosInstance = http();
    let queryParams = `vendorId=${vendorId}`;
    if (filter) {
        queryParams += `&filter=${filter}`;
    }
    return axiosInstance.get(`/vendor/enquiries/export?${queryParams}`, {
        responseType: "blob", // Important for file downloads
    });
}
