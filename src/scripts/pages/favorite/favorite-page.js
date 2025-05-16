// src/pages/home/home-page.js

import FavoritesPresenter from "./favorite-presenter";

export default class FavoritesPage {
  constructor() {
    this.presenter = new FavoritesPresenter();
  }

  async render() {
    return this.presenter.render(); // Delegasi ke presenter
  }

  async afterRender() {
    await this.presenter.afterRender(); // Delegasi ke presenter
  }
}
