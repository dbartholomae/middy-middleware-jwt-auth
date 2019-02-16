import JWTAuthMiddleware from './JWTAuthMiddleware'
import { EncryptionAlgorithms } from './interfaces/IAuthOptions'

import JWT from 'jsonwebtoken'
import createHttpError from 'http-errors'
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
            event: {
              headers: {
                Authorization: `Bearer ${token}`
              },
              httpMethod: 'GET'
            },
            context: {} as any,
            response: null,
            error: {} as Error,
            callback: jest.fn()
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
            event: {
              headers: {
                Authorization: [`Bearer ${token}`]
              },
              httpMethod: 'GET'
            },
            context: {} as any,
            response: null,
            error: {} as Error,
            callback: jest.fn()
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
          event,
          context: {} as any,
          response: null,
          error: {} as Error,
          callback: jest.fn()
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
            event,
            context: {} as any,
            response: null,
            error: {} as Error,
            callback: jest.fn()
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(400, 'The events auth property has to be empty', {
          type: 'EventAuthNotEmpty'
        })
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
            event: {
              headers: {
                Authorization: 'Malformed header'
              },
              httpMethod: 'GET'
            },
            context: {} as any,
            response: null,
            error: {} as Error,
            callback: jest.fn()
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
            event: {
              headers: {
                Authorization: `Bearer ${token}`
              },
              httpMethod: 'GET'
            },
            context: {} as any,
            response: null,
            error: {} as Error,
            callback: jest.fn()
          },
          next
        )
      ).rejects.toEqual(
        createHttpError(401, 'Invalid token', {
          type: 'InvalidToken'
        })
      )
    })
  })
})
