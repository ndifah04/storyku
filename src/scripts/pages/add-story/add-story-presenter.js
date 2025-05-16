import AddStoryPage from "./add-story-page";

export default class AddStoryPresenter {
  constructor() {
    this.page = new AddStoryPage();
    this.mediaStream = null;
  }

  async init() {
    // Render halaman tambah story
    const content = await this.page.render();
    document.body.innerHTML = content;

    // Inisialisasi elemen dan event listener
    await this.page.afterRender();

    // Simpan referensi mediaStream untuk kontrol lebih lanjut
    this.mediaStream = this.page.mediaStream;

    // Tambahkan listener untuk mematikan kamera saat berpindah halaman
    window.addEventListener("hashchange", this.handlePageChange.bind(this));
  }

  /**
   * Fungsi untuk mematikan kamera.
   * Memastikan semua track kamera dihentikan.
   */
  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream = null;
      console.log("Kamera telah dimatikan.");
    }
  }

  /**
   * Handler untuk mematikan kamera saat pengguna berpindah halaman.
   */
  handlePageChange() {
    this.stopCamera();
    console.log("Berpindah halaman: Kamera dimatikan.");
  }

  /**
   * Override submitStory untuk memastikan kamera dimatikan setelah submit.
   */
  async submitStory() {
    try {
      await this.page.submitStory();
      this.stopCamera(); // Pastikan kamera dimatikan setelah submit
    } catch (error) {
      console.error("Error during submission:", error);
    }
  }

  /**
   * Override capturePhoto untuk memastikan kamera tetap aktif hanya saat diperlukan.
   */
  capturePhoto() {
    this.page.capturePhoto();
    // Kamera tetap aktif hanya jika retakeButton tidak ditampilkan
    if (this.page.retakeButton.style.display === "block") {
      this.stopCamera();
    }
  }

  /**
   * Override retakePhoto untuk mengaktifkan kamera kembali jika diperlukan.
   */
  retakePhoto() {
    this.page.retakePhoto();
    // Aktifkan kamera kembali jika retakeButton diklik
    if (!this.mediaStream) {
      this.page.setupCamera().then((stream) => {
        this.mediaStream = stream;
      });
    }
  }

  /**
   * Cleanup resources sebelum meninggalkan halaman.
   */
  cleanup() {
    this.stopCamera();
    window.removeEventListener("hashchange", this.handlePageChange.bind(this));
  }
}