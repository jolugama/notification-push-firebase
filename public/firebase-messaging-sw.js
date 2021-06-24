importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');
importScripts('js/config-firebase.js');

// var firebaseConfig = {
//     apiKey: "AIzaSyDzCa49qFHdSHVPCAGjSkbg0otzfdYYdNk",
//     authDomain: "mypwa-8c271.firebaseapp.com",
//     projectId: "mypwa-8c271",
//     storageBucket: "mypwa-8c271.appspot.com",
//     messagingSenderId: "475764615194",
//     appId: "1:475764615194:web:2db636ff8a5588b2f9c9a3",
//     measurementId: "G-3BQG8M4FLW"
// };
// firebase.initializeApp(firebaseConfig);
// const messaging=firebase.messaging();

// onBackgroundMessage
// la vibración no consigo que se active en móvil
messaging.setBackgroundMessageHandler( (payload)=> {
    console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon,
        vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});

