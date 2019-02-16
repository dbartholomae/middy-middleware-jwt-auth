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
