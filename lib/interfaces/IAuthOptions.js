/** Algorithms to verify JSON web token signatures */
export var EncryptionAlgorithms;
(function (EncryptionAlgorithms) {
    /** HMAC using SHA-256 hash algorithm */
    EncryptionAlgorithms["HS256"] = "HS256";
    /** HMAC using SHA-384 hash algorithm */
    EncryptionAlgorithms["HS384"] = "HS384";
    /** HMAC using SHA-512 hash algorithm */
    EncryptionAlgorithms["HS512"] = "HS512";
    /** RSASSA using SHA-256 hash algorithm */
    EncryptionAlgorithms["RS256"] = "RS256";
    /** RSASSA using SHA-384 hash algorithm */
    EncryptionAlgorithms["RS384"] = "RS384";
    /** RSASSA using SHA-512 hash algorithm */
    EncryptionAlgorithms["RS512"] = "RS512";
    /** ECDSA using P-256 curve and SHA-256 hash algorithm */
    EncryptionAlgorithms["ES256"] = "ES256";
    /** ECDSA using P-384 curve and SHA-384 hash algorithm */
    EncryptionAlgorithms["ES384"] = "ES384";
    /** ECDSA using P-521 curve and SHA-512 hash algorithm */
    EncryptionAlgorithms["ES512"] = "ES512";
})(EncryptionAlgorithms || (EncryptionAlgorithms = {}));
export function isAuthOptions(options) {
    return (options != null &&
        options.algorithm != null &&
        Object.values(EncryptionAlgorithms).includes(options.algorithm) &&
        options.secretOrPublicKey != null &&
        (typeof options.secretOrPublicKey === 'string' ||
            Buffer.isBuffer(options.secretOrPublicKey)));
}
