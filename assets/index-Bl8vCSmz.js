var ce=Object.defineProperty;var F=r=>{throw TypeError(r)};var le=(r,e,t)=>e in r?ce(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var G=(r,e,t)=>le(r,typeof e!="symbol"?e+"":e,t),T=(r,e,t)=>e.has(r)||F("Cannot "+t);var u=(r,e,t)=>(T(r,e,"read from private field"),t?t.call(r):e.get(r)),b=(r,e,t)=>e.has(r)?F("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t),I=(r,e,t,s)=>(T(r,e,"write to private field"),s?s.call(r,t):e.set(r,t),t),g=(r,e,t)=>(T(r,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const p={BASE_URL:"https://story-api.dicoding.dev/v1",VAPID_PUBLIC_KEY:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",DATABASE_NAME:"dicoding-story-database",DATABASE_VERSION:1,OBJECT_STORE_NAME:"stories"},B={async register({name:r,email:e,password:t}){return await(await fetch(`${p.BASE_URL}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:r,email:e,password:t})})).json()},async login({email:r,password:e}){return await(await fetch(`${p.BASE_URL}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r,password:e})})).json()},async getAllStories({token:r,page:e=1,size:t=10,location:s=1}){return await(await fetch(`${p.BASE_URL}/stories?page=${e}&size=${t}&location=${s}`,{headers:{Authorization:`Bearer ${r}`}})).json()},async getStoryDetail({token:r,id:e}){return await(await fetch(`${p.BASE_URL}/stories/${e}`,{headers:{Authorization:`Bearer ${r}`}})).json()},async addNewStory({token:r,description:e,photo:t,lat:s,lon:i}){const a=new FormData;return a.append("description",e),a.append("photo",t),s!==void 0&&i!==void 0&&(a.append("lat",s),a.append("lon",i)),await(await fetch(`${p.BASE_URL}/stories`,{method:"POST",headers:{Authorization:`Bearer ${r}`},body:a})).json()},async subscribeNotification({token:r,subscription:e}){return console.log(JSON.stringify(e)),await fetch(`${p.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(e)})},async unsubscribeNotification({token:r,endpoint:e}){return await(await fetch(`${p.BASE_URL}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({endpoint:e})})).json()}},D="dicoding_story_auth",m={setAuth({userId:r,name:e,token:t}){localStorage.setItem(D,JSON.stringify({userId:r,name:e,token:t}))},getAuth(){return JSON.parse(localStorage.getItem(D))||null},destroyAuth(){localStorage.removeItem(D)},isLoggedIn(){return!!this.getAuth()}};function J(r,e="en-US",t={}){return new Date(r).toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric",...t})}function de(r){const e="=".repeat((4-r.length%4)%4),t=(r+e).replace(/\-/g,"+").replace(/_/g,"/"),s=window.atob(t);return Uint8Array.from([...s].map(i=>i.charCodeAt(0)))}class ue{constructor(){this.stories=[],this.map=null,this.markers=[]}async render(){return`
      <section class="container page-transition">
        <h1 class="animate-in">Dicoding Story</h1>
        <p class="animate-in">Berbagi cerita seputar Dicoding</p>
        
        <div id="map-container" class="map-container animate-in"></div>
        
        <div class="stories-grid" id="stories-container">
          <p>Loading stories...</p>
        </div>
      </section>
    `}async afterRender(){try{await this.loadStories(),this.initMap(),this.renderStories()}catch(e){console.error("Error loading stories:",e),document.getElementById("stories-container").innerHTML=`
        <div class="error-message">
          <p>Failed to load stories. Please try again later.</p>
        </div>
      `}}async loadStories(){const e=m.getAuth();if(!e)return;const t=await B.getAllStories({token:e.token,location:1});if(t.error)throw new Error(t.message);this.stories=t.listStory}initMap(){this.map=L.map("map-container").setView([-.789275,113.921327],5);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"}),s=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'}),i={"Street Map":e,Satellite:t,Topographic:s};L.control.layers(i).addTo(this.map),L.Icon.Default.mergeOptions({iconUrl:"/storyku/storyku/images/marker-icon.png",shadowUrl:"/storyku/storyku/images/marker-shadow.png"}),this.addStoryMarkers()}addStoryMarkers(){const e=L.icon({iconUrl:"/storyku/images/marker-icon.png",iconSize:[25,41],iconAnchor:[12,41],shadowUrl:"/storyku/images/marker-shadow.png",shadowSize:[41,41]});if(console.log("/storyku/images/marker-shadow.png"),this.stories.forEach(t=>{if(t.lat&&t.lon){const s=L.marker([t.lat,t.lon],{icon:e}).addTo(this.map);s.bindPopup(`
          <div class="map-popup">
            <h3>${t.name}</h3>
            <img src="${t.photoUrl}" alt="Foto dari ${t.name}" style="width:100%;max-width:200px;border-radius:4px;">
            <p>${t.description}</p>
            <a href="#/detail/${t.id}">View Detail</a>
          </div>
        `),this.markers.push(s)}}),this.markers.length>0){const t=new L.featureGroup(this.markers);this.map.fitBounds(t.getBounds().pad(.1))}}renderStories(){const e=document.getElementById("stories-container");if(this.stories.length===0){e.innerHTML=`
        <div class="empty-message">
          <p>No stories found. Be the first to share!</p>
          <a href="#/add" class="btn btn-primary">Add New Story</a>
        </div>
      `;return}e.innerHTML=this.stories.map((t,s)=>`
      <article class="card story-card animate-in" style="animation-delay: ${s*100}ms">
        <img src="${t.photoUrl}" alt="Story image by ${t.name}" loading="lazy">
        <div class="story-info">
          <p class="story-author">${t.name}</p>
          <p class="story-date">${J(t.createdAt,"id-ID")}</p>
          <p class="story-description">${this.truncateText(t.description,150)}</p>
          <a href="#/detail/${t.id}" class="btn btn-primary">Read More</a>
        </div>
      </article>
    `).join("")}truncateText(e,t){return e.length<=t?e:e.substring(0,t)+"..."}}class he{constructor(){this.presenter=new ue}async render(){return this.presenter.render()}async afterRender(){await this.presenter.afterRender()}}const R=(r,e)=>e.some(t=>r instanceof t);let V,H;function pe(){return V||(V=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function me(){return H||(H=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const O=new WeakMap,C=new WeakMap,M=new WeakMap;function ge(r){const e=new Promise((t,s)=>{const i=()=>{r.removeEventListener("success",a),r.removeEventListener("error",n)},a=()=>{t(E(r.result)),i()},n=()=>{s(r.error),i()};r.addEventListener("success",a),r.addEventListener("error",n)});return M.set(e,r),e}function fe(r){if(O.has(r))return;const e=new Promise((t,s)=>{const i=()=>{r.removeEventListener("complete",a),r.removeEventListener("error",n),r.removeEventListener("abort",n)},a=()=>{t(),i()},n=()=>{s(r.error||new DOMException("AbortError","AbortError")),i()};r.addEventListener("complete",a),r.addEventListener("error",n),r.addEventListener("abort",n)});O.set(r,e)}let $={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return O.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return E(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function q(r){$=r($)}function ye(r){return me().includes(r)?function(...e){return r.apply(U(this),e),E(this.request)}:function(...e){return E(r.apply(U(this),e))}}function ve(r){return typeof r=="function"?ye(r):(r instanceof IDBTransaction&&fe(r),R(r,pe())?new Proxy(r,$):r)}function E(r){if(r instanceof IDBRequest)return ge(r);if(C.has(r))return C.get(r);const e=ve(r);return e!==r&&(C.set(r,e),M.set(e,r)),e}const U=r=>M.get(r);function we(r,e,{blocked:t,upgrade:s,blocking:i,terminated:a}={}){const n=indexedDB.open(r,e),o=E(n);return s&&n.addEventListener("upgradeneeded",c=>{s(E(n.result),c.oldVersion,c.newVersion,E(n.transaction),c)}),t&&n.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),o.then(c=>{a&&c.addEventListener("close",()=>a()),i&&c.addEventListener("versionchange",d=>i(d.oldVersion,d.newVersion,d))}).catch(()=>{}),o}const be=["get","getKey","getAll","getAllKeys","count"],Ee=["put","add","delete","clear"],x=new Map;function j(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(x.get(e))return x.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,i=Ee.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(i||be.includes(t)))return;const a=async function(n,...o){const c=this.transaction(n,i?"readwrite":"readonly");let d=c.store;return s&&(d=d.index(o.shift())),(await Promise.all([d[t](...o),i&&c.done]))[0]};return x.set(e,a),a}q(r=>({...r,get:(e,t,s)=>j(e,t)||r.get(e,t,s),has:(e,t)=>!!j(e,t)||r.has(e,t)}));const Se=["continue","continuePrimaryKey","advance"],z={},N=new WeakMap,Y=new WeakMap,ke={get(r,e){if(!Se.includes(e))return r[e];let t=z[e];return t||(t=z[e]=function(...s){N.set(this,Y.get(this)[e](...s))}),t}};async function*Le(...r){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...r)),!e)return;e=e;const t=new Proxy(e,ke);for(Y.set(t,e),M.set(t,U(e));e;)yield t,e=await(N.get(t)||e.continue()),N.delete(t)}function W(r,e){return e===Symbol.asyncIterator&&R(r,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&R(r,[IDBIndex,IDBObjectStore])}q(r=>({...r,get(e,t,s){return W(e,t)?Le:r.get(e,t,s)},has(e,t){return W(e,t)||r.has(e,t)}}));const P={async createDB(){this.db=await we(p.DATABASE_NAME,p.DATABASE_VERSION,{upgrade(r){r.createObjectStore(p.OBJECT_STORE_NAME,{keyPath:["id","userId"]})}})},async addFavorite(r){const e=m.getAuth();e!=null&&await this.db.add(p.OBJECT_STORE_NAME,{id:r,userId:e.userId})},async deleteFavorite(r){const e=m.getAuth();e!=null&&await this.db.delete(p.OBJECT_STORE_NAME,[r,e.userId])},async isFavorite(r){const e=m.getAuth();if(e==null)return;const t=await this.db.get(p.OBJECT_STORE_NAME,[r,e.userId]);return console.log(t),t}};class Be{constructor({view:e,params:t}){this.view=e,this.params=t,this.story=null}async loadStoryDetails(){const e=m.getAuth();if(!e)throw new Error("Autentikasi diperlukan");const t=await B.getStoryDetail({token:e.token,id:this.params.id});if(t.error)throw new Error(t.message);this.story=t.story;const s=await P.isFavorite(this.params.id);return{story:this.story,favorite:s}}async addFavorite(){await P.addFavorite(this.params.id)}async removeFavorite(){await P.deleteFavorite(this.params.id)}formatDescription(e){return e.split(`
`).map(t=>t.trim()?`<p>${t}</p>`:"").join("")}}var S,_,X;class Ie{constructor({params:e}){b(this,S);this.id=e.id,this.presenter=new Be({view:this,params:e}),this.story=null,this.map=null,this.favoriteButton=null,this.favorite=!1}async render(){return`
      <section class="container page-transition">
        <div class="story-detail-container animate-in">
          <h1 class="animate-in">Memuat detail cerita...</h1>
          <div id="story-content" class="story-content"></div>
        </div>
      </section>
    `}async afterRender(){try{const e=await this.presenter.loadStoryDetails();this.story=e.story,this.favorite=e.favorite,this.renderStoryDetails(),this.story.lat&&this.story.lon&&this.initMap()}catch(e){console.error("Kesalahan saat memuat detail cerita:",e),document.querySelector("h1").textContent="Gagal Memuat Cerita",document.getElementById("story-content").innerHTML=`
        <div class="error-message">
          <p>Gagal memuat detail cerita. Silakan coba lagi nanti.</p>
          <p>${e.message}</p>
          <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
        </div>
      `}}renderStoryDetails(){const e=document.getElementById("story-content"),t=document.querySelector("h1");t.textContent=`Cerita oleh ${this.story.name}`,e.innerHTML=`
      <div class="story-detail-card card animate-in">
        <img 
          src="${this.story.photoUrl}" 
          alt="Foto oleh ${this.story.name}" 
          class="story-detail-image"
        >
        
        <div class="story-detail-info">
          <p class="story-author">${this.story.name}</p>
          <p class="story-date">
            ${J(this.story.createdAt,"id-ID",{hour:"2-digit",minute:"2-digit"})}
          </p>
          
          <div class="story-description">
            <p>${this.presenter.formatDescription(this.story.description)}</p>
          </div>
          
          ${this.story.lat&&this.story.lon?`
            <div class="location-info">
              <h3>Lokasi</h3>
              <div id="detail-map" class="detail-map"></div>
            </div>
          `:""}
          
          <div class="story-actions">
            <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
            <button id="favorite" class="btn btn-favorite">Favorit</button>
          </div>
        </div>
      </div>
    `,this.favoriteButton=document.getElementById("favorite"),g(this,S,_).call(this),g(this,S,X).call(this)}initMap(){this.map=L.map("detail-map").setView([this.story.lat,this.story.lon],13);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor'}).addTo(this.map),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri — Sumber: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, dan Komunitas Pengguna GIS"}),s=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Data peta: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor, <a href="http://viewfinderpanoramas.org">SRTM</a> | Gaya peta: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'}),i={"Peta Jalan":e,Satelit:t,Topografi:s};L.control.layers(i).addTo(this.map),L.marker([this.story.lat,this.story.lon]).addTo(this.map).bindPopup(`<b>${this.story.name}</b><br>${this.story.description.substring(0,100)}...`).openPopup()}}S=new WeakSet,_=async function(){this.favorite?this.favoriteButton.classList.add("active"):this.favoriteButton.classList.remove("active")},X=function(){this.favoriteButton.addEventListener("click",async()=>{this.favorite?(await this.presenter.removeFavorite(),this.favorite=!1):(await this.presenter.addFavorite(),this.favorite=!0),g(this,S,_).call(this)})};class Pe{constructor(){this.mediaStream=null,this.photoBlob=null,this.selectedLocation=null,this.map=null,this.locationMarker=null}async render(){return`
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
    `}async afterRender(){this.initializeElements(),await this.setupCamera(),this.initMap(),this.setupEventListeners(),window.addEventListener("hashchange",this.cleanupResources.bind(this))}initializeElements(){this.cameraPreview=document.getElementById("camera-preview"),this.cameraCanvas=document.getElementById("camera-canvas"),this.capturedImage=document.getElementById("captured-image"),this.captureButton=document.getElementById("capture-button"),this.retakeButton=document.getElementById("retake-button"),this.descriptionInput=document.getElementById("description"),this.descriptionError=document.getElementById("description-error"),this.submitButton=document.getElementById("submit-button"),this.submissionStatus=document.getElementById("submission-status"),this.selectedLocationText=document.getElementById("selected-location")}async setupCamera(){try{this.mediaStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}},audio:!1}),this.cameraPreview.srcObject=this.mediaStream}catch(e){console.error("Error accessing camera:",e);const t=document.getElementById("camera-section");t.innerHTML=`
        <div class="form-error">
          <p>Tidak dapat mengakses kamera. Silakan berikan izin atau gunakan browser lain.</p>
          <input type="file" id="photo-upload" accept="image/*" class="form-input">
          <label for="photo-upload" class="form-label">Pilih foto dari perangkat</label>
        </div>
      `,document.getElementById("photo-upload").addEventListener("change",i=>{const a=i.target.files[0];if(a){const n=new FileReader;n.onload=o=>{this.photoBlob=this.dataURItoBlob(o.target.result)},n.readAsDataURL(a)}})}}initMap(){this.map=L.map("location-picker").setView([0,120],6);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"}),s=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'}),i={"Street Map":e,Satellite:t,Topographic:s};L.control.layers(i).addTo(this.map),this.map.on("click",a=>{this.setLocationMarker(a.latlng)}),this.map.locate({setView:!0,maxZoom:16}),this.map.on("locationfound",a=>{this.setLocationMarker(a.latlng)})}setLocationMarker(e){this.locationMarker&&this.map.removeLayer(this.locationMarker),this.locationMarker=L.marker(e).addTo(this.map),this.selectedLocation=e,this.selectedLocationText.textContent=`Lokasi: ${e.lat.toFixed(6)}, ${e.lng.toFixed(6)}`,this.selectedLocationText.classList.add("text-success")}setupEventListeners(){this.captureButton.addEventListener("click",()=>{this.capturePhoto()}),this.retakeButton.addEventListener("click",()=>{this.retakePhoto()}),this.submitButton.addEventListener("click",async()=>{await this.submitStory()})}capturePhoto(){this.cameraCanvas.width=this.cameraPreview.videoWidth,this.cameraCanvas.height=this.cameraPreview.videoHeight,this.cameraCanvas.getContext("2d").drawImage(this.cameraPreview,0,0,this.cameraCanvas.width,this.cameraCanvas.height),this.cameraCanvas.toBlob(t=>{this.photoBlob=t;const s=URL.createObjectURL(t);this.capturedImage.src=s,this.capturedImage.style.display="block",this.cameraPreview.style.display="none",this.captureButton.style.display="none",this.retakeButton.style.display="block",this.stopCamera()},"image/jpeg",.8)}retakePhoto(){this.photoBlob=null,this.cameraPreview.style.display="block",this.captureButton.style.display="block",this.capturedImage.style.display="none",this.retakeButton.style.display="none",this.mediaStream||this.setupCamera()}async submitStory(){try{if(!this.validateInputs())return;this.submitButton.disabled=!0,this.submissionStatus.innerHTML=`
        <div class="alert alert-info">
          <p>Mengirim story...</p>
        </div>
      `;const e=m.getAuth(),t=this.descriptionInput.value.trim();let s,i;this.selectedLocation&&(s=this.selectedLocation.lat,i=this.selectedLocation.lng);const a=await B.addNewStory({token:e.token,description:t,photo:this.photoBlob,lat:s,lon:i});if(a.error)throw new Error(a.message);this.submissionStatus.innerHTML=`
        <div class="alert alert-success">
          <p>Story berhasil dibuat!</p>
        </div>
      `,setTimeout(()=>{window.location.hash="#/"},2e3)}catch(e){console.error("Error submitting story:",e),this.submissionStatus.innerHTML=`
        <div class="alert alert-danger">
          <p>Error: ${e.message}</p>
        </div>
      `,this.submitButton.disabled=!1}}validateInputs(){return this.descriptionInput.value.trim()?this.photoBlob?!0:(this.submissionStatus.innerHTML=`
        <div class="alert alert-danger">
          <p>Foto harus diambil terlebih dahulu</p>
        </div>
      `,!1):(this.descriptionError.textContent="Deskripsi tidak boleh kosong",!1)}dataURItoBlob(e){let t;e.split(",")[0].indexOf("base64")>=0?t=atob(e.split(",")[1]):t=unescape(e.split(",")[1]);const s=e.split(",")[0].split(":")[1].split(";")[0],i=new Uint8Array(t.length);for(let a=0;a<t.length;a++)i[a]=t.charCodeAt(a);return new Blob([i],{type:s})}stopCamera(){this.mediaStream&&(this.mediaStream.getTracks().forEach(e=>{e.stop()}),this.mediaStream=null,console.log("Kamera telah dimatikan."))}cleanupResources(){this.stopCamera(),console.log("Berpindah halaman: Sumber daya dibersihkan.")}disconnectedCallback(){this.cleanupResources()}}class Ae{constructor({onSuccess:e,onError:t}){this.onSuccess=e,this.onError=t}validate(e,t,{showEmailError:s,showPasswordError:i}){if(e){if(!this.isValidEmail(e))return s("Email tidak valid"),!1}else return s("Email tidak boleh kosong"),!1;if(t){if(t.length<8)return i("Password minimal 8 karakter"),!1}else return i("Password tidak boleh kosong"),!1;return!0}isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}async login(e,t){try{const s=await B.login({email:e,password:t});if(s.error)throw new Error(s.message);const{userId:i,name:a,token:n}=s.loginResult;m.setAuth({userId:i,name:a,token:n}),this.onSuccess()}catch(s){console.error("LoginPresenter Error:",s),this.onError(s.message)}}}class Me{constructor(){this.presenter=new Ae({onSuccess:this.showSuccess.bind(this),onError:this.showError.bind(this)})}async render(){return`
      <section class="container page-transition">
        <h1 class="animate-in">Login</h1>

        <div class="form-container animate-in">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-input" placeholder="Masukkan email">
            <div id="email-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-input" placeholder="Masukkan password">
            <div id="password-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <button id="login-button" class="btn btn-primary btn-full">Login</button>
          </div>

          <div id="login-status"></div>

          <div class="form-group text-center">
            <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </div>
        </div>
      </section>
    `}async afterRender(){this.emailInput=document.getElementById("email"),this.passwordInput=document.getElementById("password"),this.emailError=document.getElementById("email-error"),this.passwordError=document.getElementById("password-error"),this.loginButton=document.getElementById("login-button"),this.loginStatus=document.getElementById("login-status"),this.loginButton.addEventListener("click",()=>{this.handleLogin()}),document.querySelectorAll(".form-input").forEach(e=>{e.addEventListener("keypress",t=>{t.key==="Enter"&&this.handleLogin()})})}async handleLogin(){this.clearErrors();const e=this.emailInput.value.trim(),t=this.passwordInput.value;this.presenter.validate(e,t,{showEmailError:i=>this.emailError.textContent=i,showPasswordError:i=>this.passwordError.textContent=i})&&(this.loginButton.disabled=!0,this.loginStatus.innerHTML=`
      <div class="alert alert-info">
        <p>Logging in...</p>
      </div>
    `,await this.presenter.login(e,t))}showSuccess(){this.loginStatus.innerHTML=`
      <div class="alert alert-success">
        <p>Login berhasil! Mengarahkan...</p>
      </div>
    `,setTimeout(()=>{window.location.hash="#/"},1e3)}showError(e){this.loginStatus.innerHTML=`
      <div class="alert alert-danger">
        <p>Login gagal: ${e}</p>
      </div>
    `,this.loginButton.disabled=!1}clearErrors(){this.emailError.textContent="",this.passwordError.textContent="",this.loginStatus.innerHTML=""}}class Te{constructor({onSuccess:e,onError:t}){this.onSuccess=e,this.onError=t}validate({name:e,email:t,password:s,confirmPassword:i},a){const{showNameError:n,showEmailError:o,showPasswordError:c,showConfirmPasswordError:d}=a;let f=!0;return e||(n("Nama tidak boleh kosong"),f=!1),t?this.isValidEmail(t)||(o("Email tidak valid"),f=!1):(o("Email tidak boleh kosong"),f=!1),(!s||s.length<8)&&(c("Password minimal 8 karakter"),f=!1),s!==i&&(d("Password tidak cocok"),f=!1),f}isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}async register({name:e,email:t,password:s}){try{const i=await B.register({name:e,email:t,password:s});if(i.error)throw new Error(i.message||"Registrasi gagal");this.onSuccess()}catch(i){console.error("RegisterPresenter Error:",i),this.onError(i.message||"Terjadi kesalahan saat registrasi.")}}}class De{constructor(){this.presenter=new Te({onSuccess:this.showSuccess.bind(this),onError:this.showError.bind(this)})}async render(){return`
      <section class="container page-transition">
        <h1 class="animate-in">Register</h1>

        <div class="form-container animate-in">
          <div class="form-group">
            <label for="name" class="form-label">Nama</label>
            <input type="text" id="name" class="form-input" placeholder="Masukkan nama lengkap">
            <div id="name-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-input" placeholder="Masukkan email">
            <div id="email-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-input" placeholder="Masukkan password (min. 8 karakter)">
            <div id="password-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <label for="confirm-password" class="form-label">Konfirmasi Password</label>
            <input type="password" id="confirm-password" class="form-input" placeholder="Masukkan password kembali">
            <div id="confirm-password-error" class="form-error"></div>
          </div>

          <div class="form-group">
            <button id="register-button" class="btn btn-primary btn-full">Register</button>
          </div>

          <div id="register-status"></div>

          <div class="form-group text-center">
            <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
          </div>
        </div>
      </section>
    `}async afterRender(){this.nameInput=document.getElementById("name"),this.emailInput=document.getElementById("email"),this.passwordInput=document.getElementById("password"),this.confirmPasswordInput=document.getElementById("confirm-password"),this.nameError=document.getElementById("name-error"),this.emailError=document.getElementById("email-error"),this.passwordError=document.getElementById("password-error"),this.confirmPasswordError=document.getElementById("confirm-password-error"),this.registerStatus=document.getElementById("register-status"),this.registerButton=document.getElementById("register-button"),this.registerButton.addEventListener("click",()=>{this.handleRegister()}),document.querySelectorAll(".form-input").forEach(e=>{e.addEventListener("keypress",t=>{t.key==="Enter"&&this.handleRegister()})})}async handleRegister(){this.clearErrors();const e=this.nameInput.value.trim(),t=this.emailInput.value.trim(),s=this.passwordInput.value,i=this.confirmPasswordInput.value;this.presenter.validate({name:e,email:t,password:s,confirmPassword:i},{showNameError:n=>this.nameError.textContent=n,showEmailError:n=>this.emailError.textContent=n,showPasswordError:n=>this.passwordError.textContent=n,showConfirmPasswordError:n=>this.confirmPasswordError.textContent=n})&&(this.registerStatus.innerHTML=`
      <div class="alert alert-info">Mendaftarkan akun...</div>
    `,this.registerButton.disabled=!0,await this.presenter.register({name:e,email:t,password:s}))}showSuccess(){this.registerStatus.innerHTML=`
      <div class="alert alert-success">Registrasi berhasil! Mengarahkan ke login...</div>
    `,setTimeout(()=>{window.location.hash="#/login"},1e3)}showError(e){this.registerStatus.innerHTML=`
      <div class="alert alert-danger">Registrasi gagal: ${e}</div>
    `,this.registerButton.disabled=!1}clearErrors(){this.nameError.textContent="",this.emailError.textContent="",this.passwordError.textContent="",this.confirmPasswordError.textContent="",this.registerStatus.innerHTML=""}}class Ce{constructor(e){this.view=e}init(){console.log("AboutPresenter initialized")}}class xe{constructor(){this.presenter=new Ce(this)}async render(){return`
      <section class="container">
        <h1>About Page</h1>
      </section>
    `}async afterRender(){this.presenter.init()}}const Q={"/":{page:he,needAuth:!0},"/detail/:id":{page:Ie,needAuth:!0},"/add":{page:Pe,needAuth:!0},"/login":{page:Me,needAuth:!1},"/register":{page:De,needAuth:!1},"/about":{page:xe,needAuth:!1}};function Re(r){const e=Q[r];return e?e.needAuth&&!m.isLoggedIn()?"/login":r==="/login"&&m.isLoggedIn()||r==="/register"&&m.isLoggedIn()?"/":r:null}function Z(r){const e=r.split("/");return{resource:e[1]||null,id:e[2]||null}}function Oe(r){let e="";return r.resource&&(e=e.concat(`/${r.resource}`)),r.id&&(e=e.concat("/:id")),e||"/"}function ee(){return location.hash.replace("#","")||"/"}function $e(){const r=ee(),e=Z(r);return Oe(e)}function Ue(){const r=ee();return Z(r)}const Ne="modulepreload",_e=function(r){return"/storyku/"+r},K={},Fe=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),o=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));i=Promise.allSettled(t.map(c=>{if(c=_e(c),c in K)return;K[c]=!0;const d=c.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${f}`))return;const l=document.createElement("link");if(l.rel=d?"stylesheet":Ne,d||(l.as="script"),l.crossOrigin="",l.href=c,o&&l.setAttribute("nonce",o),document.head.appendChild(l),d)return new Promise((ne,oe)=>{l.addEventListener("load",ne),l.addEventListener("error",()=>oe(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(n){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=n,window.dispatchEvent(o),!o.defaultPrevented)throw n}return i.then(n=>{for(const o of n||[])o.status==="rejected"&&a(o.reason);return e().catch(a)})};function Ge(r={}){const{immediate:e=!1,onNeedRefresh:t,onOfflineReady:s,onRegistered:i,onRegisteredSW:a,onRegisterError:n}=r;let o,c;const d=async(l=!0)=>{await c};async function f(){if("serviceWorker"in navigator){if(o=await Fe(async()=>{const{Workbox:l}=await import("./workbox-window.prod.es5-B9K5rw8f.js");return{Workbox:l}},[]).then(({Workbox:l})=>new l("/storyku/sw.js",{scope:"/storyku/",type:"classic"})).catch(l=>{n==null||n(l)}),!o)return;o.addEventListener("activated",l=>{(l.isUpdate||l.isExternal)&&window.location.reload()}),o.addEventListener("installed",l=>{l.isUpdate||s==null||s()}),o.register({immediate:e}).then(l=>{a?a("/storyku/sw.js",l):i==null||i(l)}).catch(l=>{n==null||n(l)})}}return c=f(),d}var y,k,v,w,h,te,re,se,ie,A,ae;class Ve{constructor({navigationDrawer:e,drawerButton:t,content:s,authNavItem:i}){b(this,h);b(this,y);b(this,k);b(this,v);b(this,w);G(this,"notificationPermission",!1);I(this,y,s),I(this,k,t),I(this,v,e),I(this,w,i),g(this,h,se).call(this),g(this,h,te).call(this),g(this,h,re).call(this),g(this,h,A).call(this)}async renderPage(){const e=$e(),t=Ue(),s=Re(e);if(s!==e){window.location.hash=s;return}const i=Q[e];if(!i){u(this,y).innerHTML='<div class="container"><h2>404 - Halaman Tidak Ditemukan</h2></div>';return}try{document.startViewTransition?await document.startViewTransition(async()=>{u(this,y).innerHTML=await new i.page({params:t}).render()}).ready:u(this,y).innerHTML=await new i.page({params:t}).render(),await new i.page({params:t}).afterRender(),g(this,h,A).call(this),g(this,h,ae).call(this)}catch(a){console.error("Kesalahan saat merender halaman:",a),u(this,y).innerHTML=`
        <div class="container">
          <h2>Terjadi kesalahan</h2>
          <p>${a.message}</p>
        </div>
      `}}}y=new WeakMap,k=new WeakMap,v=new WeakMap,w=new WeakMap,h=new WeakSet,te=function(){if(!navigator.serviceWorker){console.error("Service Worker tidak berfungsi");return}console.log("Mendaftarkan Service Worker..."),Ge({onOfflineReady(){console.log("Bisa Offline.")},onNeedRefresh(){console.log("Bisa Update Versi.")},onRegistered(e){console.log("Service Worker terdaftar:",e),e.pushManager?console.log("Push Manager tersedia"):console.error("Push Manager tidak tersedia")},onRegisterError(e){console.error("Service Worker gagal terdaftar:",e)}})},re=function(){u(this,k).addEventListener("click",()=>{u(this,v).classList.toggle("open")}),document.body.addEventListener("click",e=>{!u(this,v).contains(e.target)&&!u(this,k).contains(e.target)&&u(this,v).classList.remove("open"),u(this,v).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&u(this,v).classList.remove("open")})})},se=async function(){await P.createDB(),console.log("Indexed DB Sudah Siap")},ie=async function(){var n;if(!("Notification"in window)){console.error("Browser tidak mendukung Notification API");return}const e=await Notification.requestPermission();if(e==="denied"){console.log("Izin notification ditolak.");return}if(e==="default"){console.log("Izin notification ditutup atau diabaikan.");return}console.log("Izin notification diterima"),this.notificationPermission=!0;const t=m.getAuth();if(!t)return;const s=await navigator.serviceWorker.getRegistration();if(!(s!=null&&s.pushManager)||await((n=s==null?void 0:s.pushManager)==null?void 0:n.getSubscription()))return;const a=await s.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:de(p.VAPID_PUBLIC_KEY)});try{const{endpoint:o,keys:c}=a.toJSON(),d={endpoint:o,keys:{auth:c.auth,p256dh:c.p256dh}};if(!(await B.subscribeNotification({token:t.token,subscription:d})).ok)throw new Error("Gagal berlangganan notifikasi")}catch(o){console.error("Gagal berlangganan notifikasi:",o),await a.unsubscribe();return}},A=function(){m.isLoggedIn()?(g(this,h,ie).call(this),u(this,w).textContent="Logout",u(this,w).href="#/logout",u(this,w).addEventListener("click",e=>{e.preventDefault(),m.destroyAuth(),window.location.hash="#/login",g(this,h,A).call(this)})):(u(this,w).textContent="Login",u(this,w).href="#/login")},ae=function(){u(this,y).querySelectorAll(".animate-in").forEach((t,s)=>{const i=t.animate([{transform:"translateY(20px)",opacity:0},{transform:"translateY(0)",opacity:1}],{duration:500,delay:100*s,easing:"ease-out",fill:"forwards"});i.onfinish=()=>{t.classList.remove("animate-in")}})};document.addEventListener("DOMContentLoaded",async()=>{const r=new Ve({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer"),authNavItem:document.getElementById("auth-nav-item")});await r.renderPage(),window.addEventListener("hashchange",async()=>{await r.renderPage()})});
