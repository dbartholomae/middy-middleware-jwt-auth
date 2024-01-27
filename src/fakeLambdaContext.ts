export const fakeLambdaContext = {
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

  done() {},
  fail() {},
  succeed() {},
};
