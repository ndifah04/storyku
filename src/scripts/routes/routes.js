import HomePage from "../pages/home/home-page";
import DetailPage from "../pages/detail/detail-page";
import AddStoryPage from "../pages/add-story/add-story-page";
import LoginPage from "../pages/auth/login-page";
import RegisterPage from "../pages/auth/register-page";
import AboutPage from "../pages/about/about-page";
import AuthService from "../data/auth-service";
import FavoritesPage from "../pages/favorite/favorite-page";

const routes = {
  "/": {
    page: HomePage,
    needAuth: true,
  },
  "/detail/:id": {
    page: DetailPage,
    needAuth: true,
  },
  "/add": {
    page: AddStoryPage,
    needAuth: true,
  },
  "/login": {
    page: LoginPage,
    needAuth: false,
  },
  "/register": {
    page: RegisterPage,
    needAuth: false,
  },
  "/about": {
    page: AboutPage,
    needAuth: false,
  },
  "/favorites" : {
    page : FavoritesPage,
    needAuth : true
  }
};

export function checkRoute(route) {
  const routeConfig = routes[route];

  if (!routeConfig) return null;

  if (routeConfig.needAuth && !AuthService.isLoggedIn()) {
    return "/login";
  }

  if (route === "/login" && AuthService.isLoggedIn()) {
    return "/";
  }

  if (route === "/register" && AuthService.isLoggedIn()) {
    return "/";
  }

  return route;
}

export default routes;
