const CACHE_NAME = "version-1";
const urlsToCache = ["/"];

const self = this;

//install a service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("openend cache");
      return cache.addAll(urlsToCache);
    })
  );
});

//listen for request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

//activate the service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName))
            return caches.delete(cacheName);
        })
      );
    })
  );
});

importScripts("https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.15.1/firebase-messaging.js"
);

firebase.initializeApp({
  messagingSenderId: "537604729078",
  apiKey: "AIzaSyDPUkE6q1Clj_VwH5DW2hcV8EEV8Kg4Cm0",
  authDomain: "vinprep-ff290.firebaseapp.com",
  databaseURL: "https://vinprep-ff290.firebaseio.com",
  projectId: "vinprep-ff290",
  storageBucket: "vinprep-ff290.appspot.com",
  messagingSenderId: "537604729078",
  appId: "1:537604729078:web:1cf12cec26ef658e3724d7",
  measurementId: "G-B60F8NVBQ1",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  var obj = JSON.parse(payload.data.notification);
  var ntitle = obj.title;
  var noptions = {
    body: obj.body,
    icon: obj.icon,
  };
  return self.registration.showNotification(ntitle, noptions);
});
