const initialState = {
  isLoaded: false,
  list: {}
}

const notificationList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION_LIST':
      console.log('Reducer SET_NOTIFICATION_LIST')
      return action.payload
    case 'SET_NOTIFICATION_LIST_NEXT_PAGE':
      return {
        ...action.payload,
        list: {
          ...action.payload.list,
          results: [...state.list.results, ...action.payload.list.results]
        }
      }
    case 'SET_LOADED':
      console.log('Reducer SET_LOADED')
      return {
        ...state,
        isLoaded: action.payload
      }
    case 'SET_READ':
      return {
        ...state,
        list: {
          ...state.list,
          results: state.list.results.map(x => {
            if (x.id !== action.payload.id) {
              return x
            }
            return action.payload
          })
        }
      }
    default:
      return state
  }
}

export default notificationList
