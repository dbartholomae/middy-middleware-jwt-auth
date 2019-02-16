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
 *   used to set up the middleware
 */
/** An additional comment to make sure Typedoc attributes the comment above to the file itself */
import debugFactory, { IDebugger } from 'debug'
import createHttpError from 'http-errors'
import jwt, { NotBeforeError, TokenExpiredError } from 'jsonwebtoken'
import { HandlerLambda, MiddlewareFunction } from 'middy'
import {
  EncryptionAlgorithms,
  IAuthOptions,
  isAuthOptions
} from './interfaces/IAuthOptions'
import {
  IAuthorizedEvent,
  isAuthorizedEvent,
  isLowerCaseAuthorizedEvent,
  isUpperCaseAuthorizedEvent
} from './interfaces/IAuthorizedEvent'

/** The actual middleware */
export class JWTAuthMiddleware {
  public static create (options: IAuthOptions): JWTAuthMiddleware {
    if (!isAuthOptions(options)) {
      throw new TypeError(`Expected IAuthOptions, received ${options} instead`)
    }
    return new JWTAuthMiddleware(options)
  }

  /** The logger used in the module */
  private readonly logger: IDebugger

  /** Creates a new JWT Auth middleware */
  constructor (private options: IAuthOptions) {
    this.logger = debugFactory('middy-middleware-jwt-auth')
    this.logger(
      `Setting up JWTAuthMiddleware with encryption algorithm ${
        this.options.algorithm
      }`
    )
  }

  /**
   * Checks for an authentication token, saves its content to event.auth and throws errors if anything fishy goes on.
   * It will pass if no authorization header is present, but will ensure that event.auth is undefined in those cases.
   * Authorization or authorization headers will both be checked. If both exist, the middleware will throw an error.
   * @param event - The event to check
   */
  public before: MiddlewareFunction<IAuthorizedEvent, any> = async ({
    event
  }: HandlerLambda<IAuthorizedEvent>) => {
    this.logger('Checking whether event.auth already is populated')
    if (event && event.auth !== undefined) {
      this.logger('event.auth already populated, has to be empty')
      throw createHttpError(400, 'The events auth property has to be empty', {
        type: 'EventAuthNotEmpty'
      })
    }
    this.logger('Checking whether event contains authorization header')
    if (!isAuthorizedEvent(event)) {
      this.logger('No authorization header found')
      return
    }
    this.logger(
      'Checking whether event contains multiple authorization headers'
    )
    if (
      isLowerCaseAuthorizedEvent(event) &&
      isUpperCaseAuthorizedEvent(event)
    ) {
      this.logger(
        'Both authorization and Authorization headers found, only one can be set'
      )
      throw createHttpError(
        400,
        'Both authorization and Authorization headers found, only one can be set',
        {
          type: 'MultipleAuthorizationHeadersSet'
        }
      )
    }
    this.logger('One authorization header found')

    this.logger('Checking whether authorization header is formed correctly')
    const normalizedAuth = isLowerCaseAuthorizedEvent(event)
      ? event.headers.authorization
      : event.headers.Authorization
    const authHeader = Array.isArray(normalizedAuth)
      ? normalizedAuth[0]
      : normalizedAuth
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      this.logger(
        `Authorization header malformed, it was "${authHeader}" but should be of format "Bearer token"`
      )
      throw createHttpError(
        401,
        `Format should be "Authorization: Bearer [token]", received "Authorization: ${authHeader}" instead`,
        {
          type: 'WrongAuthFormat'
        }
      )
    }
    this.logger('Authorization header formed correctly')

    const token = parts[1]
    this.logger('Verifying authorization token')
    try {
      event.auth = jwt.verify(token, this.options.secretOrPublicKey, {
        algorithms: [this.options.algorithm]
      })
      this.logger('Token verified')
    } catch (err) {
      this.logger('Token could not be verified')

      if (err instanceof TokenExpiredError) {
        this.logger(`Token expired at ${err.expiredAt}`)
        throw createHttpError(401, `Token expired at ${err.expiredAt}`, {
          expiredAt: err.expiredAt,
          type: 'TokenExpiredError'
        })
      }

      if (err instanceof NotBeforeError) {
        this.logger(`Token not valid before ${err.date}`)
        throw createHttpError(401, `Token not valid before ${err.date}`, {
          date: err.date,
          type: 'NotBeforeError'
        })
      }

      throw createHttpError(401, 'Invalid token', {
        type: 'InvalidToken'
      })
    }
  }
}

export default JWTAuthMiddleware.create
export { EncryptionAlgorithms, IAuthOptions, isAuthOptions }
export {
  IAuthorizedEvent,
  isAuthorizedEvent
} from './interfaces/IAuthorizedEvent'
