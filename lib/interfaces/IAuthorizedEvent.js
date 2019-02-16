export function isAuthorizedEvent(event, isTokenPayload) {
    return (isUpperCaseAuthorizedEvent(event, isTokenPayload) ||
        isLowerCaseAuthorizedEvent(event, isTokenPayload));
}
export function isAuthorizedEventBase(event, isTokenPayload) {
    return (event != null &&
        typeof event.httpMethod === 'string' &&
        event.headers != null &&
        (event.auth === undefined ||
            isTokenPayload == null ||
            isTokenPayload(event.auth)));
}
export function isUpperCaseAuthorizedEvent(event, isTokenPayload) {
    return (isAuthorizedEventBase(event, isTokenPayload) &&
        (typeof event.headers.Authorization === 'string' ||
            (Array.isArray(event.headers.Authorization) &&
                event.headers.Authorization.length === 1 &&
                event.headers.Authorization.every(function (entry) { return typeof entry === 'string'; }))));
}
export function isLowerCaseAuthorizedEvent(event, isTokenPayload) {
    return (isAuthorizedEventBase(event, isTokenPayload) &&
        (typeof event.headers.authorization === 'string' ||
            (Array.isArray(event.headers.authorization) &&
                event.headers.authorization.length === 1 &&
                event.headers.authorization.every(function (entry) { return typeof entry === 'string'; }))));
}
//# sourceMappingURL=IAuthorizedEvent.js.map