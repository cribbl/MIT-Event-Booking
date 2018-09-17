import React, { Component } from 'react'
import axios from 'axios'
import { firebaseDB } from '../../../firebaseConfig'

import firebase from 'firebase'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import { getUserDetails, updateUser } from '../../../Services/firebaseDBService'
import { sendPasswordResetEmail } from '../../../Services/firebaseAuthService'
import { uploadProfilePic } from '../../../Services/firebaseStorageService'
import { requestOTP } from '../../../Services/NotificationService'

import { connect } from 'react-redux'
import Avatar from 'material-ui/Avatar'
import { Tabs, Tab } from 'material-ui/Tabs'
import Slider from 'material-ui/Slider'
import Divider from 'material-ui/Divider'
import Toggle from 'material-ui/Toggle'
import Snackbar from 'material-ui/Snackbar'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Checkbox from 'material-ui/Checkbox'

import OtpDialog from '../../Dialogs/OtpDialog'

class NotificationsContainer extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this._updateUser = this._updateUser.bind(this)
    this.state = {
      tempSettings: null,
      hasChanged: false
    }
  }

  componentWillMount () {
    this.props.user && this.setState({
      tempSettings: {
        email: this.props.user.notificationSettings.email,
        sms: this.props.user.notificationSettings.sms
      }
    })
  }

  handleChange (event, isChecked, field) {
    let temp = this.state.tempSettings
    temp[field] = isChecked ? 1 : 0
    this.setState({ tempSettings: temp })

    if (this.state.tempSettings[field] != this.props.user.notificationSettings[field]) {
      this.setState({ hasChanged: true })
    } else {
      this.setState({ hasChanged: false })
    }
  }

  _updateUser () {
    console.log('update')
    let finalSettings = {
      notificationSettings: this.state.tempSettings
    }
    updateUser(this.props.user.uid, finalSettings)
  }

  render () {
    return (
      <Paper zDepth={3} style={{ minHeight: 380, display: 'flex', justifyContent: 'center', width: '100%', padding: 10 }}>

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <List>
            <Subheader>Email Notifications</Subheader>
            <ListItem
              rightToggle={<Toggle defaultToggled={this.props.user && this.props.user.notificationSettings.email == 1} onToggle={(event, isChecked) => this.handleChange(event, isChecked, 'email')} />}
              primaryText='Every Stage'
              secondaryText='Otherwise, only at final approval'
            />
            <Divider />

            <Subheader>SMS Notifications</Subheader>
            <ListItem
              rightToggle={<Toggle defaultToggled={this.props.user && this.props.user.notificationSettings.sms == 1} onToggle={(event, isChecked) => this.handleChange(event, isChecked, 'sms')} />}
              primaryText='Every Stage'
              secondaryText='Otherwise, only at final approval'
            />
          </List>
          <div>
            <RaisedButton label='Save'
              primary
              disabled={!this.state.hasChanged}
              style={{ marginLeft: 20 }}
              onClick={this._updateUser}
            />
          </div>
        </div>
      </Paper>
    )
  }
}

function mapStateToProps (state) {
  const { openSideNav, isMobile, filter } = state.toggler
  const { user, verified } = state.authentication
  return {
    user,
    openSideNav,
    verified,
    isMobile,
    filter
  }
}

export default connect(mapStateToProps)(NotificationsContainer)
