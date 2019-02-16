export function isAuthorizedEvent(event) {
    return (event != null &&
        typeof event.httpMethod === 'string' &&
        event.headers != null &&
        (typeof event.headers.Authorization === 'string' ||
            (Array.isArray(event.headers.Authorization) &&
                event.headers.Authorization.length === 1 &&
                event.headers.Authorization.every(function (entry) { return typeof entry === 'string'; }))));
}
