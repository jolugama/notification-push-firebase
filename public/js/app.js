let app = (() => {
    //  const url = window.location.href;
    let messageDisplayed = false;


    let notificacionesActivadas = false;



    // Check that service workers are supported
    if ('serviceWorker' in navigator) {
        // Use the window load event to keep the page load performant
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js');
            window.scroll(0, 0);
        });
    }


    // Detectar cambios de conexión
    let isOnline = () => {
        if (navigator.onLine) {
            // tenemos conexión
            $.mdtoast('Online', {
                interaction: true,
                interactionTimeout: 1000,
                actionText: 'OK!'
            });
        } else {
            // No tenemos conexión
            $.mdtoast('Offline', {
                interaction: true,
                actionText: 'OK',
                type: 'warning'
            });
        }
    }


    let showMessageNotification = () => {
        Swal.fire({
            title: 'Estáte actualizado!',
            html: `Si quieres que te informemos de nuevos <b>productos</b>,
            acepte las notificaciones y le informaremos. `,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Vale!',
            showCancelButton: true,
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> En otro momento.'
        }).then((result) => {

            if (result.isConfirmed) {
                messaging.onTokenRefresh(function () {
                    messaging.getToken()
                        .then(function (newtoken) {
                            console.log("New Token : " + newtoken);
                        })
                        .catch(function (reason) {
                            console.log(reason);
                        })
                })
                IntitalizeFireBaseMessaging();
            }
        })
    }

    let getMessageDisplayed = () => {
        return messageDisplayed;
    }

    let setMessageDisplayed = (_messageDisplayed) => {
        console.log(this.messageDisplayed);
        messageDisplayed = _messageDisplayed;
        console.log(this.messageDisplayed);
    }

    let getNotificacionesActivadas = () => {
        return notificacionesActivadas;
    }


    // PRIVADAS

    // retorna la clave pública del notification push
    let _getPublicKey = () => {
        return fetch('api/key')
            .then(res => res.arrayBuffer())
            // retornar array, como un Uint8array
            .then(key => new Uint8Array(key));
    }

    //  // cancela la subscripción. 
    //  let _cancelarSuscripcion = () => {
    //      // nos subscribimos a push manager
    //      swReg.pushManager.getSubscription().then(subs => {
    //          subs.unsubscribe().then(() => _verificaSuscripcion(false));
    //      });
    //  }

    //  // Notificaciones
    //  let _verificaSuscripcion = (activadas) => {
    //      if (activadas) {
    //          notificacionesActivadas = true;
    //          console.log('notificaciones activadas');
    //      } else {
    //          notificacionesActivadas = false;
    //          console.log('notificaciones desactivadas');
    //      }
    //  }
    // FIN PRIVADAS

    return {
        isOnline: isOnline,
        showMessageNotification: showMessageNotification,
        getMessageDisplayed: getMessageDisplayed,
        getNotificacionesActivadas: getNotificacionesActivadas,
        setMessageDisplayed: setMessageDisplayed
    }


})();


window.addEventListener('online', app.isOnline);
window.addEventListener('offline', app.isOnline);
app.isOnline();



// *****************
// eventos
// *****************

setTimeout(() => {
    // si pasa por una posición de scroll, compruebo y muestro mensaje aceptación notificación push
    return $(window).scroll((event) => {
        let scrollPercent = Math.round(100 * $(window).scrollTop() / ($(document).height() - $(window).height()));
        // MOSTRAR MENSAJE SI:
        // scroll es mayor a 80%, el usuario expresamente no lo ha denegado previamente, 
        // pregunto al sw, si las notificaciones no están aún activadas
        if (!app.getMessageDisplayed() && scrollPercent > 80 && Notification.permission !== 'denied' && Notification.permission !== 'granted') {
            app.setMessageDisplayed(true);
            console.log('se muestra mensaje para que acepte notificaciones');
            app.showMessageNotification();
        } else if (!app.getMessageDisplayed() && scrollPercent > 80 && Notification.permission === 'denied') {
            app.setMessageDisplayed(true);
            Swal.fire({
                title: 'Notificaciones denegadas',
                html: `Es una pena que tengas las notificaciones bloqueadas, 
            si las aceptases te avisaríamos de las mejores <b>ofertas</b> `
            })
        }
    });
}, 3000);







// SIN IMPORTANCIA, sin usar


/**
 * envia una notificación desde el usuario, sin el lado del servidor.
 * @returns 
 */
let notifyMe = (titulo, cuerpo) => {
    if (!window.Notification) {
        console.log('Este navegador no soporta notificaciones');
        return;
    }
    if (Notification.permission === 'granted') {
        // new Notification('Hola Mundo! - granted');
        _enviarNotificacion(titulo, cuerpo);
    } else if (Notification.permission !== 'denied' || Notification.permission === 'default') {
        Notification.requestPermission((permission) => {
            console.log(permission);
            if (permission === 'granted') {
                // new Notification('Hola Mundo! - pregunta');
                _enviarNotificacion(titulo, cuerpo);
            }
        });
    }
}


let _enviarNotificacion = (titulo, cuerpo) => {
    const notificationOpts = {
        body: cuerpo,
        icon: 'images/icons/icon-72x72.png'
    };
    const n = new Notification(titulo, notificationOpts);
    n.onclick = () => {
        console.log('Click');
    };
}


// notifyMe("holi","que tal?");









//FIREBASE
function IntitalizeFireBaseMessaging() {
    messaging
        .requestPermission()
        .then(function () {
            console.log("Notification Permission");
            return messaging.getToken();
        })
        .then(function (token) {
            console.log("Token : " + token);
        })
        .catch(function (reason) {
            console.log(reason);
        });
}

messaging.onMessage(function (payload) {
    console.log(payload);
    const notificationOption = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    if (Notification.permission === "granted") {
        var notification = new Notification(payload.notification.title, notificationOption);

        notification.onclick = function (ev) {
            ev.preventDefault();
            window.open(payload.notification.click_action, '_blank');
            notification.close();
            º
        }
    }

});