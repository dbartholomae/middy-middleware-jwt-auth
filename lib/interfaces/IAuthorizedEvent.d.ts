/** An event that can be checked for authorization with middly-middleware-jwt-auth */
export interface IAuthorizedEvent {
    /** Authorization information added by this middleware from a JWT. Has to be undefined before hitting the middleware. */
    auth?: any;
    headers: {
        /**
         * The authorization token to check. Can be a string or an array with exactly one string.
         * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
         */
        Authorization: string | string[];
    };
    /** The http request method of this event */
    httpMethod: string;
}
export declare function isAuthorizedEvent(event: any): event is IAuthorizedEvent;