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
import IconButton from 'material-ui/IconButton'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import {firebaseDB} from '../../../firebaseConfig'
import Snackbar from 'material-ui/Snackbar';
import {approveEvent, flagRejectEvent} from '../../../Services/firebaseDBService'
import Dialogxx from '../../Dialogs/ViewComplaintDialogComponent'
import SortIcon from 'material-ui/svg-icons/content/sort' 
import UpArrow from 'material-ui/svg-icons/navigation/arrow-upward'
import DownArrow from 'material-ui/svg-icons/navigation/arrow-downward'
import moment from 'moment'
import {toggleActions} from '../../../actions/toggleActions'

class ViewComplaintsComponent extends Component {
  constructor(props) {
    super(props)
    this.showDialog = this.showDialog.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.handleFlagDialogClose = this.handleFlagDialogClose.bind(this)
    this.nextComplaint = this.nextComplaint.bind(this)
    this.handleSort = this.handleSort.bind(this);
    this.resolveComplaint = this.resolveComplaint.bind(this)
    
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
      dialogOpen: false,
      FlagDialogOpen: false,
      currentComplaint: null,
      dateSort: null,
    }
}

  showDialog(event) {
    this.setState({dialogOpen: true})
    this.setState({currentComplaint: event})
  }
  
  handleDialogClose() {
    this.setState({dialogOpen: false})
  }

  resolveComplaint(complaint, mode) {
    firebaseDB.ref('complaints/' + complaint.key + '/isResolved').set(true);
    const {myArrx} = this.state
    delete myArrx[complaint.key]
    this.setState({myArrx})
    this.nextComplaint();
    const {dispatch} = this.props
    dispatch(toggleActions.toggleToaster("Complaint Resolved", true))
  }

  handleFlagDialogClose() { this.setState({FlagDialogOpen: false}) }

  nextComplaint() {
    let keys = Object.keys(this.state.myArrx)
    if(keys.length == 0){
      this.handleDialogClose()
      return
    }
    let pos = keys.indexOf(this.state.currentComplaint.key) + 1
    if(pos == Object.keys(this.state.myArrx).length){
      pos = 0;
    }
    let nextKey = keys[pos]
    let nextComplaint = this.state.myArrx[nextKey]
    this.setState({currentComplaint: nextComplaint})
  }

  handleSort() {
    if(this.state.dateSort === 'des')
      this.setState({dateSort: 'asc'})
    else
      this.setState({dateSort: 'des'})
    var scope = this
    var myArrx = this.state.originalArr
    myArrx = Object.values(myArrx).sort(function(a, b)
      { 
        var aDate = moment(a.start_date, 'DD-MM-YYYY');
        var bDate = moment(b.start_date, 'DD-MM-YYYY');
        if(scope.state.dateSort === 'des')
          return (aDate - bDate);
        return (bDate - aDate);
      });
    this.setState({myArrx})
  }

  componentDidMount() {
    if(!this.props.user){
      hashHistory.push('/dashboard')
      return
    }
    this.setState({fetching: true})
        var scope = this;
        firebaseDB.ref().child('complaints').on('value',
        function(snapshot) {
          scope.setState({fetching: false})
          snapshot.forEach(function(child) {
            scope.setState({fetching: false})
              const {myArrx} = scope.state
              myArrx[child.key] = child.val()
              myArrx[child.key].key = child.key
              scope.setState({myArrx})
              scope.setState({originalArr: myArrx})
              console.log(scope.state.myArrx)
          })
        })
  }

  render() {

    return (
      <div style={{display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center', backgroundColor: '', height: '100%'}}>
      
      {/*<div style={{minWidth: '98%', backgroundColor: 'yellow', marginTop: 20}}>
        <SearchSortContainer allLength={Object.keys(this.state.allArr).length} approvedLength={Object.keys(this.state.approvedArr).length} pendingLength={Object.keys(this.state.pendingArr).length}/>
      </div>*/}

      {this.state.currentComplaint && 
      <Dialogxx open={this.state.dialogOpen} currentComplaint={this.state.currentComplaint} handleClose={this.handleDialogClose} nextComplaint={this.nextComplaint} resolveComplaint={this.resolveComplaint} />}

      <Paper style={{width: '98%', height: 500, overflow: 'hidden'}} zDepth={2}>
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
              <TableHeaderColumn style={{color: '#000', fontWeight: 700, width: '15%'}}>Subject</TableHeaderColumn>
              <TableHeaderColumn
                style={{color: '#000', fontWeight: 700, display: 'flex', alignItems: 'center', width: '15%'}}
                hidden={this.props.isMobile}>
                Dated
                <IconButton onClick={this.handleSort} style={{padding: 0, height: 20, width: 20}}>{this.state.dateSort!=null ? (this.state.dateSort === 'asc' ? <UpArrow viewBox='0 0 30 30' /> : <DownArrow viewBox='0 0 30 30' />) : <SortIcon viewBox='0 0 30 30' />}</IconButton>
              </TableHeaderColumn>
              <TableHeaderColumn style={{color: '#000', fontWeight: 700, width: '35%'}}>Description</TableHeaderColumn>
              <TableHeaderColumn style={{color: '#000', fontWeight: 700, width: '20%'}}>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >

          {this.state.fetching && <CircularProgress />}

          { Object.keys(this.state.myArrx).length > 0 ? (Object.values(this.state.myArrx).map(function(complaint, index) {
              return (
                  <TableRow key={index}>
                    <TableRowColumn style={{width: '15%'}}>{complaint.subject}</TableRowColumn>
                    <TableRowColumn style={{width: '15%'}}>{complaint.dated}</TableRowColumn>
                    <TableRowColumn style={{width: '35%'}}>{complaint.desc}</TableRowColumn>
                    <TableRowColumn style={{width: '20%'}}>{<div><RaisedButton label="View" primary={true} style={{marginRight: 10}} onClick={() => this.showDialog(complaint)}/><RaisedButton hidden={this.props.isMobile} label="Approve" primary={true} onClick={() => this.approve(complaint)}/></div>}</TableRowColumn>
                  </TableRow>
            )}, this)) : <p style={{textAlign: 'center', fontSize: '3rem'}}>NO EVENTS PENDING</p>
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

export default connect(mapStateToProps)(ViewComplaintsComponent)