import CONFIG from "../config";

const API = {
  async register({ name, email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    return await response.json();
  },

  async login({ email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  },

  async getAllStories({ token, page = 1, size = 10, location = 1 }) {
    const response = await fetch(
      `${CONFIG.BASE_URL}/stories?page=${page}&size=${size}&location=${location}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await response.json();
  },

  async getStoryDetail({ token, id }) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  },

  async addNewStory({ token, description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat !== undefined && lon !== undefined) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await response.json();
  },

  async subscribeNotification({ token, subscription }) {

    console.log(JSON.stringify(subscription))

    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    return response;
  },

  async unsubscribeNotification({ token, endpoint }) {
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint }),
    });

    return await response.json();
  },
};

export default API;
