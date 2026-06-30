import { http } from './HttpService';

export function searchSupplier(search) {
    return http().post('/user/vendors/search', search);
}

export function filterVendors(search) {
    return http().post('/user/vendors/filter', search);
}

export function loadVendor(id) {
    return http().get(`/user/vendors/${id}`);
}

export function loadNotifications() {
    return http().get('/user/notifications');
}

export function loadGallery(id) {
    return http().get(`/user/vendors/${id}/gallery`);
}

export function loadReviews(id) {
    return http().get(`/user/vendors/${id}/reviews`);
}

export function postReview(review) {
    return http().post(`/user/vendors/reviews`, review);
}

export function postPricingRequest(pricingRequest) {
    return http().post('/user/vendors/pricing-request', pricingRequest);
}
