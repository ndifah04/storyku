import { openDB } from "idb";
import CONFIG from "../config";
import AuthService from "./auth-service";
const IndexedDB = {
  async createDB() {
    this.db = await openDB(CONFIG.DATABASE_NAME, CONFIG.DATABASE_VERSION, {
      upgrade(database) {
        database.createObjectStore(CONFIG.OBJECT_STORE_NAME, {
          keyPath: ["id", "userId"],
        });
      },
    });
  },

  async addFavorite(id) {
    const user = AuthService.getAuth();

    if (user == null) return;

    await this.db.add(CONFIG.OBJECT_STORE_NAME, {
      id,
      userId: user.userId,
    });
  },

  async deleteFavorite(id) {
    const user = AuthService.getAuth();

    if (user == null) return;

    await this.db.delete(CONFIG.OBJECT_STORE_NAME, [id, user.userId]);
  },
  async isFavorite(id) {
    
    const user = AuthService.getAuth();

    if (user == null) return;

    const favorite = await this.db.get(CONFIG.OBJECT_STORE_NAME, [id, user.userId]);
    
    console.log(favorite)

    return favorite
  },
};

export default IndexedDB;
