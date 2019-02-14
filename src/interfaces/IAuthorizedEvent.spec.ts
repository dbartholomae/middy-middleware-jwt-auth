import { IAuthorizedEvent, isAuthorizedEvent } from './IAuthorizedEvent'

describe('IAuthorizedEvent', () => {
  describe('interface', () => {
    it('accepts data that has an httpMethod and an Authorization header', () => {
      const event: IAuthorizedEvent = {
        headers: {
          Authorization: 'Bearer TOKEN'
        },
        httpMethod: 'GET'
      }
      expect(event).not.toBeNull()
    })
  })

  describe('type guard', () => {
    it('accepts data that has an httpMethod and an Authorization header', () => {
      expect(
        isAuthorizedEvent({
          headers: {
            Authorization: 'Bearer TOKEN'
          },
          httpMethod: 'GET'
        })
      ).toBe(true)
    })

    it('rejects data that is null', () => {
      expect(isAuthorizedEvent(null)).toBe(false)
    })

    it('rejects data without an httpMethod', () => {
      expect(
        isAuthorizedEvent({
          headers: {
            Authorization: 'Bearer TOKEN'
          }
        })
      ).toBe(false)
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
