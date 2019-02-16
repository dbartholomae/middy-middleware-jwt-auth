import * as tslib_1 from "tslib";
/**
 * # JWT Auth Middleware
 * ## Errors
 * All errors are created via [http-errors](https://www.npmjs.com/package/http-errors) and therefore follow that format.
 * This allows to use middleware like
 * [httpErrorHandler](https://github.com/middyjs/middy/blob/master/docs/middlewares.md#httperrorhandler) to handle these
 * errors. In addition to a human readable message they contain a machine readable error type in the property `type`.
 * The following error types (status codes) exist:
 * * __EventAuthNotEmpty (400)__ is thrown if event.auth was not undefined before hitting this middleware.
 *   This is necessary to avoid attacks where no Authorization header is set and event.auth is set directly
 *   to circumvent the check.
 * * __WrongAuthFormat (401)__ is thrown if the Authorization header is not of the form "Bearer token"
 * * __MultipleAuthorizationHeadersSet (400)__ is thrown if both authorization and Authorization headers are set
 * * __TokenExpiredError (401)__ is thrown if the token expired. `expiredAt` is set to the date when the token expired.
 * * __NotBeforeError (401)__ is thrown if the token isn't valid yet. `date` is set to the date when it will become valid.
 * * __InvalidToken (401)__ is thrown if the token cannot be verified with the secret or public key
 * * __TokenPayloadMalformedError (400)__ is thrown if a token payload type guard is given and if it rejects the token payload
 *   used to set up the middleware
 */
/** An additional comment to make sure Typedoc attributes the comment above to the file itself */
import debugFactory from 'debug';
import createHttpError from 'http-errors';
import jwt, { NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { EncryptionAlgorithms, isAuthOptions } from './interfaces/IAuthOptions';
import { isAuthorizedEvent, isLowerCaseAuthorizedEvent, isUpperCaseAuthorizedEvent } from './interfaces/IAuthorizedEvent';
/** The actual middleware */
var JWTAuthMiddleware = /** @class */ (function () {
    /** Creates a new JWT Auth middleware */
    function JWTAuthMiddleware(options) {
        var _this = this;
        this.options = options;
        /**
         * Checks for an authentication token, saves its content to event.auth and throws errors if anything fishy goes on.
         * It will pass if no authorization header is present, but will ensure that event.auth is undefined in those cases.
         * Authorization or authorization headers will both be checked. If both exist, the middleware will throw an error.
         * @param event - The event to check
         */
        this.before = function (_a) {
            var event = _a.event;
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var normalizedAuth, authHeader, parts, token, payload;
                return tslib_1.__generator(this, function (_b) {
                    this.logger('Checking whether event.auth already is populated');
                    if (event && event.auth !== undefined) {
                        this.logger('event.auth already populated, has to be empty');
                        throw createHttpError(400, 'The events auth property has to be empty', {
                            type: 'EventAuthNotEmpty'
                        });
                    }
                    this.logger('Checking whether event contains authorization header');
                    if (!isAuthorizedEvent(event)) {
                        this.logger('No authorization header found');
                        return [2 /*return*/];
                    }
                    this.logger('Checking whether event contains multiple authorization headers');
                    if (isLowerCaseAuthorizedEvent(event) &&
                        isUpperCaseAuthorizedEvent(event)) {
                        this.logger('Both authorization and Authorization headers found, only one can be set');
                        throw createHttpError(400, 'Both authorization and Authorization headers found, only one can be set', {
                            type: 'MultipleAuthorizationHeadersSet'
                        });
                    }
                    this.logger('One authorization header found');
                    this.logger('Checking whether authorization header is formed correctly');
                    normalizedAuth = isLowerCaseAuthorizedEvent(event)
                        ? event.headers.authorization
                        : event.headers.Authorization;
                    authHeader = Array.isArray(normalizedAuth)
                        ? normalizedAuth[0]
                        : normalizedAuth;
                    parts = authHeader.split(' ');
                    if (parts.length !== 2 || parts[0] !== 'Bearer') {
                        this.logger("Authorization header malformed, it was \"" + authHeader + "\" but should be of format \"Bearer token\"");
                        throw createHttpError(401, "Format should be \"Authorization: Bearer [token]\", received \"Authorization: " + authHeader + "\" instead", {
                            type: 'WrongAuthFormat'
                        });
                    }
                    this.logger('Authorization header formed correctly');
                    token = parts[1];
                    this.logger('Verifying authorization token');
                    try {
                        jwt.verify(token, this.options.secretOrPublicKey, {
                            algorithms: [this.options.algorithm]
                        });
                        this.logger('Token verified');
                    }
                    catch (err) {
                        this.logger('Token could not be verified');
                        if (err instanceof TokenExpiredError) {
                            this.logger("Token expired at " + new Date(err.expiredAt).toUTCString());
                            throw createHttpError(401, "Token expired at " + new Date(err.expiredAt).toUTCString(), {
                                expiredAt: err.expiredAt,
                                type: 'TokenExpiredError'
                            });
                        }
                        if (err instanceof NotBeforeError) {
                            this.logger("Token not valid before " + err.date);
                            throw createHttpError(401, "Token not valid before " + err.date, {
                                date: err.date,
                                type: 'NotBeforeError'
                            });
                        }
                        throw createHttpError(401, 'Invalid token', {
                            type: 'InvalidToken'
                        });
                    }
                    payload = jwt.decode(token);
                    if (this.options.isPayload !== undefined) {
                        this.logger('Verifying token payload');
                        if (!this.options.isPayload(payload)) {
                            this.logger("Token payload malformed, was " + JSON.stringify(payload));
                            throw createHttpError(400, "Token payload malformed, was " + JSON.stringify(payload), {
                                payload: payload,
                                type: 'TokenPayloadMalformedError'
                            });
                        }
                        this.logger('Token payload valid');
                        event.auth = payload;
                    }
                    else {
                        event.auth = payload;
                    }
                    return [2 /*return*/];
                });
            });
        };
        this.logger = debugFactory('middy-middleware-jwt-auth');
        this.logger("Setting up JWTAuthMiddleware with encryption algorithm " + this.options.algorithm);
    }
    JWTAuthMiddleware.create = function (options) {
        if (!isAuthOptions(options)) {
            throw new TypeError("Expected IAuthOptions, received " + options + " instead");
        }
        return new JWTAuthMiddleware(options);
    };
    return JWTAuthMiddleware;
}());
export { JWTAuthMiddleware };
export default JWTAuthMiddleware.create;
export { EncryptionAlgorithms, isAuthOptions };
export { isAuthorizedEvent } from './interfaces/IAuthorizedEvent';
//# sourceMappingURL=JWTAuthMiddleware.js.map