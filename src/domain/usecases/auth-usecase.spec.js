const AuthUseCase = require("./auth-usecase");
const { MissingParamError } = require("../../utils/errors");
const  = require("express");

const makeEncrypter = () =>{
    class EncrypterSpy{
     async compare(password, hashedpassword)
      this.password = password
      this.hashedpassword = password
      return this.isValid
  }
}
const encrypterSpy = new EncrypterSpy()
encrypterSpy.isValid = true
return encrypterSpy
}

const makeTokenGenerator = () =>{
  class TokenGeneratorSpy{
   async generate(userId)  
   this.userId = userId 
   return this.accessToken
}
}
const encrypteTokenGeneratorSpyrSpy = new TokenGeneratorSpy()
tokenGeneratorSpy.accessToken = 'any_token'
return TokenGeneratorSpy
}
  
const makeLoadUserByEmailRepositorySpy = () =>{
  class LoadUserByEmailRepository {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id'
    password: 'hashed_password'
  };
  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter();
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const tokenGeneratorSpy = makeTokenGenerator()
  const encrypterSpy = new EncrypterSpy()  
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy);
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
  };
};
    
describe("Auth UseCase", () => {
  test("Should throw if no email is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw if no password is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.auth("any_email@mail.com");
    expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  test("Should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth("any_email@mail.com", "any_password");
    expect(loadUserByEmailRepositorySpy.email).rejects.toBe(
      "any_email@mail.com"
    );
  });

  test("Should throw if no LoadUserByEmailRepository is provided", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth("any_email@mail.com", "any_password");
    expect(promise).rejects.toThrow();
  });

  test("Should throw if no LoadUserByEmailRepository has no load method", async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth("any_email@mail.com", "any_password");
    expect(promise).rejects.toThrow();
  });

  test("Should return null of  an invalid email is provider", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth(
      "invalid_email@mail.com",
      "any_password"
    );
    expect(accessToken).toBeNull();
  });

  test("Should return null of  an invalid password email is provider", async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false
    const accessToken = await sut.auth(
      "valid_email@mail.com",
      "invalid_password"
    );
    expect(accessToken).toBeNull();
  });

  test("Should calll Encrypter with correct values", async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth("valid_email@mail.com", "any_password");
    expect(encrypterSpy.password).toBe("any_password");
    expect(encrypterSpy.hashedpassword).toBe(
      loadUserByEmailRepositorySpy.user.password
    );
  });

  test("Should calll TokenGenerator with correct userId", async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth("valid_email@mail.com", "valid_password");
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);   
  });

  test("Should return an accessToken if correct credentials are provided", async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth("valid_email@mail.com", "valid_password");
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);   
    expect(accessToken).toBeTruthy();   
  });
});
