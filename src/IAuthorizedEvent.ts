/** An event that can be checked for authorization with middly-middleware-jwt-auth */
export interface IAuthorizedEvent {
  headers: {
    /**
     * The authorization token to check
     * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     */
    Authorization: string
  }
  /** The http request method of this event */
  httpMethod: string
}

export function isAuthorizedEvent (event: any): event is IAuthorizedEvent {
  return (
    event != null &&
    typeof event.httpMethod === 'string' &&
    event.headers != null &&
    typeof event.headers.Authorization === 'string'
  )
}
