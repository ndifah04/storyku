import API from "../../data/api";
import AuthService from "../../data/auth-service";

export default class AddStoryPage {
  constructor() {
    this.mediaStream = null;
    this.photoBlob = null;
    this.selectedLocation = null;
    this.map = null;
    this.locationMarker = null;
  }

  async render() {
    return `
      <section class="container page-transition">
        <h1 class="animate-in">Tambah Story Baru</h1>
        <div class="form-container animate-in">
          <div class="form-group">
            <label for="camera-section" class="form-label">Foto Story</label>
            <div id="camera-section" class="camera-container">
              <video id="camera-preview" class="camera-preview" autoplay playsinline></video>
              <canvas id="camera-canvas" class="camera-preview" style="display: none;"></canvas>
              <img id="captured-image" class="captured-image" alt="Foto yang diambil">
              <div class="camera-controls">
                <button id="capture-button" class="camera-button" aria-label="Ambil foto">
                  <span>📸</span>
                </button>
                <button id="retake-button" class="camera-button" style="display: none;" aria-label="Ambil ulang foto">
                  <span>🔄</span>
                </button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="location-picker" class="form-label">Lokasi (Opsional - Klik pada peta untuk memilih)</label>
            <div id="location-picker" class="map-picker"></div>
            <p id="selected-location" class="form-text">Belum ada lokasi dipilih</p>
          </div>
          <div class="form-group">
            <label for="description" class="form-label">Deskripsi</label>
            <textarea id="description" class="form-input" rows="4" placeholder="Ceritakan pengalamanmu..."></textarea>
            <div id="description-error" class="form-error"></div>
          </div>
          <div class="form-group">
            <button id="submit-button" class="btn btn-primary btn-full">Post Story</button>
          </div>
          <div id="submission-status"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.initializeElements();
    await this.setupCamera();
    this.initMap();
    this.setupEventListeners();

    // Cleanup resources when leaving the page
    window.addEventListener("hashchange", this.cleanupResources.bind(this));
  }

  initializeElements() {
    this.cameraPreview = document.getElementById("camera-preview");
    this.cameraCanvas = document.getElementById("camera-canvas");
    this.capturedImage = document.getElementById("captured-image");
    this.captureButton = document.getElementById("capture-button");
    this.retakeButton = document.getElementById("retake-button");
    this.descriptionInput = document.getElementById("description");
    this.descriptionError = document.getElementById("description-error");
    this.submitButton = document.getElementById("submit-button");
    this.submissionStatus = document.getElementById("submission-status");
    this.selectedLocationText = document.getElementById("selected-location");
  }

  async setupCamera() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      this.cameraPreview.srcObject = this.mediaStream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      const cameraSection = document.getElementById("camera-section");
      cameraSection.innerHTML = `
        <div class="form-error">
          <p>Tidak dapat mengakses kamera. Silakan berikan izin atau gunakan browser lain.</p>
          <input type="file" id="photo-upload" accept="image/*" class="form-input">
          <label for="photo-upload" class="form-label">Pilih foto dari perangkat</label>
        </div>
      `;
      const photoUpload = document.getElementById("photo-upload");
      photoUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.photoBlob = this.dataURItoBlob(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  initMap() {
    this.map = L.map("location-picker").setView([0.0, 120.0], 6); // Koordinat Sulawesi dan level zoom 6
    const openStreetMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.map);

    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      }
    );

    const topo = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      }
    );

    const baseMaps = {
      "Street Map": openStreetMap,
      "Satellite": satellite,
      "Topographic": topo,
    };

    L.control.layers(baseMaps).addTo(this.map);

    this.map.on("click", (e) => {
      this.setLocationMarker(e.latlng);
    });

    this.map.locate({ setView: true, maxZoom: 16 });

    this.map.on("locationfound", (e) => {
      this.setLocationMarker(e.latlng);
    });
  }

  setLocationMarker(latlng) {
    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker);
    }
    this.locationMarker = L.marker(latlng).addTo(this.map);
    this.selectedLocation = latlng;
    this.selectedLocationText.textContent = `Lokasi: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
    this.selectedLocationText.classList.add("text-success");
  }

  setupEventListeners() {
    this.captureButton.addEventListener("click", () => {
      this.capturePhoto();
    });

    this.retakeButton.addEventListener("click", () => {
      this.retakePhoto();
    });

    this.submitButton.addEventListener("click", async () => {
      await this.submitStory();
    });
  }

  capturePhoto() {
    this.cameraCanvas.width = this.cameraPreview.videoWidth;
    this.cameraCanvas.height = this.cameraPreview.videoHeight;
    const context = this.cameraCanvas.getContext("2d");
    context.drawImage(
      this.cameraPreview,
      0,
      0,
      this.cameraCanvas.width,
      this.cameraCanvas.height
    );

    this.cameraCanvas.toBlob((blob) => {
      this.photoBlob = blob;
      const imageUrl = URL.createObjectURL(blob);
      this.capturedImage.src = imageUrl;
      this.capturedImage.style.display = "block";
      this.cameraPreview.style.display = "none";
      this.captureButton.style.display = "none";
      this.retakeButton.style.display = "block";

      // Stop camera after capturing photo
      this.stopCamera();
    }, "image/jpeg", 0.8);
  }

  retakePhoto() {
    this.photoBlob = null;
    this.cameraPreview.style.display = "block";
    this.captureButton.style.display = "block";
    this.capturedImage.style.display = "none";
    this.retakeButton.style.display = "none";

    // Restart camera if it was stopped
    if (!this.mediaStream) {
      this.setupCamera();
    }
  }

  async submitStory() {
    try {
      if (!this.validateInputs()) {
        return;
      }

      this.submitButton.disabled = true;
      this.submissionStatus.innerHTML = `
        <div class="alert alert-info">
          <p>Mengirim story...</p>
        </div>
      `;

      const auth = AuthService.getAuth();
      const description = this.descriptionInput.value.trim();
      let lat, lon;
      if (this.selectedLocation) {
        lat = this.selectedLocation.lat;
        lon = this.selectedLocation.lng;
      }

      const response = await API.addNewStory({
        token: auth.token,
        description,
        photo: this.photoBlob,
        lat,
        lon,
      });

      if (response.error) {
        throw new Error(response.message);
      }

      this.submissionStatus.innerHTML = `
        <div class="alert alert-success">
          <p>Story berhasil dibuat!</p>
        </div>
      `;

      setTimeout(() => {
        window.location.hash = "#/";
      }, 2000);
    } catch (error) {
      console.error("Error submitting story:", error);
      this.submissionStatus.innerHTML = `
        <div class="alert alert-danger">
          <p>Error: ${error.message}</p>
        </div>
      `;
      this.submitButton.disabled = false;
    }
  }

  validateInputs() {
    if (!this.descriptionInput.value.trim()) {
      this.descriptionError.textContent = "Deskripsi tidak boleh kosong";
      return false;
    }

    if (!this.photoBlob) {
      this.submissionStatus.innerHTML = `
        <div class="alert alert-danger">
          <p>Foto harus diambil terlebih dahulu</p>
        </div>
      `;
      return false;
    }

    return true;
  }

  dataURItoBlob(dataURI) {
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0) {
      byteString = atob(dataURI.split(",")[1]);
    } else {
      byteString = unescape(dataURI.split(",")[1]);
    }

    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream = null;
      console.log("Kamera telah dimatikan.");
    }
  }

  cleanupResources() {
    this.stopCamera(); // Ensure camera is stopped when leaving the page
    console.log("Berpindah halaman: Sumber daya dibersihkan.");
  }

  disconnectedCallback() {
    this.cleanupResources(); // Cleanup when component is destroyed
  }
}