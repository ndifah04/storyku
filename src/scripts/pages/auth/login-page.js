import LoginPresenter from "./login-presenter";

export default class LoginPage {
  constructor() {
    this.presenter = new LoginPresenter({
      onSuccess: this.showSuccess.bind(this),
      onError: this.showError.bind(this),
    });
  }

  async render() {
    return `
      <section class="container page-transition">
        <h1 class="animate-in">Login</h1>

        <div class="form-container animate-in">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-input" placeholder="Masukkan email">
            <div id="email-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-input" placeholder="Masukkan password">
            <div id="password-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <button id="login-button" class="btn btn-primary btn-full">Login</button>
          </div>

          <div id="login-status"></div>

          <div class="form-group text-center">
            <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.emailError = document.getElementById("email-error");
    this.passwordError = document.getElementById("password-error");
    this.loginButton = document.getElementById("login-button");
    this.loginStatus = document.getElementById("login-status");

    this.loginButton.addEventListener("click", () => {
      this.handleLogin();
    });

    document.querySelectorAll(".form-input").forEach((input) => {
      input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          this.handleLogin();
        }
      });
    });
  }

  async handleLogin() {
    this.clearErrors();

    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;

    const isValid = this.presenter.validate(email, password, {
      showEmailError: (msg) => (this.emailError.textContent = msg),
      showPasswordError: (msg) => (this.passwordError.textContent = msg),
    });

    if (!isValid) return;

    this.loginButton.disabled = true;
    this.loginStatus.innerHTML = `
      <div class="alert alert-info">
        <p>Logging in...</p>
      </div>
    `;

    await this.presenter.login(email, password);
  }

  showSuccess() {
    this.loginStatus.innerHTML = `
      <div class="alert alert-success">
        <p>Login berhasil! Mengarahkan...</p>
      </div>
    `;

    setTimeout(() => {
      window.location.hash = "#/";
    }, 1000);
  }

  showError(message) {
    this.loginStatus.innerHTML = `
      <div class="alert alert-danger">
        <p>Login gagal: ${message}</p>
      </div>
    `;
    this.loginButton.disabled = false;
  }

  clearErrors() {
    this.emailError.textContent = "";
    this.passwordError.textContent = "";
    this.loginStatus.innerHTML = "";
  }
}
