import { EncryptionAlgorithms } from './interfaces/IAuthOptions'
import JWTAuthMiddleware from './JWTAuthMiddleware'

import createHttpError from 'http-errors'
import JWT from 'jsonwebtoken'
import moment from 'moment'
import { IAuthorizedEvent } from './interfaces/IAuthorizedEvent'

describe('JWTAuthMiddleware', () => {
  it('throws a type error when options are misformed', () => {
    expect(() => JWTAuthMiddleware({} as any)).toThrowError(TypeError)
  })

  describe('before hook', () => {
    it('resolves successfully if event is misformed', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.ES256,
        secretOrPublicKey: 'secret'
      }
      await expect(
        JWTAuthMiddleware(options).before({} as any, next)
      ).resolves.toEqual(undefined)
    })

    it('resolves if token is valid', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const token = JWT.sign({}, options.secretOrPublicKey, {
        algorithm: options.algorithm
      })
      expect(
        await JWTAuthMiddleware(options).before(
          {
            callback: jest.fn(),
            context: {} as any,
            error: {} as Error,
            event: {
              headers: {
                Authorization: `Bearer ${token}`
              },
              httpMethod: 'GET'
            },
            response: null
          },
          next
        )
      ).toEqual(undefined)
    })

    it('resolves if token is given in lower case authorization header', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const token = JWT.sign({}, options.secretOrPublicKey, {
        algorithm: options.algorithm
      })
      expect(
        await JWTAuthMiddleware(options).before(
          {
            callback: jest.fn(),
            context: {} as any,
            error: {} as Error,
            event: {
              headers: {
                authorization: `Bearer ${token}`
              },
              httpMethod: 'GET'
            },
            response: null
          },
          next
        )
      ).toEqual(undefined)
    })

    it('resolves if token is only entry in an array', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const token = JWT.sign({}, options.secretOrPublicKey, {
        algorithm: options.algorithm
      })
      expect(
        await JWTAuthMiddleware(options).before(
          {
            callback: jest.fn(),
            context: {} as any,
            error: {} as Error,
            event: {
              headers: {
                Authorization: [`Bearer ${token}`]
              },
              httpMethod: 'GET'
            },
            response: null
          },
          next
        )
      ).toEqual(undefined)
    })

    it('saves token information to event.auth if token is valid', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const data = { userId: 1 }
      const token = JWT.sign(data, options.secretOrPublicKey, {
        algorithm: options.algorithm
      })
      const event: IAuthorizedEvent = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        httpMethod: 'GET'
      }
      await JWTAuthMiddleware(options).before(
        {
          callback: jest.fn(),
          context: {} as any,
          error: {} as Error,
          event,
          response: null
        },
        next
      )
      expect(event.auth).toEqual({ ...data, iat: expect.any(Number) })
    })

    it('rejects if event.auth is already filled', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const data = { userId: 1 }
      const token = JWT.sign(data, options.secretOrPublicKey, {
        algorithm: options.algorithm
      })
      const event: IAuthorizedEvent = {
        auth: {},
        headers: {
          Authorization: `Bearer ${token}`
        },
        httpMethod: 'GET'
      }
      await expect(
        JWTAuthMiddleware(options).before(
          {
            callback: jest.fn(),
            context: {} as any,
            error: {} as Error,
            event,
            response: null
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(400, 'The events auth property has to be empty', {
          type: 'EventAuthNotEmpty'
        })
      )
    })

    it('rejects if both authorization and Authorization headers are set', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const data = { userId: 1 }
      const token = JWT.sign(data, options.secretOrPublicKey, {
        algorithm: options.algorithm
      })
      const event: IAuthorizedEvent = {
        headers: {
          Authorization: `Bearer ${token}`,
          authorization: `Bearer ${token}`
        },
        httpMethod: 'GET'
      }
      await expect(
        JWTAuthMiddleware(options).before(
          {
            callback: jest.fn(),
            context: {} as any,
            error: {} as Error,
            event,
            response: null
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(
          400,
          'Both authorization and Authorization headers found, only one can be set',
          {
            type: 'MultipleAuthorizationHeadersSet'
          }
        )
      )
    })

    it('rejects if Authorization header is malformed', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      await expect(
        JWTAuthMiddleware(options).before(
          {
            callback: jest.fn(),
            context: {} as any,
            error: {} as Error,
            event: {
              headers: {
                Authorization: 'Malformed header'
              },
              httpMethod: 'GET'
            },
            response: null
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(
          401,
          'Format should be "Authorization: Bearer [token]", received "Authorization: Malformed header" instead',
          {
            type: 'WrongAuthFormat'
          }
        )
      )
    })

    it('rejects if token is invalid', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const token = JWT.sign({}, 'wrong secret', {
        algorithm: options.algorithm
      })
      await expect(
        JWTAuthMiddleware(options).before(
          {
            callback: jest.fn(),
            context: {} as any,
            error: {} as Error,
            event: {
              headers: {
                Authorization: `Bearer ${token}`
              },
              httpMethod: 'GET'
            },
            response: null
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(401, 'Invalid token', {
          type: 'InvalidToken'
        })
      )
    })

    it('rejects if token is expired', async () => {
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const token = JWT.sign({ exp: 1 }, 'secret', {
        algorithm: options.algorithm
      })
      await expect(
        JWTAuthMiddleware(options).before(
          {
            callback: jest.fn(),
            context: {} as any,
            error: {} as Error,
            event: {
              headers: {
                Authorization: `Bearer ${token}`
              },
              httpMethod: 'GET'
            },
            response: null
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(
          401,
          'Token expired at Thu Jan 01 1970 01:00:01 GMT+0100 (GMT+01:00)',
          {
            expiredAt: new Date(
              'Thu Jan 01 1970 01:00:01 GMT+0100 (GMT+01:00)'
            ),
            type: 'TokenExpiredError'
          }
        )
      )
    })

    it("rejects if token isn't valid yet", async () => {
      const validDate = new Date('2100-01-01T00:00:00Z')
      const next = jest.fn()
      const options = {
        algorithm: EncryptionAlgorithms.HS256,
        secretOrPublicKey: 'secret'
      }
      const token = JWT.sign({ nbf: moment(validDate).unix() }, 'secret', {
        algorithm: options.algorithm
      })
      await expect(
        JWTAuthMiddleware(options).before(
          {
            callback: jest.fn(),
            context: {} as any,
            error: {} as Error,
            event: {
              headers: {
                Authorization: `Bearer ${token}`
              },
              httpMethod: 'GET'
            },
            response: null
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(401, `Token not valid before ${validDate}`, {
          date: validDate,
          type: 'NotBeforeError'
        })
      )
    })
  })
})
