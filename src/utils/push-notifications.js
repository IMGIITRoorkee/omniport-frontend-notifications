import firebase from 'firebase'
import { registerToken } from '../actions'
import { urlFirebaseMessagingServiceWorker } from '../urls'
// import { urlFirebaseMessagingServiceWorker } from '../urls'

export const initializeFirebase = () => {
  const config = {
    apiKey: 'AIzaSyDCoWDcyeRSFtjF66-cvoZIi3JedrZmnVk',
    authDomain: 'notification-omni.firebaseapp.com',
    databaseURL: 'https://notification-omni.firebaseio.com',
    projectId: 'notification-omni',
    storageBucket: 'notification-omni.appspot.com',
    messagingSenderId: '272029473313'
  }

  if (!firebase.apps.length) {
    try {
      firebase.initializeApp(config)
    } catch (e) {
      console.error('NOTIFI ', e)
    }
  }
}

export const initializePush = () => {
  const messaging = firebase.messaging()

  navigator.serviceWorker.register(urlFirebaseMessagingServiceWorker())
    .then(registration => {
      console.info('SW REG SUCC', registration)
      messaging.useServiceWorker(registration)
    })
    .catch(err => {
      console.error('SW REG ERR', err)
    })

  // Requesting permission for browser notifications
  messaging
    .requestPermission()
    .then(() => {
      console.info('Have Permission')
      return messaging.getToken()
    })
    .then(token => {
      console.log('FCM Token:', token)
      registerToken(
        token,
        (res) => {
          console.info('RES FCM Token:', token, res)
        },
        (err) => {
          console.error('ERR FCM Token:', token, err)
        }
      )
    })
    .catch(error => {
      if (error.code === 'messaging/permission-blocked') {
        console.log('Please Unblock Notification Request Manually')
      } else {
        console.error('NOTIFI Error Occurred', error, error.code)
      }
    })

  // On receiving a message
  messaging
    .onMessage(payload => {
      console.log('Notification Received', payload)
    })
}
