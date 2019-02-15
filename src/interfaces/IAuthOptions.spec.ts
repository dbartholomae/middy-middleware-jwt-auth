import {
  EncryptionAlgorithms,
  IAuthOptions,
  isAuthOptions
} from './IAuthOptions'

describe('IAuthOptions', () => {
  describe('interface', () => {
    it('accepts data that has algorithm and a string secretOrPublicKey', () => {
      const options: IAuthOptions = {
        algorithm: EncryptionAlgorithms.ES256,
        secretOrPublicKey: 'secret'
      }
      expect(options).not.toBeNull()
    })

    it('accepts data that has algorithm and a Buffer secretOrPublicKey', () => {
      const options: IAuthOptions = {
        algorithm: EncryptionAlgorithms.ES256,
        secretOrPublicKey: Buffer.from([])
      }
      expect(options).not.toBeNull()
    })
  })

  describe('type guard', () => {
    it('accepts data that has algorithm and a string secretOrPublicKey', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: 'secret'
        })
      ).toBe(true)
    })

    it('accepts data that has algorithm and a Buffer secretOrPublicKey', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: Buffer.from([])
        })
      ).toBe(true)
    })

    it('rejects data that is null', () => {
      expect(isAuthOptions(null)).toBe(false)
    })

    it('rejects data without algorithm', () => {
      expect(
        isAuthOptions({
          secretOrPublicKey: 'secret'
        })
      ).toBe(false)
    })

    it("rejects data with algorithm that isn't an EncryptionAlgorithm ", () => {
      expect(
        isAuthOptions({
          algorithm: 'some string',
          secretOrPublicKey: 'secret'
        })
      ).toBe(false)
    })

    it('rejects data without secretOrPublicKey', () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256
        })
      ).toBe(false)
    })

    it("rejects data where secretOrPublicKey isn't a string or Buffer", () => {
      expect(
        isAuthOptions({
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: {}
        })
      ).toBe(false)
    })
  })
})
