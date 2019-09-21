import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import { appDetails } from 'formula_one'
import { getMoreNotification } from '../actions'
import { urlNotificationSettings } from '../urls'

import {
  Segment,
  Loader,
  Icon,
  List,
  Header,
  Grid,
  Button
} from 'semantic-ui-react'

import Notification from './notification'

import '../css/notification.css'
import { getTheme } from '../../../../formula_one'

class AppContainer extends React.Component {

  showMore = () => {
    const { notificationList } = this.props
    this.props.GetMoreNotification(notificationList.list.next)
  }

  render () {
    const { notificationList, history } = this.props

    return (
      <div styleName='notification'>
        <Grid divided='vertically'>
          <Grid.Row columns={2} verticalAlign='bottom'>

            <Grid.Column as={Header} textAlign='left' verticalAlign='bottom'>
              All notifications
            </Grid.Column>

            <Grid.Column
              textAlign='right'
              verticalAlign='bottom'
            >
              {
                isBrowser
                  ? (
                    <Header
                      as={Link}
                      color={getTheme()}
                      verticalAlign='bottom'
                      to={urlNotificationSettings()}
                      size='small'
                      styleName={'margin-right-1rem'}
                    >
                      Notifications settings
                    </Header>
                  )
                  :
                  null
              }
              <Header
                as={Link}
                color={getTheme()}
                verticalAlign='bottom'
                // TODO
                to={urlNotificationSettings()}
                size='small'
                styleName={'margin-left-1rem'}
              >
                Mark all read
              </Header>
            </Grid.Column>

          </Grid.Row>
        </Grid>

        <div>

          {
            notificationList.list.results && (
              <List
                selection celled relaxed={'very'}
                styleName='notification-list'
              >
                {
                  notificationList.list.results
                    .filter(notification => {
                      let appPresent = appDetails(
                        (notification.category.isApp)
                          ? notification.category.slug
                          : notification.category.appInfo.name
                      ).present || true // TODO: Remove this or true
                      console.info('APPS PRESENT: ', appPresent)
                      return appPresent
                    })
                    .map(notification => {
                      return (
                        <Notification
                          key={notification.id}
                          notification={notification}
                          history={history}
                        />
                      )
                    })
                }
              </List>
            )
          }

          {
            !notificationList.isLoaded && (
              <Segment basic as={List.Item}>
                <Loader active/>
              </Segment>
            )
          }

          {
            notificationList.isLoaded && (
              (
                !notificationList.list.next && (
                  <Segment basic textAlign='center' as={List.Item}>
                    <Icon name='frown outline'/>
                    No more notifications available. You have scrolled enough
                    for today.
                  </Segment>
                )
              ) ||
              (
                <Segment basic textAlign='center' as={List.Item}>
                  <Button
                    animated='vertical'
                    compact circular mini
                    onClick={this.showMore}
                    color={getTheme()}
                    basic
                  >
                    <Button.Content visible textAlign='center'>
                      More
                    </Button.Content>
                    <Button.Content hidden>
                      <Icon name='arrow down'/>
                    </Button.Content>
                  </Button>
                </Segment>
              )
            )
          }

        </div>

      </div>
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
    GetMoreNotification: page => {
      dispatch(getMoreNotification(page))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer)
