/** An event that can be checked for authorization with middly-middleware-jwt-auth */
export type IAuthorizedEvent =
  | ILowerCaseAuthorizedEvent
  | IUpperCaseAuthorizedEvent

export interface IAuthorizedEventBase {
  /** Authorization information added by this middleware from a JWT. Has to be undefined before hitting the middleware. */
  auth?: any
  /** An object containing event headers */
  headers: any
  /** The http request method of this event */
  httpMethod: string
}

/** An event with a lower case authorization header */
export interface ILowerCaseAuthorizedEvent extends IAuthorizedEventBase {
  headers: {
    /**
     * The authorization token to check. Can be a string or an array with exactly one string.
     * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     */
    authorization: string | string[]
  }
}

/** An event with an upper case authorization header */
export interface IUpperCaseAuthorizedEvent extends IAuthorizedEventBase {
  headers: {
    /**
     * The authorization token to check. Can be a string or an array with exactly one string.
     * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     */
    Authorization: string | string[]
  }
}

export function isAuthorizedEvent (event: any): event is IAuthorizedEvent {
  return isUpperCaseAuthorizedEvent(event) || isLowerCaseAuthorizedEvent(event)
}

export function isAuthorizedEventBase (
  event: any
): event is IAuthorizedEventBase {
  return (
    event != null &&
    typeof event.httpMethod === 'string' &&
    event.headers != null
  )
}

export function isUpperCaseAuthorizedEvent (
  event: any
): event is IUpperCaseAuthorizedEvent {
  return (
    isAuthorizedEventBase(event) &&
    (typeof event.headers.Authorization === 'string' ||
      (Array.isArray(event.headers.Authorization) &&
        event.headers.Authorization.length === 1 &&
        event.headers.Authorization.every(
          (entry: any) => typeof entry === 'string'
        )))
  )
}

export function isLowerCaseAuthorizedEvent (
  event: any
): event is ILowerCaseAuthorizedEvent {
  return (
    isAuthorizedEventBase(event) &&
    (typeof event.headers.authorization === 'string' ||
      (Array.isArray(event.headers.authorization) &&
        event.headers.authorization.length === 1 &&
        event.headers.authorization.every(
          (entry: any) => typeof entry === 'string'
        )))
  )
}
