// export function isEmpty(value) {
//     return value.trim() == '' ? true : false;

import moment from "moment";

// }
export function isEmpty(value) {
    return !value;
}
export function capitalize(word) {
    return word.charAt(0).toUpperCase();
}
export function ucFirst(word) {
    if (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}
export function isNotEmail(email) {
    let atpos = email.indexOf("@");
    let dotpos = email.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
        return true;
    } else {
        return false;
    }
}
export function isMinLength(value, minLength) {
    const stringValue = typeof value === 'string' ? value.trim() : String(value);
    return (value && stringValue.length < minLength ? true : false);
}
export function isLessThan(value, min) {
    const stringValue = typeof value === 'string' ? value.trim() : String(value);
    return (value && stringValue.length < min ? true : false);
}
export function maxLength(value, maxLength) {
    const stringValue = typeof value === 'string' ? value.trim() : String(value);
    return (value && stringValue.length > maxLength ? true : false);
}
export function isGreaterThan(value, length) {
    const stringValue = typeof value === 'string' ? value.trim() : String(value);
    return (value && stringValue.length > length ? true : false);
}
export function isNotSame(first, second) {
    return (first !== second ? true : false);
}
export function isNotEmptyArray(array) {
    return (Array.isArray(array) && array.length) ? true : false;
}

export function isDate(value) {
    return moment(value, 'YYYY-MM-DD', true).isValid();
}
