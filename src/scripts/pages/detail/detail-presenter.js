import API from "../../data/api";
import AuthService from "../../data/auth-service";
import IndexedDB from "../../data/idb";

class DetailPresenter {
  constructor({ view, params }) {
    this.view = view;
    this.params = params;
    this.story = null;
  }

  async loadStoryDetails() {
    const auth = AuthService.getAuth();
    if (!auth) {
      throw new Error("Autentikasi diperlukan");
    }

    const response = await API.getStoryDetail({
      token: auth.token,
      id: this.params.id,
    });

    if (response.error) {
      throw new Error(response.message);
    }

    this.story = response.story;

    const isFavorite = await IndexedDB.isFavorite(this.params.id);

    return { story: this.story, favorite: isFavorite };
  }

  async addFavorite() {
    await IndexedDB.addFavorite(this.story);
  }

  async removeFavorite() {
    await IndexedDB.deleteFavorite(this.params.id);
  }

  formatDescription(description) {
    // Ganti baris baru dengan paragraf terpisah
    return description
      .split("\n")
      .map((paragraph) => (paragraph.trim() ? `<p>${paragraph}</p>` : ""))
      .join("");
  }
}

export default DetailPresenter;
