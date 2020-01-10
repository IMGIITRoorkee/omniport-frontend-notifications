import firebase from 'firebase/app'
import 'firebase/messaging'
import { toast } from 'react-semantic-toasts'

import { registerToken, unregisterToken, initialiseList } from '../actions'
import { urlFirebaseMessagingServiceWorker } from '../urls'

function setToken (store) {
  const messaging = firebase.messaging()
  messaging.getToken()
    .then(token => {
      store.dispatch(
        registerToken(
          token,
          res => {
          },
          err => {
          }
        )
      )
      return token
    })
    .catch(error => {
      if (error.code === 'messaging/permission-blocked') {
        toast({
          type: 'info',
          title: 'Enable Push Notification',
          description: `The notifications are blocked for this site.
          Please unblock manually to receive push notifications.`,
          animation: 'fade up',
          time: 3000
        })
      } else {
        console.error('FCM token registration error: ', error, error.code)
      }
    })
}

export const initializeFirebase = () => {
  return new Promise((resolve, reject) => {
    const config = require('./firebase-config')
      if (!firebase.apps.length) {
      try {
        firebase.initializeApp(config)
        resolve()
      } catch (err) {
        reject(err)
      }
    }
  })
}

export const initializePush = (store) => {
  const messaging = firebase.messaging()
  
  // Register service worker
  navigator.serviceWorker.register(urlFirebaseMessagingServiceWorker())
    .then(registration => {
      messaging.useServiceWorker(registration)
    })
    .catch(err => {
      console.error(`Service worker ${urlFirebaseMessagingServiceWorker()}
       not registered. ERROR: `, err)
    })
  
  // Requesting permission for browser notifications
  Notification
    .requestPermission()
    .then(() => {
      setToken(store)
    })
  
  // On receiving a message
  messaging
    .onMessage(payload => {
      store.dispatch(initialiseList())
    })
  
  // On token refresh
  messaging
    .onTokenRefresh(() => setToken(store))
}

export const deleteToken = (store) => {
  const messaging = firebase.messaging()
  
  messaging.getToken()
    .then(token => messaging.deleteToken(token))
    .then(() => {
      store.dispatch(
        unregisterToken(
          (_ => console.info('FCM token successfully unregistered')),
          (_ => console.warn('FCM token could not be unregistered')),
        )
      )
    })
}
