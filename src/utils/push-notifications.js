import firebase from 'firebase/app'
import 'firebase/messaging'
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
            console.info('RES FCM Token reg:', token, res)
          },
          err => {
            console.error('ERR FCM Token reg:', token, err)
          }
        )
      )
      return token
    })
    .catch(error => {
      if (error.code === 'messaging/permission-blocked') {
        // TODO: Use react toast message
        console.log('Please Unblock Notification Request Manually')
      } else {
        console.error('NOTIFI Error Occurred', error, error.code)
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
      console.error('SW REG ERR', err)
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
          res => console.info('RES FCM Token unreg:', res),
          err => console.error('ERR FCM Token unreg:', err)
        )
      )
    })
    .catch(reason => {
      console.error(reason)
    })
}
