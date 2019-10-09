import React, { Component } from "react";
import ReactDOM from "react-dom";
import Alert from './../atoms/Alert';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from "../../../../public/images/logo-oneshow.png";
import axios from "axios";

export default class RecuperarPassword extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        message: '',
        error: false,
        isLoading: false
      };

      this.handleRecover = this.handleRecover.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }

    handleRecover (e) {
      e.preventDefault();

      this.setState({
        message: '',
        error: false,
        isLoading: true
      });

      const { email } = this.state;

      axios.post("/api/user/recover/password", { email }).then(res => {
        this.setState({
          email: '',
          error: false,
          isLoading: false,
          message: res.data.message,
        })
      })
      .catch(error => {
        this.setState({
          error: true,
          isLoading: false,
          message: error.response.data.message,
        });
      });
    }

    render() {
      const { email, message, error, isLoading } = this.state;
      const buttonStyle = classnames('btn', 'btn-block', 'btn-red-one', {
        disabled: isLoading
      });

      return (
        <div className="container">
          <div className="absolute-center">
            <form
              method="POST"
              onSubmit={this.handleRecover}
              className="form-login form"
            >
              <div className="text-center mb-4">
                <img src={logo} className="img-fluid logo-login" alt="ONE Show" />
              </div>
              <h4 className="text-center mb-4">
                  Recuperar Contraseña
              </h4>
              {message !== '' &&
                <Alert 
                  type={error ? 'danger':'success'} 
                  handleClose={() => this.setState({ error: false, message: '' })}
                >
                  {message}
                </Alert>
              }
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  placeholder="Ingresa tu correo"
                  className="form-control input-lg"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={buttonStyle}
              >
                {isLoading ? (
                  <FontAwesomeIcon icon="sync" color="#fff" spin />
                ) : (
                  'Enviar'
                )}
              </button>
              <ul className="login-bottom-links">
                <li>
                  <Link to="/">Volver al login</Link>
                </li>
              </ul>
            </form>
          </div>
        </div>
      );
    }
}

if (document.getElementById("recuperar-password")) {
    const element = document.getElementById("recuperar-password");

    const props = Object.assign({}, element.dataset);

    ReactDOM.render(<RecuperarPassword {...props} />, element);
}
