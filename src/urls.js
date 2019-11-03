export function urlNotificationSettings () {
  return `/settings/manage_notifications/`
}

export function urlNotificationList () {
  return `/api/notifications/user_notifications/`
}

export function urlMarkRead () {
  return `/api/notifications/read/`
}

export function urlRegisterFCMToken () {
  return `/api/notifications/token/`
}

export function urlFirebaseMessagingServiceWorker () {
  return `/static/notifications/firebase-messaging-sw.js`
}
