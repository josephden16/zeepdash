const { capitalize, generateSlug, validatePassword, formatPhoneNumber, validateEmail, validateName } = require('../utils');

describe("form validation functions", () => {
  test('password validation function', () => {
    expect(validatePassword("Joseph1233")).toBe(true);
    expect(validatePassword("invalidPassword")).toBe(false);
    expect(validatePassword("Thispasswordisverylengthy12334")).toBe(false);
    expect(validatePassword("")).toBe(false);
    expect(validatePassword(null)).toBe(false);
    expect(validatePassword(12192301)).toBe(false);
  });

  test('format phone number function', () => {
    expect(formatPhoneNumber("08034412178")).toBe("+2348034412178");
    expect(formatPhoneNumber("+23408012134467")).toBe("+23408012134467");
    expect(formatPhoneNumber("")).toBeNull();
    expect(formatPhoneNumber(132901)).toBeNull();
    expect(formatPhoneNumber(null)).toBeNull();
  });

  test('email validation function', () => {
    expect(validateEmail("joseph@gmail.com")).toBe(true);
    expect(validateEmail("joseph")).toBe(false);
    expect(validateEmail("")).toBe(false);
    expect(validateEmail(12991)).toBe(false);
  });

  test('name validation function', () => {
    expect(validateName("")).toBe(false);
    expect(validateName("Joseph Denedo")).toBe(true);
    expect(validateName("123 Joe")).toBe(false);
  });

});

test('capitalize function', () => {
  expect(capitalize('joseph')).toBe('Joseph');
});

test('generate slug function', () => {
  expect(generateSlug("Food mataz")).toBe("food-mataz");
  expect(generateSlug("Bite me sandwiches")).toBe("bite-me-sandwiches");
});
