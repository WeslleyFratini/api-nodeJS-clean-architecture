const loginRouter = require("./login-router");
const MissingParamError = require("../helpers/missing-param-error");
const UnauthorizedError = require("../helpers/unauthorized-error");
const ServerError = require("../helpers/server-error");

const makeSut = () => {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy();
  authUseCaseSpy.accessToken = "valid_token";
  const sut = new loginRouter(authUseCaseSpy);
  return {
    sut,
    authUseCaseSpy,
  };
};

describe("Login Router", () => {
  test("Should return 400 if no email is provider", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provider", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@gmail.com",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 500 if no httpRequest is provider", () => {
    const { sut } = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if  httpRequest has no body", () => {
    const { sut } = makeSut();
    const httpResponse = sut.route({});
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("Should call AuthUseCase with correct params", () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@gmail.com",
        password: "any_password",
      },
    };
    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.password);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("Should return 401 when invalid credentials are provided", () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: "invalid_email@gmail.com",
        password: "invalid_password",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("Should return 200 when valid credentials are provided", () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "valid_email@gmail.com",
        password: "valid_password",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test("Should return 500 if no AthUseCase no has auth metod", () => {
    const sut = new loginRouter({});
    const httpRequest = {
      body: {
        email: "any_email@gmail.com",
        password: "any_password",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 500 if no AthUseCase throws", () => {
    const sut = new loginRouter({});
    const httpRequest = {
      body: {
        email: "any_email@gmail.com",
        password: "any_password",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
