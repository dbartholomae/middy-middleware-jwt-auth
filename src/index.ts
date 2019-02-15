import debugFactory, { IDebugger } from 'debug'
import { HandlerLambda, MiddlewareFunction } from 'middy'
import {
  IAuthorizedEvent,
  isAuthorizedEvent
} from './interfaces/IAuthorizedEvent'
import {
  EncryptionAlgorithms,
  IAuthOptions,
  isAuthOptions
} from './interfaces/IAuthOptions'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

/** A documented example module */
export class JWTAuthMiddleware {
  /** The logger used in the module */
  private readonly logger: IDebugger

  public static create (options: IAuthOptions): JWTAuthMiddleware {
    if (!isAuthOptions(options)) {
      throw new TypeError(`Expected IAuthOptions, received ${options} instead`)
    }
    return new JWTAuthMiddleware(options)
  }

  /** Creates a new Module */
  constructor (private options: IAuthOptions) {
    this.logger = debugFactory('middy-middleware-jwt-auth')
  }

  /** Starts the module */
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
    this.logger('Authorization header found')

    this.logger('Checking whether authorization header is formed correctly')
    const parts = event.headers.Authorization.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      this.logger(
        `Authorization header malformed, it was "${
          event.headers.Authorization
        }" but should be of format "Bearer token"`
      )
      throw createHttpError(401, 'Format is Authorization: Bearer [token]', {
        type: 'WrongAuthFormat'
      })
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
