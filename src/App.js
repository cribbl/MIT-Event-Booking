import React, { Component } from 'react'
import AppBarComponent from './components/AppBarComponent/AppBarComponent'
import AppBarMobile from './components/AppBarComponent/AppBarMobile'
import ReactLoading from 'react-loading'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SnackbarComponent from './components/SnackbarComponent'
import './App.css'
import { connect } from 'react-redux'
import { userActions } from './actions/userActions'

class App extends Component {
  constructor (props) {
    super(props)
    function noop () {}

    if (process.env.NODE_ENV === 'production') {
      console.log = noop
      console.warn = noop
    }
  }

  componentWillMount () {
    const { dispatch } = this.props
    dispatch(userActions.getUser())
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>
          {this.props.isMobile ? <AppBarMobile /> : <AppBarComponent />}
          {this.props.sessionCheck ? <div style={{ display: 'flex', justifyContent: 'center' }}><ReactLoading type={'cylon'} color={'#00bcd4'} height='667px' width='50%' /></div> : (
            <div className='propChildrenContainer'>
              {this.props.children}
              <SnackbarComponent />
            </div>
          )}
        </div>
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps (state) {
  const { isMobile } = state.toggler
  const { sessionCheck } = state.authentication
  return {
    isMobile,
    sessionCheck
  }
}

export default connect(mapStateToProps)(App)
