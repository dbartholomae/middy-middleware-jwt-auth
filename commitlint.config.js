module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0, "always", Infinity],
    "scope-case": [0, "always", []],
    "subject-case": [0, "always", []],
  },
};
