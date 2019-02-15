/** Algorithms to verify JSON web token signatures */
export enum EncryptionAlgorithms {
  /** HMAC using SHA-256 hash algorithm */
  HS256 = 'HS256',
  /** HMAC using SHA-384 hash algorithm */
  HS384 = 'HS384',
  /** HMAC using SHA-512 hash algorithm */
  HS512 = 'HS512',
  /** RSASSA using SHA-256 hash algorithm */
  RS256 = 'RS256',
  /** RSASSA using SHA-384 hash algorithm */
  RS384 = 'RS384',
  /** RSASSA using SHA-512 hash algorithm */
  RS512 = 'RS512',
  /** ECDSA using P-256 curve and SHA-256 hash algorithm */
  ES256 = 'ES256',
  /** ECDSA using P-384 curve and SHA-384 hash algorithm */
  ES384 = 'ES384',
  /** ECDSA using P-521 curve and SHA-512 hash algorithm */
  ES512 = 'ES512'
}

/** Options for the middy-middleware-jwt-auth */
export interface IAuthOptions {
  /** Algorithm to verify JSON web token signature */
  algorithm: EncryptionAlgorithms
  /** A string or buffer containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA */
  secretOrPublicKey: string | Buffer
}

export function isAuthOptions (options: any): options is IAuthOptions {
  return (
    options != null &&
    options.algorithm != null &&
    Object.values(EncryptionAlgorithms).includes(options.algorithm) &&
    options.secretOrPublicKey != null &&
    (typeof options.secretOrPublicKey === 'string' ||
      Buffer.isBuffer(options.secretOrPublicKey))
  )
}
