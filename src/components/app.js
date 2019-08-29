import React from 'react'
import { connect } from 'react-redux'
import { isMobile, isBrowser } from 'react-device-detect'
import { Scrollbars } from 'react-custom-scrollbars'
import { Container } from 'semantic-ui-react'

import Sidebar from 'core/common/src/components/primary-sidebar'
import { AppHeader, AppFooter, AppMain } from 'formula_one'
import { initialiseList, getMoreNotification } from '../actions'
import AppContainer from './app-container'

import main from 'formula_one/src/css/app.css'

class App extends React.PureComponent {
  componentDidMount () {
    this.props.InitialiseList()
  }

  handleScroll = values => {
    const { notificationList } = this.props
    if (notificationList.isLoaded) {
      if (
        (1 - values.top) * values.scrollHeight <= 800 && notificationList.list.next
      ) {
        this.props.GetMoreNotification(notificationList.list.next)
      }
    }
  }

  render () {
    const creators = [
      {
        name: 'Ayush Jain',
        role: 'Full-stack developer',
      },
    ]
    return (
      <React.Fragment>
        <div styleName='app'>
          <AppHeader userDropdown/>
          {isMobile && <Sidebar/>}
          <AppMain>
            <div styleName='main.app-main'>
              {isBrowser && <Sidebar/>}
              <Scrollbars autoHide onScrollFrame={this.handleScroll}>
                <Container>
                  <AppContainer history={this.props.history}/>
                </Container>
              </Scrollbars>
            </div>
          </AppMain>
          <AppFooter creators={creators}/>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    notificationList: state.notificationList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    InitialiseList: () => {
      dispatch(initialiseList())
    },
    GetMoreNotification: page => {
      dispatch(getMoreNotification(page))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
