const AUTH_KEY = "dicoding_story_auth";

const AuthService = {
  setAuth({ userId, name, token }) {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        userId,
        name,
        token,
      })
    );
  },

  getAuth() {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  },

  destroyAuth() {
    localStorage.removeItem(AUTH_KEY);
  },

  isLoggedIn() {
    return !!this.getAuth();
  },


};

export default AuthService;
