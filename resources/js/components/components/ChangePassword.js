import React, { Component } from 'react';
import axios from 'axios';
import Alert from './../atoms/Alert';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      message: '',
      url: props.url,
      oldPassword: '',
      password: '',
      passwordConf: '',
      isLoading: false,
      changePassword: props.changepassword,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit (e) {
    e.preventDefault();
    
    this.setState({
      isLoading: true,
      message: '',
    });

    const { oldPassword, password, passwordConf } = this.state;

    axios.post('/api/usuarios/change/password', { 
      password, 
      previous_password: oldPassword, 
      password_confirmation: passwordConf
    }, {
      headers: {
        Authorization: this.props.apiToken
      }
    }).then(res => {
      this.setState({
        password: '',
        oldPassword: '',
        passwordConf: '',
        type: 'success',
        isLoading: false,
        message: 'Contraseña actualizada correctamente',
      })
    }).catch(err => {
      this.setState({
        isLoading: false,
        message: err.response.data.message,
        type: 'danger',
      })
    });
  }

  render() {
    const { oldPassword, password, passwordConf, isLoading } = this.state;

    return (
      <div className="container">
        <div className="row justify-content-md-center align-items-center" style={{ height: '100vh' }}>
          <div id="cp" className="col-md-6 px-5 py-4 rounded bg-dark">
            <form onSubmit={this.handleSubmit} className="form-change-password form">
              {this.state.message !== '' &&
                <div className="mb-3">
                  <Alert 
                    type={this.state.type} 
                    handleClose={() => this.setState({ message: '' })}
                  >
                    {this.state.message}
                  </Alert>
                </div>
              }
              <div className="form-group">
                <label>Contraseña actual</label>
                <input 
                  required
                  type="password" 
                  id="oldPassword" 
                  name="oldPassword" 
                  value={oldPassword} 
                  className="form-control" 
                  onChange={this.handleChange} 
                  placeholder="Ingrese su contraseña actual" 
                />
              </div>
              <div className="form-group">
                <label>Contraseña nueva</label>
                <input 
                  required
                  type="password" 
                  id="password" 
                  name="password" 
                  value={password} 
                  className="form-control" 
                  onChange={this.handleChange} 
                  placeholder="Ingrese la contraseña nueva" 
                />
              </div>
              <div className="form-group">
                <label>Repita su nueva contraseña</label>
                <input 
                  required
                  type="password" 
                  id="passwordConf" 
                  name="passwordConf" 
                  value={passwordConf} 
                  className="form-control" 
                  onChange={this.handleChange} 
                  placeholder="Repita su nueva contraseña" 
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-sm btn-block btn-red-one"
              >
                {isLoading ? (
                  <FontAwesomeIcon icon="sync" color="#fff" spin/>
                  ) : (
                    'Cambiar contraseña'
                  )}
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-block btn-link mt-2"
                onClick={e => this.props.history.goBack()}
              >
                Regresar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  apiToken: state.auth.apiToken
});

export default connect(mapStateToProps)(ChangePassword);