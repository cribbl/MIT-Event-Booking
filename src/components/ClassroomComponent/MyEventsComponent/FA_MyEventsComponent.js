import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress'
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import {firebaseDB} from '../../../firebaseConfig'
import SearchSortContainer from './SearchSortContainer'
import ViewEventDialog from '../../Dialogs/ViewEventDialogComponent'
import FlagRejectDialog from '../../Dialogs/FlagRejectDialog'
import Snackbar from 'material-ui/Snackbar';
import {approveEvent, flagRejectEvent} from '../../../Services/firebaseDBService'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import moment from 'moment';

class FA_MyEventsComponent extends Component {
  constructor(props) {
    super(props)
    this.approve = this.approve.bind(this)
    this.flagReject = this.flagReject.bind(this)
    this.flagRejectConfirm = this.flagRejectConfirm.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this)
    this.handleFlagDialogClose = this.handleFlagDialogClose.bind(this)
    this.nextEvent = this.nextEvent.bind(this);
    this.handleSearch = this.handleSearch.bind(this)

    this.state = {
      fixedHeader: true,
      fixedFooter: false,
      stripedRows: false,
      showRowHover: true,
      showCheckboxes: false,
      myArr: {},
      myArrx: {},
      allArr: {},
      originalArr: {},
      pendingArr: {},
      approvedArr: {},
      SnackBarmessage: '',
      openSnackBar: false,
      autoHideDuration: 3000,
      dialogOpen: false,
      FlagDialogOpen: false,
      currentEvent: {},
      searchContent: '',
    }
}

  handleSearch(content) {
    this.setState({searchContent: content})
    var myArrx = this.state.originalArr
    myArrx = Object.values(myArrx).filter(_event => _event.title.toLowerCase().includes(content.toLowerCase()));
    this.setState({myArrx})
  }

  showDialog(event) {
    this.setState({dialogOpen: true})
    this.setState({currentEvent: event})
  }
  
  approve(event) {
    let scope = this;
    approveEvent(event, 'FA', this.props.user)
    const {myArrx} = scope.state
    delete myArrx[event.key]
    scope.setState({myArrx})
    scope.setState({SnackBarmessage: 'Event successfully approved', openSnackBar: true})
    this.nextEvent()
  }

  flagRejectConfirm(event, mode) {
    this.setState({FlagDialogOpen: true})
    this.setState({currentEvent: event})
    this.setState({flagRejectMode: mode})
  }

  flagReject(event, message, mode) {
    let scope = this;
    flagRejectEvent(event, message, mode, 'FA', this.props.user)
    const {myArrx} = scope.state
    delete myArrx[event.key]
    scope.setState({myArrx})
    scope.setState({SnackBarmessage: 'Event successfully flagged', openSnackBar: true})
    this.setState({FlagDialogOpen: false})
    this.nextEvent()
  }
  
  handleDialogClose() {
    this.setState({dialogOpen: false})
  }

  handleSnackBarClose() {
    this.setState({openSnackBar: false}) 
  }

  handleFlagDialogClose() { this.setState({FlagDialogOpen: false}) }

  nextEvent() {
    let keys = Object.keys(this.state.myArrx)
    if(keys.length == 0){
      this.handleDialogClose()
      return
    }
    let pos = keys.indexOf(this.state.currentEvent.key) + 1
    if(pos == Object.keys(this.state.myArrx).length){
      pos = 0;
    }
    let nextKey = keys[pos]
    let nextEvent = this.state.myArrx[nextKey]
    this.setState({currentEvent: nextEvent})
  }

  filterAndStore(arr) {
    for(let [key, value] of Object.entries(arr)) {
      var x = key
      if(value.FA_appr && value.AD_appr && value.SO_appr) {
        this.state.approvedArr[key] = value
      }
      else if(!value.FA_appr || !value.AD_appr || !value.SO_appr) {
        this.state.pendingArr[key] = value
      }
      this.state.allArr[key] = value
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.filter == 'pending'){
      const {pendingArr} = this.state
      this.setState({myArr: pendingArr})
    }
    else if(newProps.filter == 'approved') {
      const {approvedArr} = this.state
      this.setState({myArr: approvedArr})
    }
    else if(newProps.filter == 'all') {
      const {allArr} = this.state
      this.setState({myArr: allArr})
    }
  }

  
  componentWillMount() {
    if(!(this.props.user && this.props.user.isFA)) {
      hashHistory.push('/auth');
      return
    }
    this.setState({fetching: true})
    
    firebaseDB.ref('/users/' + this.props.user.clubID).on('value',
    function(snapshot) {
      this.setState({fetching: false})
      let events = snapshot.val().my_events
      for(let event in events) {
        firebaseDB.ref('events/' + events[event]).on('value',
        function(snapshot) {
          if(snapshot.val().FA_appr == 'pending') {
            const {myArrx} = this.state
            myArrx[snapshot.key] = snapshot.val()
            myArrx[snapshot.key].key = snapshot.key
            this.setState({myArrx})
            this.setState({originalArr: myArrx})
            this.filterAndStore(myArrx)
          }
        }, this)
      }
    }, this)
  }

  render() {

    return (
      <div style={{display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center', backgroundColor: '', height: '100%'}}>

      <div style={{minWidth: '98%', backgroundColor: '', marginTop: 20}}>
        <SearchSortContainer allLength={Object.keys(this.state.allArr).length} approvedLength={Object.keys(this.state.approvedArr).length} pendingLength={Object.keys(this.state.pendingArr).length} handleSearch={this.handleSearch} />
      </div>
      
      <Snackbar
          open={this.state.openSnackBar}
          message={this.state.SnackBarmessage}
          autoHideDuration={this.state.autoHideDuration}
          onRequestClose={this.handleSnackBarClose}
        />

      <ViewEventDialog open={this.state.dialogOpen} currentEvent={this.state.currentEvent} handleClose={this.handleDialogClose} nextEvent={this.nextEvent} approveHandler={this.approve} rejectHandler={this.reject} flagRejectHandler={this.flagRejectConfirm}/>

      <FlagRejectDialog open={this.state.FlagDialogOpen} currentEvent={this.state.currentEvent} handleClose={this.handleFlagDialogClose} mode={this.state.flagRejectMode} flagRejectHandler={this.flagReject} />

      <Paper style={{width: '98%', height: 500, overflow: 'hidden', marginTop: 20}} zDepth={2}>
        <Table
          style={{backgroundColor: ''}}
          height={'440px'}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow style={{backgroundColor: '#EFF0F2'}}>
              <TableHeaderColumn style={{color: '#000', fontWeight: 700}}>TITLE</TableHeaderColumn>
              <TableHeaderColumn style={{color: '#000', fontWeight: 700}}>START DATE</TableHeaderColumn>
              <TableHeaderColumn style={{color: '#000', fontWeight: 700}} hidden={this.props.isMobile}>END DATE</TableHeaderColumn>
              <TableHeaderColumn style={{color: '#000', fontWeight: 700, width: this.props.isMobile ? 'auto' : '10%'}}>ACTIONS</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >

          {this.state.fetching &&
            <div style={{textAlign: 'center', marginTop: '10%'}}>
              <CircularProgress size={60} />
            </div>
          }

          { Object.keys(this.state.myArrx).length > 0 ? (Object.values(this.state.myArrx).map(function(event, index) {
            return(
                  <TableRow key={index}>
                    <TableRowColumn>{event.title}</TableRowColumn>
                    <TableRowColumn>{moment(event.start_date, 'DD-MM-YYYY').format("ddd, DD MMM 'YY")}</TableRowColumn>
                    <TableRowColumn hidden={this.props.isMobile}>{moment(event.end_date, 'DD-MM-YYYY').format("ddd, DD MMM 'YY")}</TableRowColumn>
                    <TableRowColumn style={{width: this.props.isMobile?'auto':'10%', textOverflow: 'clip'}}>
                      {<IconMenu
                      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      useLayerForClickAway={true}
                      >
                      <MenuItem primaryText="View" onClick={() => this.showDialog(event)}/>
                      <MenuItem primaryText="Approve" onClick={() => this.approve(event)}/>
                      <MenuItem primaryText="Reject" onClick={() => this.flagRejectConfirm(event, "reject")}/>
                      <MenuItem primaryText="Flag" onClick={() => this.flagRejectConfirm(event, "flag")}/>
                      </IconMenu>}
                    </TableRowColumn>
                  </TableRow>
            )}, this)) : (

              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: this.props.isMobile ? '15%' : '2%', textAlign: 'center', minHeight: 250}} hidden={this.state.fetching}>
                <img src={require(this.state.searchContent.length > 0 ? "../../../assets/empty-state.gif" : "../../../assets/empty-state.jpeg")} style={{width: this.props.isMobile ? '70%' : '30%', marginBottom: 10}} />
                <p>{this.state.searchContent.length > 0 ? "No events for this search" : "Yay! You have no Pending Events"}</p>
                </div>
              )
          }
          
          </TableBody>
        </Table>
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {openSideNav, isMobile, filter} = state.toggler
  const {user, verified, vals} = state.authentication
  return {
    user,
    openSideNav,
    verified,
    isMobile,
    vals,
    filter
  }
}

export default connect(mapStateToProps)(FA_MyEventsComponent)