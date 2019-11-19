import createHttpError from 'http-errors'
import middy from 'middy'
import { httpErrorHandler, httpHeaderNormalizer } from 'middy/middlewares'
import JWTAuthMiddleware, { EncryptionAlgorithms, IAuthorizedEvent } from '../'

interface ITokenPayload {
  permissions: string[]
}

function isTokenPayload (token: any): token is ITokenPayload {
  return token != null &&
    Array.isArray(token.permissions) &&
    token.permissions.every((permission: any) => typeof permission === 'string')
}

// This is your AWS handler
const helloWorld = async (event: IAuthorizedEvent<ITokenPayload>) => {
  // The middleware adds auth information if a valid token was added
  // If no auth was found and credentialsRequired is set to true, a 401 will be thrown. If auth exists you
  // have to check that it has the expected form.
  if (event.auth!.payload.permissions.indexOf('helloWorld') === -1) {
    throw createHttpError(403, `User not authorized for helloWorld, only found permissions [${event.auth!.payload.permissions.join(', ')}]`, {
      type: 'NotAuthorized'
    })
  }

  return {
    body: JSON.stringify({ data: `Hello world! Here's your token: ${event.auth!.token}` }),
    statusCode: 200
  }
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
export const handler = middy(helloWorld)
  .use(httpHeaderNormalizer()) // Make sure authorization header is saved in lower case
  .use(httpErrorHandler()) // This middleware is needed do handle the errors thrown by the JWTAuthMiddleware
  .use(JWTAuthMiddleware({
    /** Algorithm to verify JSON web token signature */
    algorithm: EncryptionAlgorithms.HS256,
    /** An optional boolean that enables making authorization mandatory */
    credentialsRequired: true,
    /** An optional function that checks whether the token payload is formatted correctly */
    isPayload: isTokenPayload,
    /** A string or buffer containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA */
    secretOrPublicKey: 'secret',
    /**
     * An optional function used to search for a token e. g. in a query string. By default, and as a fall back,
     * event.headers.authorization and event.headers.Authorization are used.
     */
    tokenSource: (event: any) => event.queryStringParameters.token
  }))
