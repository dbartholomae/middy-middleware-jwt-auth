# middy-middleware-jwt-auth
 [![npm version](https://badge.fury.io/js/middy-middleware-jwt-auth.svg)](https://npmjs.org/package/middy-middleware-jwt-auth)  [![downloads](https://img.shields.io/npm/dw/middy-middleware-jwt-auth.svg)](https://npmjs.org/package/middy-middleware-jwt-auth)  [![open issues](https://img.shields.io/github/issues-raw/dbartholomae/middy-middleware-jwt-auth.svg)](https://github.com/dbartholomae/middy-middleware-jwt-auth/issues)  [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdbartholomae%2Fmiddy-middleware-jwt-auth.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdbartholomae%2Fmiddy-middleware-jwt-auth?ref=badge_shield) [![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)  [![build status](https://img.shields.io/circleci/project/github/dbartholomae/middy-middleware-jwt-auth/master.svg?style=flat)](https://circleci.com/gh/dbartholomae/workflows/middy-middleware-jwt-auth/tree/master)  [![codecov](https://codecov.io/gh/dbartholomae/middy-middleware-jwt-auth/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/middy-middleware-jwt-auth)  [![dependency status](https://david-dm.org/dbartholomae/middy-middleware-jwt-auth.svg?theme=shields.io)](https://david-dm.org/dbartholomae/middy-middleware-jwt-auth)  [![devDependency status](https://david-dm.org/dbartholomae/middy-middleware-jwt-auth/dev-status.svg)](https://david-dm.org/dbartholomae/middy-middleware-jwt-auth?type=dev)  [![Greenkeeper](https://badges.greenkeeper.io/dbartholomae/middy-middleware-jwt-auth.svg)](https://greenkeeper.io/)  [![semantic release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release#badge)  [![Gitter](https://badges.gitter.im/dbartholomae/middy-middleware-jwt-auth.svg)](https://gitter.im/middy-middleware-jwt-auth) 

A middy JSON web token authorization middleware inspired by express-jwt.

## Installation
Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install middy-middleware-jwt-auth --save
```

## Documentation

There is [additional documentation](https://dbartholomae.github.com/middy-middleware-jwt-auth). 

## Usage

```typescript
import middy from 'middy'
import JWTAuthMiddleware, { EncryptionAlgorithms, IAuthorizedEvent } from 'middy-middleware-jwt-auth'
import { httpErrorHandler, httpHeaderNormalizer } from 'middy/middlewares'
import createHttpError from 'http-errors'

interface ITokenPayload {
  permissions: string[]
}

function isTokenPayload (token: any): token is ITokenPayload {
  return token != null &&
    Array.isArray(token.permissions) &&
    token.permissions.every((permission: any) => typeof permission === 'string')
}

// This is your AWS handler
const helloWorld = async (event: IAuthorizedEvent) => {
  // The middleware adds auth information if a valid token was added
  // If no auth was found, event.auth will remain undefined. You have to check
  // that it exists and that it has the expected form.
  if (!isTokenPayload(event.auth)) {
    throw createHttpError(401, 'No valid bearer token was set in the authorization header', {
      type: 'AuthenticationRequired'
    })
  }
  const auth: ITokenPayload = event.auth

  // Check for authorization
  if (auth.permissions.indexOf('helloWorld') === -1) {
    throw createHttpError(403, `User not authorized for helloWorld, only found permissions [${auth.permissions.join(', ')}]`, {
      type: 'NotAuthorized'
    })
  }

  return {
    body: JSON.stringify({ data: 'Hello world!' }),
    statusCode: 200
  }
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
export const handler = middy(helloWorld)
  .use(httpHeaderNormalizer()) // Make sure authorization header is saved in lower case
  .use(httpErrorHandler()) // This middleware is needed do handle the errors thrown by the JWTAuthMiddleware
  .use(JWTAuthMiddleware({
    /** Algorithm to verify JSON web token signature */
    algorithm: EncryptionAlgorithms.HS256,
    /** A string or buffer containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA */
    secretOrPublicKey: 'secret'
  }))
```
