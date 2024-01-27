/** An event that can be checked for authorization with middly-middleware-jwt-auth */
export type IAuthorizedEvent<TokenPayload = any> =
  | ILowerCaseAuthorizedEvent<TokenPayload>
  | IUpperCaseAuthorizedEvent<TokenPayload>;

export interface IAuthorizedEventBase<TokenPayload = any> {
  /** Authorization information added by this middleware from a JWT. Has to be undefined before hitting the middleware. */
  auth?: {
    payload: TokenPayload;
    token: string;
  };
  /** An object containing event headers */
  headers: any;
  /** The http request method of this event (for REST APIs) */
  httpMethod?: any;
  /** The metadata about this event (for HTTP APIs) */
  requestContext?: any;
}

export interface IAuthorizedRestApiGatewayEvent<TokenPayload = any>
  extends IAuthorizedEventBase<TokenPayload> {
  httpMethod: string;
}

export interface IAuthorizedHttpApiGatewayEvent<TokenPayload = any>
  extends IAuthorizedEventBase<TokenPayload> {
  requestContext: {
    /** The http request metadata about this event */
    http: object;
  };
}

export interface IAuthorizedWebsocketApiGatewayEvent<TokenPayload = any>
  extends IAuthorizedEventBase<TokenPayload> {
  requestContext: {
    /** The connectionId of the websocket connection */
    connectionId: string;
    /** The eventType of the websocket message */
    eventType: string;
  };
}

export type IAuthorizedApiGatewayEvent<TokenPayload = any> =
  | IAuthorizedRestApiGatewayEvent<TokenPayload>
  | IAuthorizedHttpApiGatewayEvent<TokenPayload>
  | IAuthorizedWebsocketApiGatewayEvent<TokenPayload>;

/** An event with a lower case authorization header */
export type ILowerCaseAuthorizedEvent<TokenPayload = any> = {
  headers: {
    /**
     * The authorization token to check. Can be a string or an array with exactly one string.
     * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     */
    authorization: string | string[];
  };
} & IAuthorizedApiGatewayEvent<TokenPayload>;

/** An event with an upper case authorization header */
export type IUpperCaseAuthorizedEvent<TokenPayload = any> = {
  headers: {
    /**
     * The authorization token to check. Can be a string or an array with exactly one string.
     * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     */
    Authorization: string | string[];
  };
} & IAuthorizedApiGatewayEvent<TokenPayload>;

export function isAuthorizedEvent<P>(
  event: any,
  isTokenPayload?: (payload: any) => payload is P,
): event is IAuthorizedEvent<P> {
  return (
    isUpperCaseAuthorizedEvent<P>(event, isTokenPayload) ||
    isLowerCaseAuthorizedEvent<P>(event, isTokenPayload)
  );
}

export function isAuthorizedEventBase<P>(
  event: any,
  isTokenPayload?: (payload: any) => payload is P,
): event is IAuthorizedEventBase {
  return (
    event != null &&
    event.headers != null &&
    (event.httpMethod != null || event.requestContext != null) &&
    (event.auth === undefined ||
      isTokenPayload == null ||
      (event.auth &&
        isTokenPayload(event.auth.payload) &&
        typeof event.auth.token === "string"))
  );
}

export function isAuthorizedRestApiGatewayEvent<P>(
  event: any,
  isTokenPayload?: (payload: any) => payload is P,
): event is IAuthorizedRestApiGatewayEvent<P> {
  return (
    isAuthorizedEventBase<P>(event, isTokenPayload) &&
    typeof event.httpMethod === "string"
  );
}

export function isAuthorizedHttpApiGatewayEvent<P>(
  event: any,
  isTokenPayload?: (payload: any) => payload is P,
): event is IAuthorizedHttpApiGatewayEvent<P> {
  return (
    isAuthorizedEventBase<P>(event, isTokenPayload) &&
    typeof event.requestContext === "object" &&
    event.requestContext !== null &&
    "http" in event.requestContext &&
    typeof event.requestContext.http === "object"
  );
}

export function isAuthorizedWebsocketApiGatewayEvent<P>(
  event: any,
  isTokenPayload?: (payload: any) => payload is P,
): event is IAuthorizedHttpApiGatewayEvent<P> {
  return (
    isAuthorizedEventBase<P>(event, isTokenPayload) &&
    typeof event.requestContext === "object" &&
    event.requestContext !== null &&
    "connectionId" in event.requestContext &&
    typeof event.requestContext.connectionId === "string" &&
    "eventType" in event.requestContext &&
    typeof event.requestContext.eventType === "string"
  );
}

export function isAuthorizedApiGatewayEvent<P>(
  event: any,
  isTokenPayload?: (payload: any) => payload is P,
): event is IAuthorizedApiGatewayEvent<P> {
  return (
    isAuthorizedRestApiGatewayEvent(event, isTokenPayload) ||
    isAuthorizedHttpApiGatewayEvent(event, isTokenPayload) ||
    isAuthorizedWebsocketApiGatewayEvent(event, isTokenPayload)
  );
}

export function isUpperCaseAuthorizedEvent<P>(
  event: any,
  isTokenPayload?: (payload: any) => payload is P,
): event is IUpperCaseAuthorizedEvent<P> {
  return (
    isAuthorizedApiGatewayEvent<P>(event, isTokenPayload) &&
    (typeof event.headers.Authorization === "string" ||
      (Array.isArray(event.headers.Authorization) &&
        event.headers.Authorization.length === 1 &&
        event.headers.Authorization.every(
          (entry: any) => typeof entry === "string",
        )))
  );
}

export function isLowerCaseAuthorizedEvent<P>(
  event: any,
  isTokenPayload?: (payload: any) => payload is P,
): event is ILowerCaseAuthorizedEvent<P> {
  return (
    isAuthorizedApiGatewayEvent<P>(event, isTokenPayload) &&
    (typeof event.headers.authorization === "string" ||
      (Array.isArray(event.headers.authorization) &&
        event.headers.authorization.length === 1 &&
        event.headers.authorization.every(
          (entry: any) => typeof entry === "string",
        )))
  );
}
