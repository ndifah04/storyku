import API from "../../data/api";
import AuthService from "../../data/auth-service";
import IndexedDB from "../../data/idb";
import { showFormattedDate } from "../../utils";
import DetailPresenter from "./detail-presenter";

export default class DetailPage {
  constructor({ params }) {
    this.id = params.id;
    this.presenter = new DetailPresenter({ view: this, params });
    this.story = null;
    this.map = null;
    this.favoriteButton = null;
    this.favorite = false
  }

  async render() {
    return `
      <section class="container page-transition">
        <div class="story-detail-container animate-in">
          <h1 class="animate-in">Memuat detail cerita...</h1>
          <div id="story-content" class="story-content"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    try {
      // Gunakan presenter untuk memuat detail cerita
      const loadStory = await this.presenter.loadStoryDetails();
      this.story = loadStory.story
      this.favorite = loadStory.favorite
      this.renderStoryDetails();

      if (this.story.lat && this.story.lon) {
        this.initMap();
      }
    } catch (error) {
      console.error("Kesalahan saat memuat detail cerita:", error);
      document.querySelector("h1").textContent = "Gagal Memuat Cerita";
      document.getElementById("story-content").innerHTML = `
        <div class="error-message">
          <p>Gagal memuat detail cerita. Silakan coba lagi nanti.</p>
          <p>${error.message}</p>
          <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
        </div>
      `;
    }
  }

  renderStoryDetails() {
    const storyContent = document.getElementById("story-content");
    const heading = document.querySelector("h1");

    heading.textContent = `Cerita oleh ${this.story.name}`;

    storyContent.innerHTML = `
      <div class="story-detail-card card animate-in">
        <img 
          src="${this.story.photoUrl}" 
          alt="Foto oleh ${this.story.name}" 
          class="story-detail-image"
        >
        
        <div class="story-detail-info">
          <p class="story-author">${this.story.name}</p>
          <p class="story-date">
            ${showFormattedDate(this.story.createdAt, "id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          
          <div class="story-description">
            <p>${this.presenter.formatDescription(this.story.description)}</p>
          </div>
          
          ${
            this.story.lat && this.story.lon
              ? `
            <div class="location-info">
              <h3>Lokasi</h3>
              <div id="detail-map" class="detail-map"></div>
            </div>
          `
              : ""
          }
          
          <div class="story-actions">
            <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
            <button id="favorite" class="btn btn-favorite">Favorit</button>
          </div>
        </div>
      </div>
    `;

    this.favoriteButton = document.getElementById("favorite");

    this.#favoriteStory();

    this.#setupFavorite()
  }

  async #favoriteStory() {
    if (this.favorite) {
      this.favoriteButton.classList.add("active");
    } else {
      this.favoriteButton.classList.remove("active")
    }
  }

  #setupFavorite() {
    this.favoriteButton.addEventListener("click", async () => {
      if (this.favorite) {
        await this.presenter.removeFavorite();
        this.favorite = false
      } else {
        await this.presenter.addFavorite();
        this.favorite = true
      }
      this.#favoriteStory()
    });
  }

  initMap() {
    // Inisialisasi peta
    this.map = L.map("detail-map").setView(
      [this.story.lat, this.story.lon],
      13
    );

    // Tambahkan lapisan dasar peta (OpenStreetMap)
    const openStreetMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
      }
    ).addTo(this.map);

    // Tambahkan lapisan tampilan satelit
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri — Sumber: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, dan Komunitas Pengguna GIS",
      }
    );

    // Tambahkan lapisan tampilan topografi
    const topo = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution:
          'Data peta: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor, <a href="http://viewfinderpanoramas.org">SRTM</a> | Gaya peta: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      }
    );

    // Buat kontrol lapisan
    const baseMaps = {
      "Peta Jalan": openStreetMap,
      Satelit: satellite,
      Topografi: topo,
    };

    L.control.layers(baseMaps).addTo(this.map);

    const myIcon = L.icon({
      iconUrl: "/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      shadowUrl: "/images/marker-shadow.png",
      shadowSize: [41, 41],
    });

    // Tambahkan penanda lokasi cerita
    L.marker([this.story.lat, this.story.lon], {
      icon : myIcon,
    })
      .addTo(this.map)
      .bindPopup(
        `<b>${this.story.name}</b><br>${this.story.description.substring(
          0,
          100
        )}...`
      )
      .openPopup();
  }
}
