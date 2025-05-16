import routes, { checkRoute } from "../routes/routes";
import { getActiveRoute, parseActivePathname } from "../routes/url-parser";
import AuthService from "../data/auth-service";
import { registerSW } from "virtual:pwa-register";
import { urlBase64ToUint8Array } from "../utils";
import API from "../data/api";
import CONFIG from "../config";
import IndexedDB from "../data/idb";

class App {
  #content;
  #drawerButton;
  #navigationDrawer;
  #authNavItem;
  #notifSubsItem;
  #favoritesItem;
  notificationPermission = false;

  constructor({ navigationDrawer, drawerButton, content, authNavItem, notifSubsItem, favoritesItem }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#authNavItem = authNavItem;
    this.#notifSubsItem = notifSubsItem;
    this.#favoritesItem = favoritesItem
    
    this.#setupIndexedDB();
    this.#setupDrawer();
    this.#updateAuthNavItem();
  }

  async #setupServiceWorker() {
    if (!navigator.serviceWorker) {
      console.error("Service Worker tidak berfungsi");
      return;
    }

    console.log("Mendaftarkan Service Worker...");
    registerSW({
      onOfflineReady() {
        console.log("Bisa Offline.");
      },
      onNeedRefresh() {
        console.log(
          "Bisa Update Versi."
        );
      },
      onRegistered: (registration) => {
        console.log("Service Worker terdaftar:", registration);
        this.#setupNotification();
      },
      onRegisterError(error) {
        console.error("Service Worker gagal terdaftar:", error);
      },
    });
  }

  // Mengatur fungsi tombol drawer (menu navigasi)
  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      // Menutup drawer saat salah satu link diklik
      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async #setupIndexedDB() {
    await IndexedDB.createDB()

    console.log("Indexed DB Sudah Siap")
  }

  // Mengatur item navigasi login/logout berdasarkan status autentikasi
  #updateAuthNavItem() {
    if (AuthService.isLoggedIn()) {
      this.#setupServiceWorker();
      this.#showFavorites(true);
      this.#authNavItem.textContent = "Logout";
      this.#authNavItem.href = "#/logout";
      this.#authNavItem.addEventListener("click", (event) => {
        event.preventDefault();
        AuthService.destroyAuth();
        window.location.hash = "#/login";
        this.#updateAuthNavItem();
      });

    } else {
      this.#authNavItem.textContent = "Login";
      this.#authNavItem.href = "#/login";
      this.#showNotification(false);
      this.#showFavorites(false);

    }
  }

  #showFavorites(show) {
    if(!show) {
      this.#favoritesItem.parentElement.style.display = "none";
      return;
    }
    this.#favoritesItem.parentElement.style.display = "block";
  }

  #showNotification(show) {
    if (!show) {
      console.log(this.#notifSubsItem.parentElement)
      this.#notifSubsItem.parentElement.style.display = "none";
      return;
    }

    this.#notifSubsItem.parentElement.style.display = "block";

  }

  async #setupNotification() {
    if (!("Notification" in window)) {
      console.error("Browser tidak mendukung Notification API");
      this.#showNotification(false);
      return;
    }

    this.registrationNotif = await navigator.serviceWorker.getRegistration();

    if (!this.registrationNotif?.pushManager) {
      this.#showNotification(false);
      return
    };

    const existedSubscription =
      await this.registrationNotif?.pushManager?.getSubscription();

    if (existedSubscription) {
      this.subscribe = true;
    }

    this.#notificationNavigator();

    this.#notifSubsItem.addEventListener("click", async () => {
      if (!this.subscribe) {
        await this.#subscribeNotification();
        this.subscribe = true;
      } else {
        await this.#unsubscribeNotification();
        this.subscribe = false;
      }

      this.#notificationNavigator();
    });
  }

  #notificationNavigator() {
    console.log("Notification Navigator");
    this.#showNotification(true);
    if (!this.subscribe) {
      this.#notifSubsItem.textContent = "Berlangganan Notifikasi";
    } else {
      this.#notifSubsItem.textContent = "Batalkan Berlangganan Notifikasi";
    }
  }

  async #subscribeNotification() {

    const result = await Notification.requestPermission();

    if (result === "denied") {
      console.log("Izin notification ditolak.");
      return;
    }

    if (result === "default") {
      console.log("Izin notification ditutup atau diabaikan.");
      return;
    }

    console.log("Izin notification diterima");
    this.notificationPermission = true;

    const auth = AuthService.getAuth();

    if (!auth) return;

    if (!this.subscribe) return

    const subscription = await this.registrationNotif.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    });

    const { endpoint, keys } = subscription.toJSON();

    const subscriptionParse = {
      endpoint: endpoint,
      keys: {
        auth: keys.auth,
        p256dh: keys.p256dh,
      },
    };

    try {


      const response = await API.subscribeNotification({
        token: auth.token,
        subscription: subscriptionParse,
      });

      if (!response.ok) {
        throw new Error("Gagal berlangganan notifikasi");
      }

      alert("Berhasil berlangganan notifikasi");

    } catch (err) {

      alert("Gagal subscribe notification");

      await subscription.unsubscribe()

    }
  }

  async #unsubscribeNotification() {


    console.log("Unsubscribe Notification");
    console.log(this.subscribe);
    if (!this.subscribe) return;

    const auth = AuthService.getAuth();

    if (!auth) return;

    const subscription = await this.registrationNotif.pushManager.getSubscription();

    if (!subscription) return;

    const { endpoint } = subscription.toJSON();

    try {
      const response = await API.unsubscribeNotification({
        token: auth.token,
        endpoint: endpoint,
      });

      const data = await response.json()

      if (!response.ok) {
        console.log(data)
        throw new Error("Gagal membatalkan langganan notifikasi");
      }

      alert("Berhasil membatalkan langganan notifikasi");

      subscription.unsubscribe();

    } catch (err) {
      console.log(err)
      alert("Gagal unsubscribe notification");
    }
  }


  async renderPage() {
    const url = getActiveRoute();
    const urlParams = parseActivePathname();
    const checkedRoute = checkRoute(url);

    if (checkedRoute !== url) {
      window.location.hash = checkedRoute;
      return;
    }

    const routeConfig = routes[url];
    if (!routeConfig) {
      this.#content.innerHTML =
        '<div class="container"><h2>404 - Halaman Tidak Ditemukan</h2></div>';
      return;
    }

    try {
      // Gunakan View Transition API jika tersedia
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          this.#content.innerHTML = await new routeConfig.page({
            params: urlParams,
          }).render();
        }).ready;
      } else {
        this.#content.innerHTML = await new routeConfig.page({
          params: urlParams,
        }).render();
      }

      await new routeConfig.page({ params: urlParams }).afterRender();
      this.#updateAuthNavItem();

      // Terapkan animasi elemen halaman setelah dirender
      this.#animatePageElements();
    } catch (error) {
      console.error("Kesalahan saat merender halaman:", error);
      this.#content.innerHTML = `
        <div class="container">
          <h2>Terjadi kesalahan</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  // Animasi masuk untuk elemen-elemen halaman
  #animatePageElements() {
    const elements = this.#content.querySelectorAll(".animate-in");

    elements.forEach((element, index) => {
      // Menggunakan Animation API untuk animasi khusus
      const animation = element.animate(
        [
          { transform: "translateY(20px)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        {
          duration: 500,
          delay: 100 * index,
          easing: "ease-out",
          fill: "forwards",
        }
      );

      // Hapus kelas animate-in setelah animasi selesai
      animation.onfinish = () => {
        element.classList.remove("animate-in");
      };
    });
  }
}

export default App;
