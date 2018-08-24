import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less'
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import FaceIcon from 'material-ui/svg-icons/action/face'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'
import Snackbar from 'material-ui/Snackbar';

import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import axios from 'axios';
import { Link, hashHistory } from 'react-router'
import DrawerComponent from './../DrawerComponent/DrawerComponent'
import {notif} from '../../Services/firebaseAuthService'
import {connect} from 'react-redux'
import { toggleActions } from '../../actions/toggleActions'
import { userActions } from '../../actions/userActions'

import ProfileMenu from './ProfileMenu'
import './AppBarComponent.css'

  const MyNavLinks = () => (
    <ToolbarGroup>
      <Link to="/" activeClassName=""><FlatButton label="Home" /></Link>
      {/*<Link to="/complaints" activeClassName=""><FlatButton label="Complaints" /></Link>*/}
      <Link to="/auth" activeClassName=""><FlatButton label="Login" /></Link>
	  </ToolbarGroup>
	);

  const MyTitle = (props) => (
    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
    <h2 style={{alignSelf: 'center', marginTop: 11}}>{props.content}</h2>
    <div>
    <Link to="/" activeClassName=""><FlatButton label="Home" /></Link>
  {/*  <Link to="/complaints" activeClassName=""><FlatButton label="Complaints" /></Link> */}
    <Link to="/dashboard" activeClassName=""><FlatButton label="Dashboard" /></Link>
    </div>
    </div>
  )


class AppBarComponent extends Component {
  constructor (props) {
    super(props)
    this.changeProfileMenu = this.changeProfileMenu.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
        
    this.state = {
      showMenuIcon: false,
      SnackBarmessage: '',
      openSnackBar: false,
      autoHideDuration: 3000
    }
  }
  
  handleSnackBarClose() {
    this.setState({openSnackBar: false}) 
  }

  notif(not) {
    console.log(not);
    this.setState({SnackBarmessage: 'not', openSnackBar: true})
  }


  changeProfileMenu (event) {
    const { dispatch } = this.props;
    dispatch(toggleActions.toggleProfileMenu());
    this.setState({ anchorEl: event.currentTarget })
  }

  componentWillMount() {

    console.log(window.location.hash)
    if(window.location.hash.search('dashboard') > -1) {
      if(this.props.user && !this.props.user.isApproved) {
        console.log("APP BAR WORKING")
        hashHistory.push('auth');
      }
      this.setState({showMenuIcon: true})
    }

    hashHistory.listen(location => {
    const {dispatch} = this.props
    dispatch(userActions.errorNuller())
    console.log(location.pathname);
    if (['/home', '/complaints', '/auth', '/'].indexOf(location.pathname) > -1) {
      this.setState({showMenuIcon: false})
    }
    else
      this.setState({showMenuIcon: true})
  })
  }

  render() {
    return (
      <div>
      {
        !this.props.user ? (
        <AppBar
          style={{position: "fixed"}}
          title={<Link to="/" style={{color: 'black', textDecoration: 'none'}}>{"<Portal />"}</Link>}
          zDepth={1}
          children={<MyNavLinks />}
          showMenuIconButton={false}
        />
        ) : (
        <AppBar
          style={{position: "fixed"}}
          title={<MyTitle content={this.props.user.name} hidden={this.state.showMenuIcon}/>}
          zDepth={1}
          iconElementLeft={<IconButton>{this.props.openSideNav ? <CloseIcon /> : <MenuIcon />}</IconButton>}
          showMenuIconButton={this.state.showMenuIcon}
          onRightIconButtonClick={this.changeProfileMenu}
          showMenuIconButton={false}
          iconElementRight={
            <div className="avatar">
                <Avatar src={this.props.user.profilePicURL?this.props.user.profilePicURL:!!this.props.user.isClub ? require("../../assets/clubDefaultProfilePicture.jpeg") : require("../../assets/personDefaultProfilePic.png")}/>
                <div style={{paddingTop: 6}}>
                {this.props.openProfileMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
              <ProfileMenu anchorEl={this.state.anchorEl} open={this.props.openProfileMenu} onRequestClose={this.changeProfileMenu}/>
            </div>
          } />
        )
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {user} = state.authentication
  const{openProfileMenu} = state.toggler  
  return {
    user,
    openProfileMenu
  }
}

export default connect(mapStateToProps)(AppBarComponent)
