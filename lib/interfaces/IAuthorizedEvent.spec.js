import { isAuthorizedEvent } from './IAuthorizedEvent';
describe('IAuthorizedEvent', function () {
    describe('interface', function () {
        it('accepts data that has an httpMethod and an Authorization header', function () {
            var event = {
                auth: {},
                headers: {
                    Authorization: 'Bearer TOKEN'
                },
                httpMethod: 'GET'
            };
            expect(event).not.toBeNull();
        });
    });
    describe('type guard', function () {
        it('accepts data that has an httpMethod and an Authorization header', function () {
            expect(isAuthorizedEvent({
                headers: {
                    Authorization: 'Bearer TOKEN'
                },
                httpMethod: 'GET'
            })).toBe(true);
        });
        it('rejects data that is null', function () {
            expect(isAuthorizedEvent(null)).toBe(false);
        });
        it('rejects data without an httpMethod', function () {
            expect(isAuthorizedEvent({
                headers: {
                    Authorization: 'Bearer TOKEN'
                }
            })).toBe(false);
        });
        it('rejects data without a header', function () {
            expect(isAuthorizedEvent({
                httpMethod: 'GET'
            })).toBe(false);
        });
        it('rejects data without authorization', function () {
            expect(isAuthorizedEvent({
                headers: {},
                httpMethod: 'GET'
            })).toBe(false);
        });
    });
});
