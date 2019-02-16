var _this = this;
import * as tslib_1 from "tslib";
import JWTAuthMiddleware from './JWTAuthMiddleware';
import { EncryptionAlgorithms } from './interfaces/IAuthOptions';
import JWT from 'jsonwebtoken';
import createHttpError from 'http-errors';
describe('JWTAuthMiddleware', function () {
    it('throws a type error when options are misformed', function () {
        expect(function () { return JWTAuthMiddleware({}); }).toThrowError(TypeError);
    });
    describe('before hook', function () {
        it('resolves successfully if event is misformed', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var next, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next = jest.fn();
                        options = {
                            algorithm: EncryptionAlgorithms.ES256,
                            secretOrPublicKey: 'secret'
                        };
                        return [4 /*yield*/, expect(JWTAuthMiddleware(options).before({}, next)).resolves.toEqual(undefined)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('resolves if token is valid', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var next, options, token, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        next = jest.fn();
                        options = {
                            algorithm: EncryptionAlgorithms.HS256,
                            secretOrPublicKey: 'secret'
                        };
                        token = JWT.sign({}, options.secretOrPublicKey, {
                            algorithm: options.algorithm
                        });
                        _a = expect;
                        return [4 /*yield*/, JWTAuthMiddleware(options).before({
                                event: {
                                    headers: {
                                        Authorization: "Bearer " + token
                                    },
                                    httpMethod: 'GET'
                                },
                                context: {},
                                response: null,
                                error: {},
                                callback: jest.fn()
                            }, next)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(undefined);
                        return [2 /*return*/];
                }
            });
        }); });
        it('resolves if token is only entry in an array', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var next, options, token, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        next = jest.fn();
                        options = {
                            algorithm: EncryptionAlgorithms.HS256,
                            secretOrPublicKey: 'secret'
                        };
                        token = JWT.sign({}, options.secretOrPublicKey, {
                            algorithm: options.algorithm
                        });
                        _a = expect;
                        return [4 /*yield*/, JWTAuthMiddleware(options).before({
                                event: {
                                    headers: {
                                        Authorization: ["Bearer " + token]
                                    },
                                    httpMethod: 'GET'
                                },
                                context: {},
                                response: null,
                                error: {},
                                callback: jest.fn()
                            }, next)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(undefined);
                        return [2 /*return*/];
                }
            });
        }); });
        it('saves token information to event.auth if token is valid', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var next, options, data, token, event;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next = jest.fn();
                        options = {
                            algorithm: EncryptionAlgorithms.HS256,
                            secretOrPublicKey: 'secret'
                        };
                        data = { userId: 1 };
                        token = JWT.sign(data, options.secretOrPublicKey, {
                            algorithm: options.algorithm
                        });
                        event = {
                            headers: {
                                Authorization: "Bearer " + token
                            },
                            httpMethod: 'GET'
                        };
                        return [4 /*yield*/, JWTAuthMiddleware(options).before({
                                event: event,
                                context: {},
                                response: null,
                                error: {},
                                callback: jest.fn()
                            }, next)];
                    case 1:
                        _a.sent();
                        expect(event.auth).toEqual(tslib_1.__assign({}, data, { iat: expect.any(Number) }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects if event.auth is already filled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var next, options, data, token, event;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next = jest.fn();
                        options = {
                            algorithm: EncryptionAlgorithms.HS256,
                            secretOrPublicKey: 'secret'
                        };
                        data = { userId: 1 };
                        token = JWT.sign(data, options.secretOrPublicKey, {
                            algorithm: options.algorithm
                        });
                        event = {
                            auth: {},
                            headers: {
                                Authorization: "Bearer " + token
                            },
                            httpMethod: 'GET'
                        };
                        return [4 /*yield*/, expect(JWTAuthMiddleware(options).before({
                                event: event,
                                context: {},
                                response: null,
                                error: {},
                                callback: jest.fn()
                            }, next)).rejects.toEqual(createHttpError(400, 'The events auth property has to be empty', {
                                type: 'EventAuthNotEmpty'
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects if Authorization header is malformed', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var next, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next = jest.fn();
                        options = {
                            algorithm: EncryptionAlgorithms.HS256,
                            secretOrPublicKey: 'secret'
                        };
                        return [4 /*yield*/, expect(JWTAuthMiddleware(options).before({
                                event: {
                                    headers: {
                                        Authorization: 'Malformed header'
                                    },
                                    httpMethod: 'GET'
                                },
                                context: {},
                                response: null,
                                error: {},
                                callback: jest.fn()
                            }, next)).rejects.toEqual(createHttpError(401, 'Format should be "Authorization: Bearer [token]", received "Authorization: Malformed header" instead', {
                                type: 'WrongAuthFormat'
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects if token is invalid', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var next, options, token;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next = jest.fn();
                        options = {
                            algorithm: EncryptionAlgorithms.HS256,
                            secretOrPublicKey: 'secret'
                        };
                        token = JWT.sign({}, 'wrong secret', {
                            algorithm: options.algorithm
                        });
                        return [4 /*yield*/, expect(JWTAuthMiddleware(options).before({
                                event: {
                                    headers: {
                                        Authorization: "Bearer " + token
                                    },
                                    httpMethod: 'GET'
                                },
                                context: {},
                                response: null,
                                error: {},
                                callback: jest.fn()
                            }, next)).rejects.toEqual(createHttpError(401, 'Invalid token', {
                                type: 'InvalidToken'
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
