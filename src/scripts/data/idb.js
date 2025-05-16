import { openDB } from "idb";
import CONFIG from "../config";
import AuthService from "./auth-service";
const IndexedDB = {
  async createDB() {
    this.db = await openDB(CONFIG.DATABASE_NAME, CONFIG.DATABASE_VERSION, {
      upgrade(database, oldVersion, newVersion) {
        console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);

        // Delete existing object store if it exists
        if (database.objectStoreNames.contains(CONFIG.OBJECT_STORE_NAME)) {
          database.deleteObjectStore(CONFIG.OBJECT_STORE_NAME);
        }

        // Recreate the object store
        const store = database.createObjectStore(CONFIG.OBJECT_STORE_NAME, {
          keyPath: ["id", "userId"],
        });

        // Create necessary indexes
        store.createIndex("userId", "userId");
      },
    });
  },

  async getAllFavorites() {
    const user = AuthService.getAuth();

    if (user == null) return [];

    const favorites = await this.db.getAllFromIndex(
      CONFIG.OBJECT_STORE_NAME,
      "userId",
      user.userId
    );

    return favorites.filter(async (el) => {

      if (el.name == null || el.createdAt == null || el.description == null) {
        await this.deleteFavorite(el.id)
        return false;
      }
      return true

    })

  },

  async addFavorite(data) {
    const user = AuthService.getAuth();

    if (user == null) return;

    await this.db.add(CONFIG.OBJECT_STORE_NAME, {
      id: data.id,
      userId: user.userId,
      ...data
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
