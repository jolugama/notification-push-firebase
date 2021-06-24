importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');


var firebaseConfig = {
    apiKey: "AIzaSyDzCa49qFHdSHVPCAGjSkbg0otzfdYYdNk",
    authDomain: "mypwa-8c271.firebaseapp.com",
    projectId: "mypwa-8c271",
    storageBucket: "mypwa-8c271.appspot.com",
    messagingSenderId: "475764615194",
    appId: "1:475764615194:web:2db636ff8a5588b2f9c9a3",
    measurementId: "G-3BQG8M4FLW"
};
firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});