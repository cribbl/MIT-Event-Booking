import React, {Component} from 'react';
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'
import CircularProgress from 'material-ui/CircularProgress'
import {updateDatesDBx} from '../../../Services/firebaseDBService'

class RoomsContainer extends Component {
  constructor (props) {
    super(props)
    this.handleRoomSelection = this.handleRoomSelection.bind(this);
    this.state = {
      selectedRooms: [],
      takenRooms: []
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.takenRooms) {

      let temp = this.state.selectedRooms
      for(let room of newProps.takenRooms) {
        if((temp).includes(room)) {
          let index = temp.indexOf(room);
          temp.splice(index, 1);
        }
      }
      this.setState({takenRooms: newProps.takenRooms, selectedRooms: temp})
    }
  }
  
  handleRoomSelection(id) {
    let temp = this.state.selectedRooms;

    if(temp.includes(id)) {
      let index = temp.indexOf(id);
      temp.splice(index, 1);
    }
    else {
      if(temp.length >= 4) {
        console.log('Max 4 rooms allowed')
        return
      }
      temp.push(id);
    }
    this.setState({selectedRooms: temp})
    this.props.handleSelectedRooms(temp);
  }

  render() {
    const styles = {
      paper: {
        minHeight: 300,
        marginTop: 20,
        display: 'flex',
        flexDirection: this.props.isMobile ? 'column' : 'row',
        justifyContent: this.props.isMobile ? 'start' : 'space-between',
        alignItems: !this.props.datesSelected || this.props.fetchingRooms ? 'center' : ''
      },
      roomButton: {
        minWidth: 0,
        height: 30,
        lineHeight: '14px'
      },
      roomButtonLabel: {
        margin: 0,
        padding: this.props.isMobile ? 6 : 12
      },
      buttonsRow: {
        display: 'flex',
        justifyContent: 'space-around',
        margin: '4px 0px'
      }
    }

    const MyRaisedButton = (props) => {
      var scope = this;
      let label = (props.id)%1000;
      return (
        <RaisedButton
          label={label}
          style={styles.roomButton}
          labelStyle={styles.roomButtonLabel}
          disabledBackgroundColor={'#FAE0DE'}
          disabled={(scope.state.takenRooms).includes(props.id)}
          primary={(scope.state.selectedRooms).includes(props.id)}
          onClick={() => this.handleRoomSelection(props.id)}
        />
      );
    }

    if(!this.props.datesSelected) {
      return (
        <Paper style={styles.paper} zDepth={1}>
          <div style={{width: '100%'}}>
            <p>Please select date</p>
          </div>
        </Paper>
      )
    }

    else if(this.props.fetchingRooms) {
      return (
        <Paper style={styles.paper} zDepth={1}>
          <div style={{width: '100%'}}>
            <CircularProgress size={60} />
          </div>
        </Paper> 
      )
    }

    else
    return (
      <Paper style={styles.paper} zDepth={1}>
        
        <div style={{width: this.props.isMobile ? '100%' : '35%', backgroundColor: '', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
          <h4>NLH</h4>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={3101} />
            <MyRaisedButton id={3102} />
            <MyRaisedButton id={3103} />
            <MyRaisedButton id={3104} />
            <MyRaisedButton id={3105} />
          </div>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={3201} />
            <MyRaisedButton id={3202} />
            <MyRaisedButton id={3203} />
            <MyRaisedButton id={3204} />
            <MyRaisedButton id={3205} />
          </div>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={3301} />
            <MyRaisedButton id={3302} />
            <MyRaisedButton id={3303} />
            <MyRaisedButton id={3304} />
            <MyRaisedButton id={3305} />
          </div>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={3401} />
            <MyRaisedButton id={3402} />
            <MyRaisedButton id={3403} />
            <MyRaisedButton id={3404} />
            <MyRaisedButton id={3405} />
          </div>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={3501} />
            <MyRaisedButton id={3502} />
            <MyRaisedButton id={3503} />
            <MyRaisedButton id={3504} />
            <MyRaisedButton id={3505} />
          </div>
        </div>

        <div style={{display: this.props.isMobile ? 'none' : '', height: 300, border: '1px solid lightgrey'}}></div>

        <div style={{width: this.props.isMobile ? '100%' : '63%', backgroundColor: '', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
          <h4>AB-5</h4>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={5201} />
            <MyRaisedButton id={5202} />
            <MyRaisedButton id={5203} />
            <MyRaisedButton id={5204} />
            <MyRaisedButton id={5205} />
            <MyRaisedButton id={5206} />
            <MyRaisedButton id={5207} />
            <MyRaisedButton id={5208} />
            <MyRaisedButton id={5209} />
          </div>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={5210} />
            <MyRaisedButton id={5211} />
            <MyRaisedButton id={5212} />
            <MyRaisedButton id={5213} />
            <MyRaisedButton id={5214} />
            <MyRaisedButton id={5215} />
            <MyRaisedButton id={5216} />
            <MyRaisedButton id={5217} />
            <MyRaisedButton id={5218} />
          </div>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={5301} />
            <MyRaisedButton id={5302} />
            <MyRaisedButton id={5303} />
            <MyRaisedButton id={5304} />
            <MyRaisedButton id={5305} />
            <MyRaisedButton id={5306} />
            <MyRaisedButton id={5307} />
            <MyRaisedButton id={5308} />
            <MyRaisedButton id={5309} />
          </div>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={5310} />
            <MyRaisedButton id={5311} />
            <MyRaisedButton id={5312} />
            <MyRaisedButton id={5313} />
            <MyRaisedButton id={5314} />
            <MyRaisedButton id={5315} />
            <MyRaisedButton id={5316} />
            <MyRaisedButton id={5317} />
            <MyRaisedButton id={5318} />
          </div>
          <div style={styles.buttonsRow}>
            <MyRaisedButton id={5401} />
            <MyRaisedButton id={5402} />
            <MyRaisedButton id={5403} />
            <MyRaisedButton id={5404} />
            <MyRaisedButton id={5405} />
            <MyRaisedButton id={5406} />
            <MyRaisedButton id={5407} />
            <MyRaisedButton id={5408} />
            <MyRaisedButton id={5409} />
          </div>
        </div>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  const {openSideNav, isMobile, filter} = state.toggler
  const {user, verified} = state.authentication
  return {
    user,
    openSideNav,
    verified,
    isMobile,
    filter
  }
}

export default connect(mapStateToProps)(RoomsContainer)
