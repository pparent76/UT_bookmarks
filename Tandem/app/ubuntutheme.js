setInterval(() => {
  const el = document.querySelector('[class^="styles_login"]');
  if (el) {
    el.style.display = 'block';
  }
}, 200);


  function addCss(cssString) {
      var head = document.getElementsByTagName('head')[0];
      var newCss = document.createElement('style');
      newCss.type = "text/css";
      newCss.innerHTML = cssString;
      head.appendChild(newCss);
  }
  
  setTimeout(() => {
  addCss("p { font-size: 150% !important; }");  
  addCss("textarea { font-size: 150% !important; }");
  },1000);
  
//----------------------------------------------------------------------------
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   SECTION11:  Request Desktop Notification permission, on load
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//----------------------------------------------------------------------------
Notification.requestPermission();

//-----------------------------------------------------------------------
//                     End of main thing
//-----------------------------------------------------------------------

//----------------------------------------------------------------------------
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   SECTION12:  Detect Audio évents to trigger Notifications
//                to detect audio notifications
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//----------------------------------------------------------------------------
(function() {
  if (window.__my_audio_hook_installed) return;
  window.__my_audio_hook_installed = true;

  function logAudioEvent(info) {
    try {
      console.log("[DbgAud] " + info);
    } catch (e) { /* safe */ }
  }

  // 1) Intercepter constructeur Audio (alias de HTMLAudioElement)
  try {
    const OrigAudio = window.Audio;
    window.Audio = function(src) {
      const a = new OrigAudio(src);
      // attach listeners to catch play
      a.addEventListener('play', function(){ logAudioEvent((a.currentSrc || a.src || "")); }, {passive:true});
      a.addEventListener('playing', function(){ logAudioEvent((a.currentSrc || a.src || "")); }, {passive:true});
      return a;
    };
    // preserve prototype / static props
    window.Audio.prototype = OrigAudio.prototype;
    Object.getOwnPropertyNames(OrigAudio).forEach(function(k){
      try { if (!(k in window.Audio)) window.Audio[k] = OrigAudio[k]; } catch(e){}
    });
  } catch(e) {}

  // 2) Intercepter HTMLAudioElement / HTMLMediaElement.play
  try {
    const mp = HTMLMediaElement && HTMLMediaElement.prototype;
    if (mp && !mp.__play_hooked__) {
      const origPlay = mp.play;
      mp.__play_hooked__ = true;
      mp.play = function() {
        try {
          const src = this.currentSrc || this.src || "";
          logAudioEvent( src);
        } catch(e){}
        return origPlay.apply(this, arguments);
      }
    }
  } catch(e){}

})();



//----------------------------------------------------------------------------
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   SECTION13:  Handle blob downloads Workaround. 
//               This work with qml-download-helper-module to allow downloads
//               Despite that Qt5 does not support download from blobs.
//               TO BE REMOVED WHEN UPGRADING TO QT6
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//----------------------------------------------------------------------------

const blobMap = new Map();
var downloadedBlob;

  // 1) Surveiller la création des blob: URLs
  const origCreateObjectURL = URL.createObjectURL.bind(URL);
  URL.createObjectURL = function (blob) {
    const url = origCreateObjectURL(blob);
    try {
      blobMap.set(url, { blob, createdAt: new Date() });
    } catch (e) { /* fail silently si Map non permise */ }
    return url;
  };

  // 1b) Surveiller revoke (nettoyage)
  const origRevokeObjectURL = URL.revokeObjectURL.bind(URL);
  URL.revokeObjectURL = function (url) {
    if (blobMap.has(url)) {
      blobMap.delete(url);
    }
    return origRevokeObjectURL(url);
  };


  
  function saveBlob(blob, key) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MyDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("blobs")) {
                db.createObjectStore("blobs");
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction("blobs", "readwrite");
            const store = tx.objectStore("blobs");
            store.put(blob, key);

            tx.oncomplete = () => {resolve(); console.log('[DownloadBlob] test');}
            tx.onerror = (e) => reject(e);
        };

        request.onerror = (e) => reject(e);
    });
}

  // 2) Intercepter les clics sur les liens <a> pointant vers blob:
  document.addEventListener('click', function (ev) {
    // ne pas empêcher le comportement par défaut, juste logger
    let target = ev.target;
    while (target && target !== document) {
      if (target.tagName === 'A' && target.href) {
        try {
          const href = target.href;
          if (href.startsWith('blob:')) {
            const entry = blobMap.get(href);
            downloadedBlob=entry;
            saveBlob(downloadedBlob.blob,"testpierre")
          }
        } catch (e) { /* ignore */ }
        break; // qu'on trouve ou pas, on sort
      }
      target = target.parentNode;
    }
  }, true); // capture phase pour attraper tôt
