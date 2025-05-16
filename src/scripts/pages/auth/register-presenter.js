import API from "../../data/api";

export default class RegisterPresenter {
  constructor({ onSuccess, onError }) {
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  validate({ name, email, password, confirmPassword }, callbacks) {
    const {
      showNameError,
      showEmailError,
      showPasswordError,
      showConfirmPasswordError,
    } = callbacks;

    let isValid = true;

    if (!name) {
      showNameError("Nama tidak boleh kosong");
      isValid = false;
    }

    if (!email) {
      showEmailError("Email tidak boleh kosong");
      isValid = false;
    } else if (!this.isValidEmail(email)) {
      showEmailError("Email tidak valid");
      isValid = false;
    }

    if (!password || password.length < 8) {
      showPasswordError("Password minimal 8 karakter");
      isValid = false;
    }

    if (password !== confirmPassword) {
      showConfirmPasswordError("Password tidak cocok");
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async register({ name, email, password }) {
    try {
      const response = await API.register({ name, email, password });

      if (response.error) {
        throw new Error(response.message || "Registrasi gagal");
      }

      this.onSuccess();
    } catch (error) {
      console.error("RegisterPresenter Error:", error);
      this.onError(error.message || "Terjadi kesalahan saat registrasi.");
    }
  }
}
