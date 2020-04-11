import React from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import CircularProgress from 'material-ui/CircularProgress'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'

const Subtitle = (props) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <h5> {props.title} </h5>
      {props.approved && <CheckCircleIcon style={{ color: '#558B2F' }} hoverColor={'#33691E'} data-tip='Approved' /> }
    </div>
  )
}
function getRoomsString (rooms) {
  let roomList = ''
  // determines the academic block according to the first digit as array index
  const roomBlock = ['AB-1', 'AB-2', 'NLH', 'IC', 'AB-5']
  // Handle 53101 (5310A) and 53102 (5310B) as special cases.
  rooms.forEach(function (room) {
    let block
    let roomNo
    if (room === 53101 || room === 53102) {
      block = roomBlock[4]
      roomNo = room === 53101 ? '310A' : '310B'
    } else {
      block = Math.floor(room / 1000) - 1
      roomNo = room % 1000
      block = roomBlock[block]
    }
    roomList += block + '-' + roomNo + ', '
  })
  roomList = roomList.replace(/,\s*$/, '')
  return roomList
}

export const EventDetails = (props) => {
  if (props.isRoomSelected) {
    if (props.fetchingEventData) {
      return (
        <div style={{ margin: 'auto', width: 300 }}>
          <p>Fetching Event...</p>
          <CircularProgress size={60} />
        </div>
      )
    } else {
      console.log(props.eventDetails)
      return (
        <Card style={{}}>
          <CardTitle style={{ fontWeight: 'bold', textAlign: 'center' }} title={props.eventDetails.clubName} subtitle={<Subtitle title={props.eventDetails.title} approved={props.eventDetails.SO_appr === 'approved'} />} />
          <CardText style={{ display: 'flex', flexDirection: props.isMobile ? 'column' : 'row', justifyContent: 'space-between' }}>
            <div>
              <List>
                <div style={{ display: 'flex', flexDirection: props.isMobile ? 'column' : 'row' }}>
                  <Subheader> Start </Subheader>
                  <ListItem
                    primaryText={props.eventDetails.startDate}
                    disabled
                    style={{ minWidth: 300 }}
                  />
                </div>
                <Divider />
                <div style={{ display: 'flex', flexDirection: props.isMobile ? 'column' : 'row' }}>
                  <Subheader> End </Subheader>
                  <ListItem
                    primaryText={props.eventDetails.endDate}
                    disabled
                    style={{ minWidth: 300 }}
                  />
                <Divider />
                </div>
              </List>
            </div>
            <div>
              <List>
                <div style={{ display: 'flex', flexDirection: props.isMobile ? 'column' : 'row' }}>
                  <Subheader> Rooms </Subheader>
                  <ListItem
                    primaryText={getRoomsString(props.eventDetails.rooms)}
                    disabled
                    style={{ minWidth: 300 }}
                  />
                </div>
                <Divider style={{ margin: '5px' }} />
                <div style={{ display: 'flex', flexDirection: props.isMobile ? 'column' : 'row' }}>
                  <Subheader> Contact </Subheader>
                  <ListItem
                    primaryText={props.eventDetails.booker_name + ': ' + props.eventDetails.booker_contact}
                    disabled
                    style={{ minWidth: 300 }}
                  />
                </div>
              </List>
            </div>
          </CardText>
        </Card>
      )
    }
  }

  return null
}
