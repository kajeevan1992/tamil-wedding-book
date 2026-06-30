import { http, httpFile } from './HttpService';

export function getAllTests(companyId, PageNumber = 1, PageSize = 5, OrderBy = null, SearchTerm = null, SearchBy = null) {
    let url = `/test/get-tests?companyId=${companyId}&PageNumber=${PageNumber}&PageSize=${PageSize}`;

    if (OrderBy !== null) {
        url += `&OrderBy=${OrderBy}`;
    }
    if (SearchTerm !== null) {
        url += `&SearchTerm=${SearchTerm}`;
    }
    if (SearchBy !== null) {
        url += `&SearchBy=${SearchBy}`;
    }

    return http().get(url);
}

export function addTest(data) {
    return http().post('/test/add-test', data);
}

export function updateTest(data) {
    return http().post('/test/update-test', data);
}

export function deleteTest(id) {
    return http().delete(`/test/delete-test?Id=${id}`);
}