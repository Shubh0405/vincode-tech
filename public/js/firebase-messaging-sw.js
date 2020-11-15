const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

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
  messagingSenderId: "529535776394",
  apiKey: "AIzaSyBCWNBrD6PLV-BtvYR6wEeBTg2V7XwhYC0",
  authDomain: "ventor-7f759.firebaseapp.com",
  databaseURL: "https://ventor-7f759.firebaseio.com",
  projectId: "ventor-7f759",
  storageBucket: "ventor-7f759.appspot.com",
  messagingSenderId: "529535776394",
  appId: "1:529535776394:web:84b74c7212676996309f73",
  measurementId: "G-YWPCQ1Q2FZ",
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
