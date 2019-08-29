import { combineReducers } from 'redux'
import notificationList from './notificationList'

const rootReducers = combineReducers({
  notificationList: notificationList
})

export default rootReducers
