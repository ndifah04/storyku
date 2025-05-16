// src/pages/home/home-page.js
import HomePresenter from "./home-presenter.js";

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter();
  }

  async render() {
    return this.presenter.render(); // Delegasi ke presenter
  }

  async afterRender() {
    await this.presenter.afterRender(); // Delegasi ke presenter
  }
}
