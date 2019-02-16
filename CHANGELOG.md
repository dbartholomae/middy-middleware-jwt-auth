## [2.1.1](https://github.com/dbartholomae/middy-middleware-jwt-auth/compare/2.1.0...2.1.1) (2019-02-16)


### Bug Fixes

* stringify JWTAuthMiddleware options in error ([2f09634](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/2f09634))

# [2.1.0](https://github.com/dbartholomae/middy-middleware-jwt-auth/compare/2.0.0...2.1.0) (2019-02-16)


### Bug Fixes

* standardize date format in TokenExpired error message ([8ac46c9](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/8ac46c9))


### Features

* add logging of encryption algorithm in debug mode ([d4854b1](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/d4854b1))
* allow to check token payload with a type guard ([842232b](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/842232b))
* throw more explicit error if token expired ([50896bd](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/50896bd))
* throw more explicit error if token isn't valid yet ([3cb1c33](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/3cb1c33))

# [2.0.0](https://github.com/dbartholomae/middy-middleware-jwt-auth/compare/1.1.0...2.0.0) (2019-02-16)


### Features

* accept lower case authorization header ([86d9aaa](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/86d9aaa))
* add source maps to output ([74d7aab](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/74d7aab))


### BREAKING CHANGES

* Previously lowercase authorization headers were ignored. Now if both a lower case authorization and an upper case Authorization header are present, an error is thrown. Currently the middleware does not support use cases where both headers are present.

# [1.1.0](https://github.com/dbartholomae/middy-middleware-jwt-auth/compare/1.0.0...1.1.0) (2019-02-16)


### Features

* accept multivalue header format ([7d30dd1](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/7d30dd1))

# 1.0.0 (2019-02-15)


### Features

* add IAuthOptions interface ([05968f2](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/05968f2))
* add IAuthorizedEvent type ([91e785e](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/91e785e))
* add types to errors ([af89543](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/af89543))
* check if token is valid ([76bd162](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/76bd162))
* improve error message for wrong auth format ([7f40831](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/7f40831))
* save auth data to event.auth ([48d7646](https://github.com/dbartholomae/middy-middleware-jwt-auth/commit/48d7646))
