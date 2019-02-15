import { EncryptionAlgorithms, isAuthOptions } from './IAuthOptions';
describe('IAuthOptions', function () {
    describe('interface', function () {
        it('accepts data that has algorithm and a string secretOrPublicKey', function () {
            var options = {
                algorithm: EncryptionAlgorithms.ES256,
                secretOrPublicKey: 'secret'
            };
            expect(options).not.toBeNull();
        });
        it('accepts data that has algorithm and a Buffer secretOrPublicKey', function () {
            var options = {
                algorithm: EncryptionAlgorithms.ES256,
                secretOrPublicKey: Buffer.from([])
            };
            expect(options).not.toBeNull();
        });
    });
    describe('type guard', function () {
        it('accepts data that has algorithm and a string secretOrPublicKey', function () {
            expect(isAuthOptions({
                algorithm: EncryptionAlgorithms.ES256,
                secretOrPublicKey: 'secret'
            })).toBe(true);
        });
        it('accepts data that has algorithm and a Buffer secretOrPublicKey', function () {
            expect(isAuthOptions({
                algorithm: EncryptionAlgorithms.ES256,
                secretOrPublicKey: Buffer.from([])
            })).toBe(true);
        });
        it('rejects data that is null', function () {
            expect(isAuthOptions(null)).toBe(false);
        });
        it('rejects data without algorithm', function () {
            expect(isAuthOptions({
                secretOrPublicKey: 'secret'
            })).toBe(false);
        });
        it("rejects data with algorithm that isn't an EncryptionAlgorithm ", function () {
            expect(isAuthOptions({
                algorithm: 'some string',
                secretOrPublicKey: 'secret'
            })).toBe(false);
        });
        it('rejects data without secretOrPublicKey', function () {
            expect(isAuthOptions({
                algorithm: EncryptionAlgorithms.ES256
            })).toBe(false);
        });
        it("rejects data where secretOrPublicKey isn't a string or Buffer", function () {
            expect(isAuthOptions({
                algorithm: EncryptionAlgorithms.ES256,
                secretOrPublicKey: {}
            })).toBe(false);
        });
    });
});
