import { isAuthorizedEvent } from './IAuthorizedEvent';
describe('IAuthorizedEvent', function () {
    describe('interface', function () {
        it('accepts data that has an httpMethod and a string as an Authorization header', function () {
            var event = {
                auth: {},
                headers: {
                    Authorization: 'Bearer TOKEN'
                },
                httpMethod: 'GET'
            };
            expect(event).not.toBeNull();
        });
        it('accepts data that has an httpMethod and an Array as an Authorization header', function () {
            var event = {
                auth: {},
                headers: {
                    Authorization: ['Bearer TOKEN']
                },
                httpMethod: 'GET'
            };
            expect(event).not.toBeNull();
        });
    });
    describe('type guard', function () {
        it('accepts data that has an httpMethod and a string as an Authorization header', function () {
            expect(isAuthorizedEvent({
                headers: {
                    Authorization: 'Bearer TOKEN'
                },
                httpMethod: 'GET'
            })).toBe(true);
        });
        it('accepts data that has an httpMethod and an array of strings as an Authorization header', function () {
            expect(isAuthorizedEvent({
                headers: {
                    Authorization: ['Bearer TOKEN']
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
        it('rejects data where authorization is an array with non-string members', function () {
            expect(isAuthorizedEvent({
                headers: {
                    Authorization: [{}]
                },
                httpMethod: 'GET'
            })).toBe(false);
        });
        it('rejects data where authorization is an empty array', function () {
            expect(isAuthorizedEvent({
                headers: {
                    Authorization: []
                },
                httpMethod: 'GET'
            })).toBe(false);
        });
    });
});
