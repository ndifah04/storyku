var fe=Object.defineProperty;var q=r=>{throw TypeError(r)};var ye=(r,e,t)=>e in r?fe(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Y=(r,e,t)=>ye(r,typeof e!="symbol"?e+"":e,t),N=(r,e,t)=>e.has(r)||q("Cannot "+t);var d=(r,e,t)=>(N(r,e,"read from private field"),t?t.call(r):e.get(r)),b=(r,e,t)=>e.has(r)?q("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t),k=(r,e,t,i)=>(N(r,e,"write to private field"),i?i.call(r,t):e.set(r,t),t),u=(r,e,t)=>(N(r,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const m={BASE_URL:"https://story-api.dicoding.dev/v1",VAPID_PUBLIC_KEY:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",DATABASE_NAME:"dicoding-story-database",DATABASE_VERSION:2,OBJECT_STORE_NAME:"stories"},B={async register({name:r,email:e,password:t}){return await(await fetch(`${m.BASE_URL}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:r,email:e,password:t})})).json()},async login({email:r,password:e}){return await(await fetch(`${m.BASE_URL}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r,password:e})})).json()},async getAllStories({token:r,page:e=1,size:t=10,location:i=1}){return await fetch(`${m.BASE_URL}/stories?page=${e}&size=${t}&location=${i}`,{headers:{Authorization:`Bearer ${r}`}})},async getStoryDetail({token:r,id:e}){return await(await fetch(`${m.BASE_URL}/stories/${e}`,{headers:{Authorization:`Bearer ${r}`}})).json()},async addNewStory({token:r,description:e,photo:t,lat:i,lon:s}){const a=new FormData;return a.append("description",e),a.append("photo",t),i!==void 0&&s!==void 0&&(a.append("lat",i),a.append("lon",s)),await(await fetch(`${m.BASE_URL}/stories`,{method:"POST",headers:{Authorization:`Bearer ${r}`},body:a})).json()},async subscribeNotification({token:r,subscription:e}){return console.log(JSON.stringify(e)),await fetch(`${m.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(e)})},async unsubscribeNotification({token:r,endpoint:e}){return await fetch(`${m.BASE_URL}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({endpoint:e})})}},O="dicoding_story_auth",g={setAuth({userId:r,name:e,token:t}){localStorage.setItem(O,JSON.stringify({userId:r,name:e,token:t}))},getAuth(){return JSON.parse(localStorage.getItem(O))||null},destroyAuth(){localStorage.removeItem(O)},isLoggedIn(){return!!this.getAuth()}};function K(r,e="en-US",t={}){return new Date(r).toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric",...t})}function ve(r){const e="=".repeat((4-r.length%4)%4),t=(r+e).replace(/\-/g,"+").replace(/_/g,"/"),i=window.atob(t);return Uint8Array.from([...i].map(s=>s.charCodeAt(0)))}class be{constructor(){this.stories=[],this.map=null,this.markers=[],this.subscribe=!1}async render(){return`
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
      `}}async loadStories(){const e=g.getAuth();if(!e)return;const t=await B.getAllStories({token:e.token,location:1}),i=await t.json();if(console.log(i),!t.ok)throw new Error(i.message);this.stories=i.listStory}initMap(){this.map=L.map("map-container").setView([-.789275,113.921327],5);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"}),i=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'}),s={"Street Map":e,Satellite:t,Topographic:i};L.control.layers(s).addTo(this.map),L.Icon.Default.mergeOptions({iconUrl:"/storyku/storyku/images/marker-icon.png",shadowUrl:"/storyku/storyku/images/marker-shadow.png"}),this.addStoryMarkers()}addStoryMarkers(){var t;const e=L.icon({iconUrl:"/storyku/images/marker-icon.png",iconSize:[25,41],iconAnchor:[12,41],shadowUrl:"/storyku/images/marker-shadow.png",shadowSize:[41,41]});if((t=this.stories)==null||t.forEach(i=>{if(i.lat&&i.lon){const s=L.marker([i.lat,i.lon],{icon:e}).addTo(this.map);s.bindPopup(`
          <div class="map-popup">
            <h3>${i.name}</h3>
            <img src="${i.photoUrl}" alt="Foto dari ${i.name}" style="width:100%;max-width:200px;border-radius:4px;">
            <p>${i.description}</p>
            <a href="#/detail/${i.id}">View Detail</a>
          </div>
        `),this.markers.push(s)}}),this.markers.length>0){const i=new L.featureGroup(this.markers);this.map.fitBounds(i.getBounds().pad(.1))}}renderStories(){const e=document.getElementById("stories-container");if(this.stories.length===0){e.innerHTML=`
        <div class="empty-message">
          <p>No stories found. Be the first to share!</p>
          <a href="#/add" class="btn btn-primary">Add New Story</a>
        </div>
      `;return}e.innerHTML=this.stories.map((t,i)=>`
      <article class="card story-card animate-in" style="animation-delay: ${i*100}ms">
        <img src="${t.photoUrl}" alt="Story image by ${t.name}" loading="lazy">
        <div class="story-info">
          <p class="story-author">${t.name}</p>
          <p class="story-date">${K(t.createdAt,"id-ID")}</p>
          <p class="story-description">${this.truncateText(t.description,150)}</p>
          <a href="#/detail/${t.id}" class="btn btn-primary">Read More</a>
        </div>
      </article>
    `).join("")}truncateText(e,t){return e.length<=t?e:e.substring(0,t)+"..."}}class we{constructor(){this.presenter=new be}async render(){return this.presenter.render()}async afterRender(){await this.presenter.afterRender()}}const G=(r,e)=>e.some(t=>r instanceof t);let X,Q;function Ee(){return X||(X=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Se(){return Q||(Q=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const F=new WeakMap,U=new WeakMap,$=new WeakMap;function ke(r){const e=new Promise((t,i)=>{const s=()=>{r.removeEventListener("success",a),r.removeEventListener("error",n)},a=()=>{t(I(r.result)),s()},n=()=>{i(r.error),s()};r.addEventListener("success",a),r.addEventListener("error",n)});return $.set(e,r),e}function Le(r){if(F.has(r))return;const e=new Promise((t,i)=>{const s=()=>{r.removeEventListener("complete",a),r.removeEventListener("error",n),r.removeEventListener("abort",n)},a=()=>{t(),s()},n=()=>{i(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",a),r.addEventListener("error",n),r.addEventListener("abort",n)});F.set(r,e)}let z={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return F.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return I(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function ie(r){z=r(z)}function Ie(r){return Se().includes(r)?function(...e){return r.apply(V(this),e),I(this.request)}:function(...e){return I(r.apply(V(this),e))}}function Be(r){return typeof r=="function"?Ie(r):(r instanceof IDBTransaction&&Le(r),G(r,Ee())?new Proxy(r,z):r)}function I(r){if(r instanceof IDBRequest)return ke(r);if(U.has(r))return U.get(r);const e=Be(r);return e!==r&&(U.set(r,e),$.set(e,r)),e}const V=r=>$.get(r);function Ae(r,e,{blocked:t,upgrade:i,blocking:s,terminated:a}={}){const n=indexedDB.open(r,e),o=I(n);return i&&n.addEventListener("upgradeneeded",l=>{i(I(n.result),l.oldVersion,l.newVersion,I(n.transaction),l)}),t&&n.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),o.then(l=>{a&&l.addEventListener("close",()=>a()),s&&l.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),o}const Me=["get","getKey","getAll","getAllKeys","count"],Pe=["put","add","delete","clear"],_=new Map;function Z(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(_.get(e))return _.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,s=Pe.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(s||Me.includes(t)))return;const a=async function(n,...o){const l=this.transaction(n,s?"readwrite":"readonly");let h=l.store;return i&&(h=h.index(o.shift())),(await Promise.all([h[t](...o),s&&l.done]))[0]};return _.set(e,a),a}ie(r=>({...r,get:(e,t,i)=>Z(e,t)||r.get(e,t,i),has:(e,t)=>!!Z(e,t)||r.has(e,t)}));const Te=["continue","continuePrimaryKey","advance"],ee={},j=new WeakMap,se=new WeakMap,Ce={get(r,e){if(!Te.includes(e))return r[e];let t=ee[e];return t||(t=ee[e]=function(...i){j.set(this,se.get(this)[e](...i))}),t}};async function*De(...r){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...r)),!e)return;e=e;const t=new Proxy(e,Ce);for(se.set(t,e),$.set(t,V(e));e;)yield t,e=await(j.get(t)||e.continue()),j.delete(t)}function te(r,e){return e===Symbol.asyncIterator&&G(r,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&G(r,[IDBIndex,IDBObjectStore])}ie(r=>({...r,get(e,t,i){return te(e,t)?De:r.get(e,t,i)},has(e,t){return te(e,t)||r.has(e,t)}}));const D={async createDB(){this.db=await Ae(m.DATABASE_NAME,m.DATABASE_VERSION,{upgrade(r,e,t){console.log(`Upgrading database from version ${e} to ${t}`),r.objectStoreNames.contains(m.OBJECT_STORE_NAME)&&r.deleteObjectStore(m.OBJECT_STORE_NAME),r.createObjectStore(m.OBJECT_STORE_NAME,{keyPath:["id","userId"]}).createIndex("userId","userId")}})},async getAllFavorites(){const r=g.getAuth();return r==null?[]:(await this.db.getAllFromIndex(m.OBJECT_STORE_NAME,"userId",r.userId)).filter(async t=>t.name==null||t.createdAt==null||t.description==null?(await this.deleteFavorite(t.id),!1):!0)},async addFavorite(r){const e=g.getAuth();e!=null&&await this.db.add(m.OBJECT_STORE_NAME,{id:r.id,userId:e.userId,...r})},async deleteFavorite(r){const e=g.getAuth();e!=null&&await this.db.delete(m.OBJECT_STORE_NAME,[r,e.userId])},async isFavorite(r){const e=g.getAuth();if(e==null)return;const t=await this.db.get(m.OBJECT_STORE_NAME,[r,e.userId]);return console.log(t),t}};class xe{constructor({view:e,params:t}){this.view=e,this.params=t,this.story=null}async loadStoryDetails(){const e=g.getAuth();if(!e)throw new Error("Autentikasi diperlukan");const t=await B.getStoryDetail({token:e.token,id:this.params.id});if(t.error)throw new Error(t.message);this.story=t.story;const i=await D.isFavorite(this.params.id);return{story:this.story,favorite:i}}async addFavorite(){await D.addFavorite(this.story)}async removeFavorite(){await D.deleteFavorite(this.params.id)}formatDescription(e){return e.split(`
`).map(t=>t.trim()?`<p>${t}</p>`:"").join("")}}var A,H,ae;class Re{constructor({params:e}){b(this,A);this.id=e.id,this.presenter=new xe({view:this,params:e}),this.story=null,this.map=null,this.favoriteButton=null,this.favorite=!1}async render(){return`
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
            ${K(this.story.createdAt,"id-ID",{hour:"2-digit",minute:"2-digit"})}
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
    `,this.favoriteButton=document.getElementById("favorite"),u(this,A,H).call(this),u(this,A,ae).call(this)}initMap(){this.map=L.map("detail-map").setView([this.story.lat,this.story.lon],13);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor'}).addTo(this.map),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri — Sumber: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, dan Komunitas Pengguna GIS"}),i=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Data peta: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor, <a href="http://viewfinderpanoramas.org">SRTM</a> | Gaya peta: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'}),s={"Peta Jalan":e,Satelit:t,Topografi:i};L.control.layers(s).addTo(this.map);const a=L.icon({iconUrl:"/images/marker-icon.png",iconSize:[25,41],iconAnchor:[12,41],shadowUrl:"/images/marker-shadow.png",shadowSize:[41,41]});L.marker([this.story.lat,this.story.lon],{icon:a}).addTo(this.map).bindPopup(`<b>${this.story.name}</b><br>${this.story.description.substring(0,100)}...`).openPopup()}}A=new WeakSet,H=async function(){this.favorite?this.favoriteButton.classList.add("active"):this.favoriteButton.classList.remove("active")},ae=function(){this.favoriteButton.addEventListener("click",async()=>{this.favorite?(await this.presenter.removeFavorite(),this.favorite=!1):(await this.presenter.addFavorite(),this.favorite=!0),u(this,A,H).call(this)})};class $e{constructor(){this.mediaStream=null,this.photoBlob=null,this.selectedLocation=null,this.map=null,this.locationMarker=null}async render(){return`
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
      `,document.getElementById("photo-upload").addEventListener("change",s=>{const a=s.target.files[0];if(a){const n=new FileReader;n.onload=o=>{this.photoBlob=this.dataURItoBlob(o.target.result)},n.readAsDataURL(a)}})}}initMap(){this.map=L.map("location-picker").setView([0,120],6);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"}),i=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'}),s={"Street Map":e,Satellite:t,Topographic:i};L.control.layers(s).addTo(this.map),this.map.on("click",a=>{this.setLocationMarker(a.latlng)}),this.map.locate({setView:!0,maxZoom:16}),this.map.on("locationfound",a=>{this.setLocationMarker(a.latlng)})}setLocationMarker(e){this.locationMarker&&this.map.removeLayer(this.locationMarker),this.locationMarker=L.marker(e).addTo(this.map),this.selectedLocation=e,this.selectedLocationText.textContent=`Lokasi: ${e.lat.toFixed(6)}, ${e.lng.toFixed(6)}`,this.selectedLocationText.classList.add("text-success")}setupEventListeners(){this.captureButton.addEventListener("click",()=>{this.capturePhoto()}),this.retakeButton.addEventListener("click",()=>{this.retakePhoto()}),this.submitButton.addEventListener("click",async()=>{await this.submitStory()})}capturePhoto(){this.cameraCanvas.width=this.cameraPreview.videoWidth,this.cameraCanvas.height=this.cameraPreview.videoHeight,this.cameraCanvas.getContext("2d").drawImage(this.cameraPreview,0,0,this.cameraCanvas.width,this.cameraCanvas.height),this.cameraCanvas.toBlob(t=>{this.photoBlob=t;const i=URL.createObjectURL(t);this.capturedImage.src=i,this.capturedImage.style.display="block",this.cameraPreview.style.display="none",this.captureButton.style.display="none",this.retakeButton.style.display="block",this.stopCamera()},"image/jpeg",.8)}retakePhoto(){this.photoBlob=null,this.cameraPreview.style.display="block",this.captureButton.style.display="block",this.capturedImage.style.display="none",this.retakeButton.style.display="none",this.mediaStream||this.setupCamera()}async submitStory(){try{if(!this.validateInputs())return;this.submitButton.disabled=!0,this.submissionStatus.innerHTML=`
        <div class="alert alert-info">
          <p>Mengirim story...</p>
        </div>
      `;const e=g.getAuth(),t=this.descriptionInput.value.trim();let i,s;this.selectedLocation&&(i=this.selectedLocation.lat,s=this.selectedLocation.lng);const a=await B.addNewStory({token:e.token,description:t,photo:this.photoBlob,lat:i,lon:s});if(a.error)throw new Error(a.message);this.submissionStatus.innerHTML=`
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
      `,!1):(this.descriptionError.textContent="Deskripsi tidak boleh kosong",!1)}dataURItoBlob(e){let t;e.split(",")[0].indexOf("base64")>=0?t=atob(e.split(",")[1]):t=unescape(e.split(",")[1]);const i=e.split(",")[0].split(":")[1].split(";")[0],s=new Uint8Array(t.length);for(let a=0;a<t.length;a++)s[a]=t.charCodeAt(a);return new Blob([s],{type:i})}stopCamera(){this.mediaStream&&(this.mediaStream.getTracks().forEach(e=>{e.stop()}),this.mediaStream=null,console.log("Kamera telah dimatikan."))}cleanupResources(){this.stopCamera(),console.log("Berpindah halaman: Sumber daya dibersihkan.")}disconnectedCallback(){this.cleanupResources()}}class Ne{constructor({onSuccess:e,onError:t}){this.onSuccess=e,this.onError=t}validate(e,t,{showEmailError:i,showPasswordError:s}){if(e){if(!this.isValidEmail(e))return i("Email tidak valid"),!1}else return i("Email tidak boleh kosong"),!1;if(t){if(t.length<8)return s("Password minimal 8 karakter"),!1}else return s("Password tidak boleh kosong"),!1;return!0}isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}async login(e,t){try{const i=await B.login({email:e,password:t});if(i.error)throw new Error(i.message);const{userId:s,name:a,token:n}=i.loginResult;g.setAuth({userId:s,name:a,token:n}),this.onSuccess()}catch(i){console.error("LoginPresenter Error:",i),this.onError(i.message)}}}class Oe{constructor(){this.presenter=new Ne({onSuccess:this.showSuccess.bind(this),onError:this.showError.bind(this)})}async render(){return`
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
    `}async afterRender(){this.emailInput=document.getElementById("email"),this.passwordInput=document.getElementById("password"),this.emailError=document.getElementById("email-error"),this.passwordError=document.getElementById("password-error"),this.loginButton=document.getElementById("login-button"),this.loginStatus=document.getElementById("login-status"),this.loginButton.addEventListener("click",()=>{this.handleLogin()}),document.querySelectorAll(".form-input").forEach(e=>{e.addEventListener("keypress",t=>{t.key==="Enter"&&this.handleLogin()})})}async handleLogin(){this.clearErrors();const e=this.emailInput.value.trim(),t=this.passwordInput.value;this.presenter.validate(e,t,{showEmailError:s=>this.emailError.textContent=s,showPasswordError:s=>this.passwordError.textContent=s})&&(this.loginButton.disabled=!0,this.loginStatus.innerHTML=`
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
    `,this.loginButton.disabled=!1}clearErrors(){this.emailError.textContent="",this.passwordError.textContent="",this.loginStatus.innerHTML=""}}class Ue{constructor({onSuccess:e,onError:t}){this.onSuccess=e,this.onError=t}validate({name:e,email:t,password:i,confirmPassword:s},a){const{showNameError:n,showEmailError:o,showPasswordError:l,showConfirmPasswordError:h}=a;let f=!0;return e||(n("Nama tidak boleh kosong"),f=!1),t?this.isValidEmail(t)||(o("Email tidak valid"),f=!1):(o("Email tidak boleh kosong"),f=!1),(!i||i.length<8)&&(l("Password minimal 8 karakter"),f=!1),i!==s&&(h("Password tidak cocok"),f=!1),f}isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}async register({name:e,email:t,password:i}){try{const s=await B.register({name:e,email:t,password:i});if(s.error)throw new Error(s.message||"Registrasi gagal");this.onSuccess()}catch(s){console.error("RegisterPresenter Error:",s),this.onError(s.message||"Terjadi kesalahan saat registrasi.")}}}class _e{constructor(){this.presenter=new Ue({onSuccess:this.showSuccess.bind(this),onError:this.showError.bind(this)})}async render(){return`
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
    `}async afterRender(){this.nameInput=document.getElementById("name"),this.emailInput=document.getElementById("email"),this.passwordInput=document.getElementById("password"),this.confirmPasswordInput=document.getElementById("confirm-password"),this.nameError=document.getElementById("name-error"),this.emailError=document.getElementById("email-error"),this.passwordError=document.getElementById("password-error"),this.confirmPasswordError=document.getElementById("confirm-password-error"),this.registerStatus=document.getElementById("register-status"),this.registerButton=document.getElementById("register-button"),this.registerButton.addEventListener("click",()=>{this.handleRegister()}),document.querySelectorAll(".form-input").forEach(e=>{e.addEventListener("keypress",t=>{t.key==="Enter"&&this.handleRegister()})})}async handleRegister(){this.clearErrors();const e=this.nameInput.value.trim(),t=this.emailInput.value.trim(),i=this.passwordInput.value,s=this.confirmPasswordInput.value;this.presenter.validate({name:e,email:t,password:i,confirmPassword:s},{showNameError:n=>this.nameError.textContent=n,showEmailError:n=>this.emailError.textContent=n,showPasswordError:n=>this.passwordError.textContent=n,showConfirmPasswordError:n=>this.confirmPasswordError.textContent=n})&&(this.registerStatus.innerHTML=`
      <div class="alert alert-info">Mendaftarkan akun...</div>
    `,this.registerButton.disabled=!0,await this.presenter.register({name:e,email:t,password:i}))}showSuccess(){this.registerStatus.innerHTML=`
      <div class="alert alert-success">Registrasi berhasil! Mengarahkan ke login...</div>
    `,setTimeout(()=>{window.location.hash="#/login"},1e3)}showError(e){this.registerStatus.innerHTML=`
      <div class="alert alert-danger">Registrasi gagal: ${e}</div>
    `,this.registerButton.disabled=!1}clearErrors(){this.nameError.textContent="",this.emailError.textContent="",this.passwordError.textContent="",this.confirmPasswordError.textContent="",this.registerStatus.innerHTML=""}}class Ge{constructor(e){this.view=e}init(){console.log("AboutPresenter initialized")}}class Fe{constructor(){this.presenter=new Ge(this)}async render(){return`
      <section class="container">
        <h1>About Page</h1>
      </section>
    `}async afterRender(){this.presenter.init()}}class ze{constructor(){this.stories=[],this.map=null,this.markers=[],this.subscribe=!1}async render(){return`
      <section class="container page-transition">
        <h1 class="animate-in">Dicoding Story</h1>
        <p class="animate-in">Cerita Favorit</p>
        
        <div id="map-container" class="map-container animate-in"></div>
        
        <div class="stories-grid" id="stories-container">
          <p>Loading stories...</p>
        </div>
      </section>
    `}async afterRender(){try{await this.loadStories(),this.initMap(),this.renderStories()}catch(e){console.error("Error loading stories:",e),document.getElementById("stories-container").innerHTML=`
        <div class="error-message">
          <p>Failed to load stories. Please try again later.</p>
        </div>
      `}}async loadStories(){this.stories=await D.getAllFavorites(),console.log(this.stories)}initMap(){this.map=L.map("map-container").setView([-.789275,113.921327],5);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"}),i=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'}),s={"Street Map":e,Satellite:t,Topographic:i};L.control.layers(s).addTo(this.map),L.Icon.Default.mergeOptions({iconUrl:"/images/marker-icon.png",shadowUrl:"/images/marker-shadow.png"}),this.addStoryMarkers()}addStoryMarkers(){var t;const e=L.icon({iconUrl:"/images/marker-icon.png",iconSize:[25,41],iconAnchor:[12,41],shadowUrl:"/images/marker-shadow.png",shadowSize:[41,41]});if((t=this.stories)==null||t.forEach(i=>{if(i.lat&&i.lon){const s=L.marker([i.lat,i.lon],{icon:e}).addTo(this.map);s.bindPopup(`
          <div class="map-popup">
            <h3>${i.name}</h3>
            <img src="${i.photoUrl}" alt="Foto dari ${i.name}" style="width:100%;max-width:200px;border-radius:4px;">
            <p>${i.description}</p>
            <a href="#/detail/${i.id}">View Detail</a>
          </div>
        `),this.markers.push(s)}}),this.markers.length>0){const i=new L.featureGroup(this.markers);this.map.fitBounds(i.getBounds().pad(.1))}}renderStories(){const e=document.getElementById("stories-container");if(this.stories.length===0){e.innerHTML=`
        <div class="empty-message">
          <p>Tidak ada cerita favoritmu. Silahkan lihat cerita orang lain untuk dijadikan sebagai cerita favorit, ya</p>
          <a href="#/home" class="btn btn-primary">Lihat Daftar Cerita</a>
        </div>
      `;return}e.innerHTML=this.stories.map((t,i)=>`
      <article class="card story-card animate-in" style="animation-delay: ${i*100}ms">
        <img src="${t.photoUrl}" alt="Story image by ${t.name}" loading="lazy">
        <div class="story-info">
          <p class="story-author">${t.name}</p>
          <p class="story-date">${K(t.createdAt,"id-ID")}</p>
          <p class="story-description">${this.truncateText(t.description,150)}</p>
          <a href="#/detail/${t.id}" class="btn btn-primary">Read More</a>
        </div>
      </article>
    `).join("")}truncateText(e,t){return e.length<=t?e:e.substring(0,t)+"..."}}class Ve{constructor(){this.presenter=new ze}async render(){return this.presenter.render()}async afterRender(){await this.presenter.afterRender()}}const ne={"/":{page:we,needAuth:!0},"/detail/:id":{page:Re,needAuth:!0},"/add":{page:$e,needAuth:!0},"/login":{page:Oe,needAuth:!1},"/register":{page:_e,needAuth:!1},"/about":{page:Fe,needAuth:!1},"/favorites":{page:Ve,needAuth:!0}};function je(r){const e=ne[r];return e?e.needAuth&&!g.isLoggedIn()?"/login":r==="/login"&&g.isLoggedIn()||r==="/register"&&g.isLoggedIn()?"/":r:null}function oe(r){const e=r.split("/");return{resource:e[1]||null,id:e[2]||null}}function He(r){let e="";return r.resource&&(e=e.concat(`/${r.resource}`)),r.id&&(e=e.concat("/:id")),e||"/"}function ce(){return location.hash.replace("#","")||"/"}function We(){const r=ce(),e=oe(r);return He(e)}function Je(){const r=ce();return oe(r)}const Ke="modulepreload",qe=function(r){return"/storyku/"+r},re={},Ye=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),o=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));s=Promise.allSettled(t.map(l=>{if(l=qe(l),l in re)return;re[l]=!0;const h=l.endsWith(".css"),f=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${f}`))return;const y=document.createElement("link");if(y.rel=h?"stylesheet":Ke,h||(y.as="script"),y.crossOrigin="",y.href=l,o&&y.setAttribute("nonce",o),document.head.appendChild(y),h)return new Promise((p,x)=>{y.addEventListener("load",p),y.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(n){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=n,window.dispatchEvent(o),!o.defaultPrevented)throw n}return s.then(n=>{for(const o of n||[])o.status==="rejected"&&a(o.reason);return e().catch(a)})};function Xe(r={}){const{immediate:e=!1,onNeedRefresh:t,onOfflineReady:i,onRegistered:s,onRegisteredSW:a,onRegisterError:n}=r;let o,l,h;const f=async(p=!0)=>{await l,h==null||h()};async function y(){if("serviceWorker"in navigator){if(o=await Ye(async()=>{const{Workbox:p}=await import("./workbox-window.prod.es5-B9K5rw8f.js");return{Workbox:p}},[]).then(({Workbox:p})=>new p("/storyku/sw.js",{scope:"/storyku/",type:"classic"})).catch(p=>{n==null||n(p)}),!o)return;h=()=>{o==null||o.messageSkipWaiting()};{let p=!1;const x=()=>{p=!0,o==null||o.addEventListener("controlling",M=>{M.isUpdate&&window.location.reload()}),t==null||t()};o.addEventListener("installed",M=>{typeof M.isUpdate>"u"?typeof M.isExternal<"u"&&M.isExternal?x():!p&&(i==null||i()):M.isUpdate||i==null||i()}),o.addEventListener("waiting",x)}o.register({immediate:e}).then(p=>{a?a("/storyku/sw.js",p):s==null||s(p)}).catch(p=>{n==null||n(p)})}}return l=y(),f}var w,P,E,S,v,T,c,le,de,ue,R,W,C,he,J,pe,me,ge;class Qe{constructor({navigationDrawer:e,drawerButton:t,content:i,authNavItem:s,notifSubsItem:a,favoritesItem:n}){b(this,c);b(this,w);b(this,P);b(this,E);b(this,S);b(this,v);b(this,T);Y(this,"notificationPermission",!1);k(this,w,i),k(this,P,t),k(this,E,e),k(this,S,s),k(this,v,a),k(this,T,n),u(this,c,ue).call(this),u(this,c,de).call(this),u(this,c,R).call(this)}async renderPage(){const e=We(),t=Je(),i=je(e);if(i!==e){window.location.hash=i;return}const s=ne[e];if(!s){d(this,w).innerHTML='<div class="container"><h2>404 - Halaman Tidak Ditemukan</h2></div>';return}try{document.startViewTransition?await document.startViewTransition(async()=>{d(this,w).innerHTML=await new s.page({params:t}).render()}).ready:d(this,w).innerHTML=await new s.page({params:t}).render(),await new s.page({params:t}).afterRender(),u(this,c,R).call(this),u(this,c,ge).call(this)}catch(a){console.error("Kesalahan saat merender halaman:",a),d(this,w).innerHTML=`
        <div class="container">
          <h2>Terjadi kesalahan</h2>
          <p>${a.message}</p>
        </div>
      `}}}w=new WeakMap,P=new WeakMap,E=new WeakMap,S=new WeakMap,v=new WeakMap,T=new WeakMap,c=new WeakSet,le=async function(){if(!navigator.serviceWorker){console.error("Service Worker tidak berfungsi");return}console.log("Mendaftarkan Service Worker..."),Xe({onOfflineReady(){console.log("Bisa Offline.")},onNeedRefresh(){console.log("Bisa Update Versi.")},onRegistered:e=>{console.log("Service Worker terdaftar:",e),u(this,c,he).call(this)},onRegisterError(e){console.error("Service Worker gagal terdaftar:",e)}})},de=function(){d(this,P).addEventListener("click",()=>{d(this,E).classList.toggle("open")}),document.body.addEventListener("click",e=>{!d(this,E).contains(e.target)&&!d(this,P).contains(e.target)&&d(this,E).classList.remove("open"),d(this,E).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&d(this,E).classList.remove("open")})})},ue=async function(){await D.createDB(),console.log("Indexed DB Sudah Siap")},R=function(){g.isLoggedIn()?(u(this,c,le).call(this),u(this,c,W).call(this,!0),d(this,S).textContent="Logout",d(this,S).href="#/logout",d(this,S).addEventListener("click",e=>{e.preventDefault(),g.destroyAuth(),window.location.hash="#/login",u(this,c,R).call(this)})):(d(this,S).textContent="Login",d(this,S).href="#/login",u(this,c,C).call(this,!1),u(this,c,W).call(this,!1))},W=function(e){if(!e){d(this,T).parentElement.style.display="none";return}d(this,T).parentElement.style.display="block"},C=function(e){if(!e){console.log(d(this,v).parentElement),d(this,v).parentElement.style.display="none";return}d(this,v).parentElement.style.display="block"},he=async function(){var t,i,s;if(!("Notification"in window)){console.error("Browser tidak mendukung Notification API"),u(this,c,C).call(this,!1);return}if(this.registrationNotif=await navigator.serviceWorker.getRegistration(),!((t=this.registrationNotif)!=null&&t.pushManager)){u(this,c,C).call(this,!1);return}await((s=(i=this.registrationNotif)==null?void 0:i.pushManager)==null?void 0:s.getSubscription())&&(this.subscribe=!0),u(this,c,J).call(this),d(this,v).addEventListener("click",async()=>{this.subscribe?(await u(this,c,me).call(this),this.subscribe=!1):(await u(this,c,pe).call(this),this.subscribe=!0),u(this,c,J).call(this)})},J=function(){console.log("Notification Navigator"),u(this,c,C).call(this,!0),this.subscribe?d(this,v).textContent="Batalkan Berlangganan Notifikasi":d(this,v).textContent="Berlangganan Notifikasi"},pe=async function(){const e=await Notification.requestPermission();if(e==="denied"){console.log("Izin notification ditolak.");return}if(e==="default"){console.log("Izin notification ditutup atau diabaikan.");return}console.log("Izin notification diterima"),this.notificationPermission=!0;const t=g.getAuth();if(!t||!this.subscribe)return;const i=await this.registrationNotif.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:ve(m.VAPID_PUBLIC_KEY)}),{endpoint:s,keys:a}=i.toJSON(),n={endpoint:s,keys:{auth:a.auth,p256dh:a.p256dh}};try{if(!(await B.subscribeNotification({token:t.token,subscription:n})).ok)throw new Error("Gagal berlangganan notifikasi");alert("Berhasil berlangganan notifikasi")}catch{alert("Gagal subscribe notification"),await i.unsubscribe()}},me=async function(){if(console.log("Unsubscribe Notification"),console.log(this.subscribe),!this.subscribe)return;const e=g.getAuth();if(!e)return;const t=await this.registrationNotif.pushManager.getSubscription();if(!t)return;const{endpoint:i}=t.toJSON();try{const s=await B.unsubscribeNotification({token:e.token,endpoint:i}),a=await s.json();if(!s.ok)throw console.log(a),new Error("Gagal membatalkan langganan notifikasi");alert("Berhasil membatalkan langganan notifikasi")}catch(s){console.log(s),alert("Gagal unsubscribe notification")}},ge=function(){d(this,w).querySelectorAll(".animate-in").forEach((t,i)=>{const s=t.animate([{transform:"translateY(20px)",opacity:0},{transform:"translateY(0)",opacity:1}],{duration:500,delay:100*i,easing:"ease-out",fill:"forwards"});s.onfinish=()=>{t.classList.remove("animate-in")}})};document.addEventListener("DOMContentLoaded",async()=>{const r=new Qe({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer"),authNavItem:document.getElementById("auth-nav-item"),notifSubsItem:document.getElementById("notif-nav-item"),favoritesItem:document.getElementById("fav-nav-item")});await r.renderPage(),window.addEventListener("hashchange",async()=>{await r.renderPage()})});
