import JWTAuthMiddleware, {
  EncryptionAlgorithms,
  IAuthorizedEvent,
  isAuthOptions,
  isAuthorizedEvent,
} from "./JWTAuthMiddleware";

import createHttpError from "http-errors";
import JWT from "jsonwebtoken";
import moment from "moment";

const fakeLambdaContext = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "handler",
  functionVersion: "1",
  invokedFunctionArn:
    "arn:aws:lambda:us-west-2:123456789012:function:my-function",
  memoryLimitInMB: "100",
  awsRequestId: "id",
  logGroupName: "logGroup",
  logStreamName: "logStreamName",

  getRemainingTimeInMillis() {
    return 100;
  },

  done() { },
  fail() { },
  succeed() { },
};

describe("exports", () => {
  it("reexports EncryptionAlgorithms", () => {
    expect(EncryptionAlgorithms).toBeDefined();
  });

  it("reexports isAuthOptions", () => {
    expect(isAuthOptions).toBeDefined();
  });

  it("reexports isAuthorizedEvent", () => {
    expect(isAuthorizedEvent).toBeDefined();
  });
});

describe("JWTAuthMiddleware", () => {
  it("throws a type error when options are misformed", () => {
    expect(() => JWTAuthMiddleware({} as never)).toThrow(TypeError);
  });

  describe("before hook", () => {
    describe("without a payload type guard", () => {
      it("resolves successfully if event is misformed", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: "secret",
        };
        await expect(
          JWTAuthMiddleware(options).before({} as never),
        ).resolves.toEqual(undefined);
      });

      it("resolves if token is valid", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const token = JWT.sign({}, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        expect(
          await JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event: {
              headers: {
                Authorization: `Bearer ${ token }`,
              },
              httpMethod: "GET",
            },
            response: null,
            internal: {},
          }),
        ).toEqual(undefined);
      });

      it("resolves if token is given in lower case authorization header", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const token = JWT.sign({}, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        expect(
          await JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event: {
              headers: {
                authorization: `Bearer ${ token }`,
              },
              httpMethod: "GET",
            },
            response: null,
            internal: {},
          }),
        ).toEqual(undefined);
      });

      it("resolves if token is only entry in an array", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const token = JWT.sign({}, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        expect(
          await JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event: {
              headers: {
                Authorization: [`Bearer ${ token }`],
              },
              httpMethod: "GET",
            },
            response: null,
            internal: {},
          }),
        ).toEqual(undefined);
      });

      it("resolves if secretOrPublicKey is a function", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: (header: any, callback: any) => callback(null, "secret"),
        };
        const token = JWT.sign({}, options.secretOrPublicKey({}, (err: any, key: any) => key), {
          algorithm: options.algorithm,
        });
        expect(
          await JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event: {
              headers: {
                Authorization: `Bearer ${ token }`,
              },
              httpMethod: "GET",
            },
            response: null,
            internal: {},
          }),
        ).toEqual(undefined);
      });

      it("saves token information to event.auth.payload if token is valid", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const data = { userId: 1 };
        const token = JWT.sign(data, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        const event: IAuthorizedEvent = {
          headers: {
            Authorization: `Bearer ${ token }`,
          },
          httpMethod: "GET",
        };
        await JWTAuthMiddleware(options).before({
          context: fakeLambdaContext,
          error: {} as Error,
          event,
          response: null,
          internal: {},
        });
        expect(event.auth!.payload).toEqual({
          ...data,
          iat: expect.any(Number),
        });
      });

      it("saves the token itself to event.auth.token if token is valid", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const data = { userId: 1 };
        const token = JWT.sign(data, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        const event: IAuthorizedEvent = {
          headers: {
            Authorization: `Bearer ${ token }`,
          },
          httpMethod: "GET",
        };
        await JWTAuthMiddleware(options).before({
          context: fakeLambdaContext,
          error: {} as Error,
          event,
          response: null,
          internal: {},
        });
        expect(event.auth!.token).toEqual(token);
      });

      it("rejects if event.auth is already filled", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const data = { userId: 1 };
        const token = JWT.sign(data, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        const event: IAuthorizedEvent = {
          auth: { payload: "", token: "" },
          headers: {
            Authorization: `Bearer ${ token }`,
          },
          httpMethod: "GET",
        };
        await expect(
          JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event,
            response: null,
            internal: {},
          }),
        ).rejects.toEqual(
          createHttpError(400, "The events auth property has to be empty", {
            type: "EventAuthNotEmpty",
          }),
        );
      });

      it("rejects if both authorization and Authorization headers are set", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const data = { userId: 1 };
        const token = JWT.sign(data, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        const event: IAuthorizedEvent = {
          headers: {
            Authorization: `Bearer ${ token }`,
            authorization: `Bearer ${ token }`,
          },
          httpMethod: "GET",
        };
        await expect(
          JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event,
            response: null,
            internal: {},
          }),
        ).rejects.toEqual(
          createHttpError(
            400,
            "Both authorization and Authorization headers found, only one can be set",
            {
              type: "MultipleAuthorizationHeadersSet",
            },
          ),
        );
      });

      it("rejects if Authorization header is malformed", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        await expect(
          JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event: {
              headers: {
                Authorization: "Malformed header",
              },
              httpMethod: "GET",
            },
            response: null,
            internal: {},
          }),
        ).rejects.toEqual(
          createHttpError(
            401,
            'Format should be "Authorization: Bearer [token]", received "Authorization: Malformed header" instead',
            {
              type: "WrongAuthFormat",
            },
          ),
        );
      });

      it("rejects if token is invalid", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const token = JWT.sign({}, "wrong secret", {
          algorithm: options.algorithm,
        });
        await expect(
          JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event: {
              headers: {
                Authorization: `Bearer ${ token }`,
              },
              httpMethod: "GET",
            },
            response: null,
            internal: {},
          }),
        ).rejects.toEqual(
          createHttpError(401, "Invalid token", {
            type: "InvalidToken",
          }),
        );
      });

      it("rejects if token is expired", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const token = JWT.sign({ exp: 1 }, "secret", {
          algorithm: options.algorithm,
        });
        await expect(
          JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event: {
              headers: {
                Authorization: `Bearer ${ token }`,
              },
              httpMethod: "GET",
            },
            response: null,
            internal: {},
          }),
        ).rejects.toEqual(
          createHttpError(
            401,
            "Token expired at Thu, 01 Jan 1970 00:00:01 GMT",
            {
              expiredAt: new Date(
                "Thu Jan 01 1970 01:00:01 GMT+0100 (GMT+01:00)",
              ),
              type: "TokenExpiredError",
            },
          ),
        );
      });

      it("rejects if token isn't valid yet", async () => {
        const validDate = new Date("2100-01-01T00:00:00Z");
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
        };
        const token = JWT.sign({ nbf: moment(validDate).unix() }, "secret", {
          algorithm: options.algorithm,
        });
        await expect(
          JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event: {
              headers: {
                Authorization: `Bearer ${ token }`,
              },
              httpMethod: "GET",
            },
            response: null,
            internal: {},
          }),
        ).rejects.toEqual(
          createHttpError(401, `Token not valid before ${ validDate }`, {
            date: validDate,
            type: "NotBeforeError",
          }),
        );
      });
      it("rejects if authorization is required and no authorization header is set", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          credentialsRequired: true,
          secretOrPublicKey: "secret",
        };
        await expect(
          JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event: {
              httpMethod: "GET",
            },
            response: null,
            internal: {},
          }),
        ).rejects.toEqual(
          createHttpError(
            401,
            "No valid bearer token was set in the authorization header",
            {
              type: "AuthenticationRequired",
            },
          ),
        );
      });
    });

    describe("with a payload type guard", () => {
      interface IPayload {
        userId: number;
      }

      function isPayload(payload: unknown): payload is IPayload {
        return (
          typeof payload === "object" &&
          payload != null &&
          "userId" in payload &&
          typeof payload.userId === "number"
        );
      }

      it("saves token information to event.auth.payload if token is valid", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          isPayload,
          secretOrPublicKey: "secret",
        };
        const data = { userId: 1 };
        const token = JWT.sign(data, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        const event: IAuthorizedEvent = {
          headers: {
            Authorization: `Bearer ${ token }`,
          },
          httpMethod: "GET",
        };
        await JWTAuthMiddleware(options).before({
          context: fakeLambdaContext,
          error: {} as Error,
          event,
          response: null,
          internal: {},
        });
        expect(event.auth!.payload).toEqual({
          ...data,
          iat: expect.any(Number),
        });
      });

      it("rejects if payload doesn't pass the payload type guard", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          isPayload,
          secretOrPublicKey: "secret",
        };
        const data = { iat: 1, user: 1 };
        const token = JWT.sign(data, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        const event: IAuthorizedEvent = {
          headers: {
            Authorization: `Bearer ${ token }`,
          },
          httpMethod: "GET",
        };
        await expect(
          JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event,
            response: null,
            internal: {},
          }),
        ).rejects.toEqual(
          createHttpError(
            400,
            'Token payload malformed, was {"iat":1,"user":1}',
            {
              payload: { iat: 1, user: 1 },
              type: "TokenPayloadMalformedError",
            },
          ),
        );
      });
    });

    describe("with custom tokenSources", () => {
      interface CustomEvent {
        httpMethod: string;
        queryStringParameters: { token: string };
        auth?: { payload: unknown };
      }

      it("resolves successfully if no token is found", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.ES256,
          secretOrPublicKey: "secret",
          tokenSource: (event: CustomEvent) =>
            event.queryStringParameters.token,
        };
        await expect(
          JWTAuthMiddleware(options).before({} as never),
        ).resolves.toEqual(undefined);
      });

      it("resolves successfully when async tokenSource is used", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS512,
          secretOrPublicKey: "secret",
          tokenSource: async (event: CustomEvent) =>
            event.queryStringParameters.token,
        };
        const data = { userId: 1 };
        const token = JWT.sign(data, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        const event: CustomEvent = {
          httpMethod: "GET",
          queryStringParameters: { token },
        };
        await expect(
          JWTAuthMiddleware(options).before({
            context: fakeLambdaContext,
            error: {} as Error,
            event,
            response: null,
            internal: {},
          }),
        ).resolves.toEqual(undefined);
      });

      it("saves token information to event.auth.payload if token is valid", async () => {
        const options = {
          algorithm: EncryptionAlgorithms.HS256,
          secretOrPublicKey: "secret",
          tokenSource: (e: CustomEvent) => e.queryStringParameters.token,
        };
        const data = { userId: 1 };
        const token = JWT.sign(data, options.secretOrPublicKey, {
          algorithm: options.algorithm,
        });
        const event: CustomEvent = {
          httpMethod: "GET",
          queryStringParameters: { token },
        };
        await JWTAuthMiddleware(options).before({
          context: fakeLambdaContext,
          error: {} as Error,
          event,
          response: null,
          internal: {},
        });
        expect(event.auth?.payload).toEqual({
          ...data,
          iat: expect.any(Number),
        });
      });
    });
  });
});
