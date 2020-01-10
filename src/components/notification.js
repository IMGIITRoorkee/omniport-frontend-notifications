import React from 'react'
import path from 'path'
import { connect } from 'react-redux'
import { List, Image } from 'semantic-ui-react'
import { getThemeObject } from 'formula_one'
import { toast } from 'react-semantic-toasts'

import { markRead } from '../actions'
import '../css/notification.css'

class Notification extends React.Component {
  state = {
    notification: this.props.notification
  }
  render () {
    const { notification } = this.state
    const { history} = this.props
    const app = notification.category.appInfo
    const unreadStyle = {
      backgroundColor: getThemeObject().hexCode + '10' // Opacity
    }

    return (
      <List.Item
        onClick={() => {
          this.props.MarkRead(
            notification.id,
            (res) => {
              console.info(res)
              history.replace(path.join('/', notification.webOnclickUrl))
            },
            (err) => {
              console.error(err)
              toast({
                type: 'error',
                title: 'Error',
                description: 'Could not mark notification as read.',
                animation: 'fade up',
                icon: 'frown up',
                time: 3000
              })
            }
          )
        }}
        style={
          (notification && notification.unread) ? unreadStyle : {}
        }
        styleName='notification-item'
      >
        <Image
          src={
            `/static/${app.baseUrls.static}${
              app.assets.logo
            }`
          }
        />

        <List.Content styleName='notification-content'>
          <List.Header styleName='notification-header'>
            {
              !(notification.category.isApp)
                ? `${app.nomenclature.verboseName}: `
                : ''
            }
            {
              notification.category.name
            }
          </List.Header>
          <List.Description styleName='notification-text'>
            {notification.template}
          </List.Description>
        </List.Content>
        {
          notification.unread
          ?
            <List.Icon
              styleName='notification-read-btn'
              verticalAlign='middle'
              size='small'
              name='envelope'
              title='Mark read'
              onClick={(event) => {
                event.stopPropagation()
                this.props.MarkRead(
                  notification.id,
                  (res) => {
                    this.setState({
                      notification: { ...this.state.notification, unread: false }
                    })
                  },
                  (_) => {
                    toast({
                      type: 'error',
                      title: 'Error',
                      description: 'Could not mark notification as read.',
                      animation: 'fade up',
                      icon: 'frown up',
                      time: 3000
                    })
                  }
                )
              }}
            />
          :
            null
        }

      </List.Item>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    MarkRead: (id, successCallback, errorCallback) => {
      dispatch(markRead([id], successCallback, errorCallback))
    }
  }
}
export default connect(
  null,
  mapDispatchToProps
)(Notification)
