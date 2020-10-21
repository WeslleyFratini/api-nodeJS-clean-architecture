const EmailValidator = require("./emailValidator");
const validator = require("validator");

const makeSut = () => {
  return new EmailValidator();
};

describe("Email Validator", () => {
  test("Show return ture if validator returns true", () => {
    const sut = new EmailValidator();
    sut.isMailValid("valid_email@mail.com");
    expect(isMailValid).toBe(true);
  });

  test("Should return false if validator returns false", () => {
    validator.isEmailValid = false;
    const sut = new EmailValidator();
    sut.isMailValid("invalid_email@mail.com");
    expect(isMailValid).toBe(false);
  });

  test("Should call validator with correct email", () => {
    const sut = makeSut();
    sut.isValid("any_email@mail.com");
    expect(validator.email).toBe("any_email@mail.com");
  });
});
