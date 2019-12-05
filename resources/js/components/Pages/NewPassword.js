import React from 'react';
import axios from 'axios';
import classnames from 'classnames';
import { FontAwesomeIcon } from  '@fortawesome/react-fontawesome';
import Alert from './../atoms/Alert';

class NewPassword extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      password: '',
      loading: false,
      tokenVerifyed: false,
      passwordConfirmation: '',
      message: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    const { token } = this.props.match.params;

    axios.get(`/api/user/recover/password/${token}`)
      .then(res => this.setState({ 
        tokenVerifyed: true
      }))
    .catch(err => this.props.history.replace('/'));
  }

  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit (e) {
    e.preventDefault();
    const { token } = this.props.match.params;

    this.setState({ loading: true, message: '' });

    axios.post(`/api/user/recover/password/${token}`, { 
      password: this.state.password,
      password_confirmation: this.state.passwordConfirmation
    })
    .then(res => this.props.history.replace('/', { 
      message: 'La contraseña fue actualizada correctamente' 
    }))
    .catch(err => this.setState({
      loading: false,
      message: err.response.data.message
    }, () => console.log(err.response)))
  }

  render () {
    const { password, passwordConfirmation, tokenVerifyed, loading, message } = this.state;

    if (!tokenVerifyed) {
      return (
        <div className="container">
          <div 
            className="row justify-content-md-center align-items-center text-center"
            style={{ height: '100vh' }}
          >
            <FontAwesomeIcon icon="sync" color="#fff" size="lg" spin/>
          </div>
        </div>
      );
    }

    const buttonStyle = classnames('btn', 'btn-block', 'btn-red-one', {
      disabled: loading
    });

    return (
      <div className="container">
        <div 
          className="row justify-content-md-center align-items-center"
          style={{ height: '100vh' }}
        >
          <div className="col-md-6 p-5 bg-dark rounded">
            <div className="text-center">
              <img src="/images/logo-oneshow.png" className="img-fluid logo-login mb-3" alt="ONE Show" />
            </div>
            {message !== '' &&
              <Alert 
                type="danger" 
                handleClose={(e) => this.setState({ message: '' })}
              >
                {message}
              </Alert>
            }
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={password}
                  onChange={this.handleChange}
                  className="form-control" 
                  placeholder="Min 6 caractéres"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password-confirmation">Ingrese la contraseña nuevamente</label>
                <input 
                  type="password" 
                  id="password-confirmation" 
                  name="passwordConfirmation" 
                  value={passwordConfirmation}
                  onChange={this.handleChange}
                  className="form-control" 
                  placeholder="Min 6 caractéres"
                />
              </div>
              <button 
                type="submit"
                className={buttonStyle}
                disabled={loading}
              >
                {loading ? (
                  <FontAwesomeIcon icon="sync" color="#fff" spin />
                ) : (
                  'Cambiar contraseña'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default NewPassword;