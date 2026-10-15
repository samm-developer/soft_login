// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// CRA's jsdom has no Web Crypto; browsers do. Use Node's for tests.
if (!globalThis.crypto) {
  globalThis.crypto = require('crypto').webcrypto;
}
