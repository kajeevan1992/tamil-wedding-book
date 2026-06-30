import { http } from './HttpService';

export function loadCategories() {
    return http().get('/categories/load-categories');
}