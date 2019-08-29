import axios from 'axios'

import { getCookie } from 'formula_one'
import { urlMarkRead, urlNotificationList, urlRegisterFCMToken } from '../urls'

export const initialiseList = () => {
  return dispatch => {
    console.log('INIT', urlNotificationList())
    dispatch({
      type: 'SET_LOADED',
      payload: false
    })
    axios
      .get(urlNotificationList())
      .then(res => {
        console.log('SUCC', urlNotificationList(), res.data.results)
        dispatch({
          type: 'SET_NOTIFICATION_LIST',
          payload: {
            isLoaded: true,
            list: res.data
          }
        })
      })
      .catch(err => {
        console.log('ERR', err)
        dispatch({
          type: 'SET_LOADED',
          payload: true
        })
      })
  }
}

export const getMoreNotification = page => {
  return dispatch => {
    dispatch({
      type: 'SET_LOADED',
      payload: false
    })
    axios
      .get(page)
      .then(res => {
        dispatch({
          type: 'SET_NOTIFICATION_LIST_NEXT_PAGE',
          payload: {
            isLoaded: true,
            list: res.data
          }
        })
      })
      .catch(_ => {
        dispatch({
          type: 'SET_LOADED',
          payload: true
        })
      })
  }
}

export const markRead = (ids, successCallback, errorCallback) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    axios
      .post(urlMarkRead(), { ids: ids }, { headers: headers })
      .then(res => {
        dispatch({
          type: 'SET_READ',
          payload: res.data
        })
        successCallback(res)
      })
      .catch(err => {
        errorCallback(err)
      })
  }
}

export const registerToken = (token, successCallback, errorCallback) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_REGISTERED',
      payload: false
    })
    axios
      .post(
        urlRegisterFCMToken(),
        { token: token },
        { headers: headers }
      )
      .then(res => {
        dispatch({
          type: 'SET_REGISTERED',
          payload: true
        })
        successCallback(res)
      })
      .catch(err => {
        dispatch({
          type: 'SET_REGISTERED',
          payload: false
        })
        errorCallback(err)
      })
  }
}
