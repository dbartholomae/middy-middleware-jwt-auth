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
// import createHttpError from 'http-errors'

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
    if (event && event.auth !== undefined) {
      throw createHttpError(400, 'The events auth property has to be empty')
    }
    this.logger('Checking whether event contains authorization data')
    if (!isAuthorizedEvent(event)) {
      this.logger('No authorization data found')
      return
    }
    this.logger('Authorization data found')

    const parts = event.headers.Authorization.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw createHttpError(401, 'Format is Authorization: Bearer [token]')
    }

    const token = parts[1]
    try {
      event.auth = jwt.verify(token, this.options.secretOrPublicKey, {
        algorithms: [this.options.algorithm]
      })
    } catch (err) {
      throw createHttpError(401, 'Invalid token')
    }
  }
}

export default JWTAuthMiddleware.create
export { EncryptionAlgorithms, IAuthOptions, isAuthOptions }
export {
  IAuthorizedEvent,
  isAuthorizedEvent
} from './interfaces/IAuthorizedEvent'
