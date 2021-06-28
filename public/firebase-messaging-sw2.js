importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');
importScripts('js/config-firebase.js');


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

