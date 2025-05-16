import AboutPresenter from "./about-presenter.js";

export default class AboutPage {
  constructor() {
    this.presenter = new AboutPresenter(this);
  }

  async render() {
    return `
      <section class="container">
        <h1>About Page</h1>
      </section>
    `;
  }

  async afterRender() {
    this.presenter.init();
  }
}
