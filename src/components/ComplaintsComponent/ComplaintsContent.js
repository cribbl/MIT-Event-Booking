import React, {Component} from 'react';
import {connect} from 'react-redux'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper'

class ComplaintsComponent extends Component {
  constructor (props) {
    super(props);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleOtherSubjectChange = this.handleOtherSubjectChange.bind(this);
    this.state = {
      desc: '',
      subject: '',
      otherSubject: '',
    }
  }

  handleDescChange(e) {
    this.setState({desc: e.target.value});
    this.props.handleDescChange(e)
  };

  handleSelectChange(e, index, value) {
    this.setState({subject: value});
    this.props.handleSubjectChange(value)
  }

  handleOtherSubjectChange(e) {
    this.setState({otherSubject: e.target.value})
    this.props.handleSubjectChange(e.target.value)
  }

  handleAnonymous(event, isInputChecked) {
    this.setState({goAnonymous: isInputChecked})
  }

  render() {
    return (
	    <Paper style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: '', padding: 15, backgroundColor: ''}} zDepth={2}>
      <div style={{display: 'flex'}}>
        <SelectField
          floatingLabelText="Subject"
          value={this.state.subject}
          onChange={this.handleSelectChange}
          style={{width: '20%'}}
        >
          <MenuItem value={"Hostel"} primaryText="Hostel" />
          <MenuItem value={"Academics"} primaryText="Academics" />
          <MenuItem value={"Cab Share"} primaryText="Cab Share" />
          <MenuItem value={"Others"} primaryText="Others" />
        </SelectField>
        <TextField
          floatingLabelText="Subject"
          style={{display: this.state.subject === 'Others' ? '' : 'none', marginLeft: 20}}
          onChange={this.handleOtherSubjectChange}
        />
      </div>
        <p>Description</p>
        <textarea placeholder="" rows={15} onChange={this.handleDescChange} value={this.state.desc}>
          
        </textarea>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  const {openSideNav, isMobile} = state.toggler
  const {user, verified} = state.authentication
  return {
    user,
    openSideNav,
    verified,
    isMobile
  }
}

export default connect(mapStateToProps)(ComplaintsComponent)