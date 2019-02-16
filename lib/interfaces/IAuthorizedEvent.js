export function isAuthorizedEvent(event) {
    return isUpperCaseAuthorizedEvent(event) || isLowerCaseAuthorizedEvent(event);
}
export function isAuthorizedEventBase(event) {
    return (event != null &&
        typeof event.httpMethod === 'string' &&
        event.headers != null);
}
export function isUpperCaseAuthorizedEvent(event) {
    return (isAuthorizedEventBase(event) &&
        (typeof event.headers.Authorization === 'string' ||
            (Array.isArray(event.headers.Authorization) &&
                event.headers.Authorization.length === 1 &&
                event.headers.Authorization.every(function (entry) { return typeof entry === 'string'; }))));
}
export function isLowerCaseAuthorizedEvent(event) {
    return (isAuthorizedEventBase(event) &&
        (typeof event.headers.authorization === 'string' ||
            (Array.isArray(event.headers.authorization) &&
                event.headers.authorization.length === 1 &&
                event.headers.authorization.every(function (entry) { return typeof entry === 'string'; }))));
}
//# sourceMappingURL=IAuthorizedEvent.js.map