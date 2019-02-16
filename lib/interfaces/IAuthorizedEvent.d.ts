/** An event that can be checked for authorization with middly-middleware-jwt-auth */
export declare type IAuthorizedEvent = ILowerCaseAuthorizedEvent | IUpperCaseAuthorizedEvent;
export interface IAuthorizedEventBase {
    /** Authorization information added by this middleware from a JWT. Has to be undefined before hitting the middleware. */
    auth?: any;
    /** An object containing event headers */
    headers: any;
    /** The http request method of this event */
    httpMethod: string;
}
/** An event with a lower case authorization header */
export interface ILowerCaseAuthorizedEvent extends IAuthorizedEventBase {
    headers: {
        /**
         * The authorization token to check. Can be a string or an array with exactly one string.
         * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
         */
        authorization: string | string[];
    };
}
/** An event with an upper case authorization header */
export interface IUpperCaseAuthorizedEvent extends IAuthorizedEventBase {
    headers: {
        /**
         * The authorization token to check. Can be a string or an array with exactly one string.
         * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
         */
        Authorization: string | string[];
    };
}
export declare function isAuthorizedEvent(event: any): event is IAuthorizedEvent;
export declare function isAuthorizedEventBase(event: any): event is IAuthorizedEventBase;
export declare function isUpperCaseAuthorizedEvent(event: any): event is IUpperCaseAuthorizedEvent;
export declare function isLowerCaseAuthorizedEvent(event: any): event is ILowerCaseAuthorizedEvent;
