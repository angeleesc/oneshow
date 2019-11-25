import React from 'react';
import { connect } from 'react-redux';
import SweetAlert from 'sweetalert2-react';
import { hideAlert } from './../../redux/actions/alert'

class Alert extends React.Component {
  
  render () {
    const { show, type, title, text } = this.props.alert;

    return (
      <SweetAlert
        show={show}
        type={type}
        title={title}
        text={text}
        onConfirm={() => this.props.hideAlert()}
      />
    );
  }
}

const mapStateToProps = state => ({
  alert: state.alert
});

const mapDispatchToProps = dispatch => ({
  hideAlert: () => dispatch(hideAlert())
});

export default connect(mapStateToProps, mapDispatchToProps)(Alert);