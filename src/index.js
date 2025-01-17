import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import thunk from 'redux-thunk'
import { toast } from 'react-semantic-toasts'


import { whoami } from 'services/auth/src/actions'
import PRoute from 'services/auth/pRoute'

import App from './components/app'
import { initializeFirebase, initializePush } from './utils/push-notifications'
import rootReducers from './reducers'

const mapDisPatchToProps = dispatch => {
  return {
    whoami: () => dispatch(whoami()),
  }
}
@connect(
  null,
  mapDisPatchToProps
)
export default class AppRouter extends Component {
  constructor (props) {
    super(props)
    this.store = createStore(rootReducers, applyMiddleware(thunk))
  }
  
  componentDidMount () {
    this.props.whoami()
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator)
      initializeFirebase()
        .then(() => initializePush(this.store))
        .catch(err => console.log(err)) // TODO
  }
  
  render () {
    const { match } = this.props
    return (
      <Provider store={this.store}>
        <PRoute path={`${match.path}/`} component={App}/>
        {/* Default Route */}
      </Provider>
    )
  }
}
