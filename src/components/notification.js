import React from 'react'
import { connect } from 'react-redux'
import { List, Image } from 'semantic-ui-react'
import { getThemeObject } from 'formula_one'
import { markRead } from '../actions'
import '../css/notification.css'
import { appDetails } from '../../../../formula_one'

class Notification extends React.Component {
  render () {
    // TODO: Handle read-unread
    const { notification, history } = this.props
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
              history.replace(notification.webOnclickUrl)
            },
            (err) => {
              console.error(err)
              // TODO: Error handler
            }
          )
        }}
        style={
          (notification && notification.unread) ? unreadStyle : {}
        }
        styleName='notification-item'
      >
        <Image
          // src={
          //   appDetails(
          //     notification.category.appInfo.verboseName
          //   ).details.assets.logo
          // }
          src={'https://react.semantic-ui.com/images/avatar/small/christian.jpg' /* TODO */}
        />

        <List.Content styleName='notification-content'>
          <List.Header styleName='notification-header'>
            {
              !(notification.category.isApp)
                ? `${notification.category.appInfo.verboseName}: `
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

        <List.Icon
          styleName='notification-read-btn'
          verticalAlign='middle'
          size='small'
          name={notification.unread ? 'envelope' : 'envelope open outline'}
          onClick={(event) => {
            event.preventDefault()
            this.props.MarkRead(
              notification.id,
              (res) => {
                console.log('MARK_READ_RES', res)
              },
              (err) => {
                console.error('MARK_READ_ERR', err)
              }
            )
          }}
        />
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
