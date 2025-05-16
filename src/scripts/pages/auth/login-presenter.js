import API from "../../data/api";
import AuthService from "../../data/auth-service";

export default class LoginPresenter {
  constructor({ onSuccess, onError }) {
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  validate(email, password, { showEmailError, showPasswordError }) {
    if (!email) {
      showEmailError("Email tidak boleh kosong");
      return false
    } else if (!this.isValidEmail(email)) {
      showEmailError("Email tidak valid");
      return false;
    }

    if (!password) {
      showPasswordError("Password tidak boleh kosong");
      return false;
    } else if (password.length < 8) {
      showPasswordError("Password minimal 8 karakter");
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async login(email, password) {
    try {
      const response = await API.login({ email, password });

      if (response.error) {
        throw new Error(response.message);
      }

      const { userId, name, token } = response.loginResult;

      AuthService.setAuth({ userId, name, token });

      this.onSuccess();
    } catch (error) {
      console.error("LoginPresenter Error:", error);
      this.onError(error.message);
    }
  }
}
