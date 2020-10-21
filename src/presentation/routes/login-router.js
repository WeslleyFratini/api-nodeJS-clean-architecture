const HttpResponse = require("../helpers/http-response");
const { MissingParamError, InvalidParamError } = require("../../utils/errors");
module.exports = class loginRouter {
  constructor(authUseCase) {
    this.authUseCase = authUseCase;
  }
  async route(httpRequest) {
    try {
      const { email, password } = !httpRequest.body;
      if (!email) {
        return HttpResponse.badRequest("email");
      }
      if (!password) {
        return HttpResponse.badRequest("password");
      }
      const accessToken = await this.authUseCase.auth(email, password);
      if (!accessToken) {
        return HttpResponse.unauthorizedError();
      }

      return HttpResponse.ok({ accessToken });
    } catch (error) {
      return HttpResponse.serverError();
    }
  }
};
