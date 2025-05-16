import RegisterPresenter from "./register-presenter";

export default class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter({
      onSuccess: this.showSuccess.bind(this),
      onError: this.showError.bind(this),
    });
  }

  async render() {
    return `
      <section class="container page-transition">
        <h1 class="animate-in">Register</h1>

        <div class="form-container animate-in">
          <div class="form-group">
            <label for="name" class="form-label">Nama</label>
            <input type="text" id="name" class="form-input" placeholder="Masukkan nama lengkap">
            <div id="name-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-input" placeholder="Masukkan email">
            <div id="email-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-input" placeholder="Masukkan password (min. 8 karakter)">
            <div id="password-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <label for="confirm-password" class="form-label">Konfirmasi Password</label>
            <input type="password" id="confirm-password" class="form-input" placeholder="Masukkan password kembali">
            <div id="confirm-password-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <button id="register-button" class="btn btn-primary btn-full">Register</button>
          </div>

          <div id="register-status"></div>

          <div class="form-group text-center">
            <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.nameInput = document.getElementById("name");
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.confirmPasswordInput = document.getElementById("confirm-password");

    this.nameError = document.getElementById("name-error");
    this.emailError = document.getElementById("email-error");
    this.passwordError = document.getElementById("password-error");
    this.confirmPasswordError = document.getElementById("confirm-password-error");
    this.registerStatus = document.getElementById("register-status");
    this.registerButton = document.getElementById("register-button");

    this.registerButton.addEventListener("click", () => {
      this.handleRegister();
    });

    document.querySelectorAll(".form-input").forEach((input) => {
      input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          this.handleRegister();
        }
      });
    });
  }

  async handleRegister() {
    this.clearErrors();

    const name = this.nameInput.value.trim();
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    const isValid = this.presenter.validate({ name, email, password, confirmPassword }, {
      showNameError: (msg) => (this.nameError.textContent = msg),
      showEmailError: (msg) => (this.emailError.textContent = msg),
      showPasswordError: (msg) => (this.passwordError.textContent = msg),
      showConfirmPasswordError: (msg) => (this.confirmPasswordError.textContent = msg),
    });

    if (!isValid) return;

    this.registerStatus.innerHTML = `
      <div class="alert alert-info">Mendaftarkan akun...</div>
    `;
    this.registerButton.disabled = true;

    await this.presenter.register({ name, email, password });
  }

  showSuccess() {
    this.registerStatus.innerHTML = `
      <div class="alert alert-success">Registrasi berhasil! Mengarahkan ke login...</div>
    `;
    setTimeout(() => {
      window.location.hash = "#/login";
    }, 1000);
  }

  showError(message) {
    this.registerStatus.innerHTML = `
      <div class="alert alert-danger">Registrasi gagal: ${message}</div>
    `;
    this.registerButton.disabled = false;
  }

  clearErrors() {
    this.nameError.textContent = "";
    this.emailError.textContent = "";
    this.passwordError.textContent = "";
    this.confirmPasswordError.textContent = "";
    this.registerStatus.innerHTML = "";
  }
}
