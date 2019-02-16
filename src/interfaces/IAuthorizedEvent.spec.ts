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
  })

  describe('type guard', () => {
    it('accepts data that has an httpMethod and a string as an Authorization header', () => {
      expect(
        isAuthorizedEvent({
          headers: {
            Authorization: 'Bearer TOKEN'
          },
          httpMethod: 'GET'
        })
      ).toBe(true)
    })

    it('accepts data that has an httpMethod and an array of strings as an Authorization header', () => {
      expect(
        isAuthorizedEvent({
          headers: {
            Authorization: ['Bearer TOKEN']
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

    it('rejects data where authorization is an array with non-string members', () => {
      expect(
        isAuthorizedEvent({
          headers: {
            Authorization: [{}]
          },
          httpMethod: 'GET'
        })
      ).toBe(false)
    })

    it('rejects data where authorization is an empty array', () => {
      expect(
        isAuthorizedEvent({
          headers: {
            Authorization: []
          },
          httpMethod: 'GET'
        })
      ).toBe(false)
    })
  })
})
