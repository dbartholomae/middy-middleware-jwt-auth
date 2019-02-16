import { IAuthorizedEvent, isAuthorizedEvent } from './IAuthorizedEvent'

describe('IAuthorizedEvent', () => {
  describe('interface', () => {
    it('accepts data that has an httpMethod and a string as an Authorization header', () => {
      const event: IAuthorizedEvent = {
        auth: {},
        headers: {
          Authorization: 'Bearer TOKEN'
        },
        httpMethod: 'GET'
      }
      expect(event).not.toBeNull()
    })

    it('accepts data that has an httpMethod and an Array as an Authorization header', () => {
      const event: IAuthorizedEvent = {
        auth: {},
        headers: {
          Authorization: ['Bearer TOKEN']
        },
        httpMethod: 'GET'
      }
      expect(event).not.toBeNull()
    })

    it('accepts data that has an httpMethod and a string as an authorization header with lower-case a', () => {
      const event: IAuthorizedEvent = {
        auth: {},
        headers: {
          authorization: 'Bearer TOKEN'
        },
        httpMethod: 'GET'
      }
      expect(event).not.toBeNull()
    })
  })

  describe('type guard', () => {
    describe.each(['authorization', 'Authorization'])(
      'with %s header',
      authHeader => {
        it(`accepts data that has an httpMethod and a string as an ${authHeader} header`, () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: 'Bearer TOKEN'
              },
              httpMethod: 'GET'
            })
          ).toBe(true)
        })

        it(`accepts data that has an httpMethod and an array of strings as an ${authHeader} header`, () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: ['Bearer TOKEN']
              },
              httpMethod: 'GET'
            })
          ).toBe(true)
        })

        it(`accepts data that has an httpMethod and a string as an ${authHeader} header`, () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: 'Bearer TOKEN'
              },
              httpMethod: 'GET'
            })
          ).toBe(true)
        })

        it('rejects data without an httpMethod', () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: 'Bearer TOKEN'
              }
            })
          ).toBe(false)
        })

        it('rejects data where authorization is an array with non-string members', () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: [{}]
              },
              httpMethod: 'GET'
            })
          ).toBe(false)
        })

        it('rejects data where authorization is an empty array', () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: []
              },
              httpMethod: 'GET'
            })
          ).toBe(false)
        })
      }
    )

    it('rejects data that is null', () => {
      expect(isAuthorizedEvent(null)).toBe(false)
    })

    it('rejects data without a header', () => {
      expect(
        isAuthorizedEvent({
          httpMethod: 'GET'
        })
      ).toBe(false)
    })

    it('rejects data without authorization', () => {
      expect(
        isAuthorizedEvent({
          headers: {},
          httpMethod: 'GET'
        })
      ).toBe(false)
    })
  })
})
