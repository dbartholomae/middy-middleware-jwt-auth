export function isAuthorizedEvent(event) {
    return (event != null &&
        typeof event.httpMethod === 'string' &&
        event.headers != null &&
        typeof event.headers.Authorization === 'string');
}
