module.exports = {
  extends: [require.resolve('@pangu/lint/typescript/react')],
  rules: {},
  globals: {
    wx: false,
    dd: false,
  }
};
