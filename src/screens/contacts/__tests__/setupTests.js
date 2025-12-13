// Polyfill for TextEncoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

test('setupTests', () => {
    expect(true).toBe(true);
});
