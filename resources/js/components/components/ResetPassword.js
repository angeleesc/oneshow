import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import swal from "sweetalert2";
import logoOneShow from '../../../../public/images/logo-oneshow.png';

export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            token: props.token,
            tokenvalido: props.tokenvalido,
            correo: '',
            password: '',
            passwordConfirmacion: '',
            isLoading: false
        };

        this.handleReset = this.handleReset.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleReset(e){

        let self = this;

        self.setState({
            isLoading: true
        });

        let urlLogin = this.state.url+'/';
        let correo = this.state.correo;
        let password = this.state.password;
        let passwordConfirmacion = this.state.passwordConfirmacion;
        let token = this.state.token;

        e.preventDefault();

        axios.post('/ajax-reset-password', {correo, password, passwordConfirmacion, token})
            .then(res => {

                let r = res.data;

                if(r.code === 200){

                    self.setState({
                        correo: '',
                        password: '',
                        passwordConfirmacion: '',
                        isLoading: false
                    });

                    swal.fire({
                        title: '<i class="fa fa-check-circle"></i>',
                        text: r.msj,
                        showCancelButton: false,
                        confirmButtonColor: '#343a40',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.value) {

                            window.location.href = urlLogin;
                        }
                    });


                }else if(r.code === 600){

                    self.setState({
                        isLoading: false
                    });

                    swal.fire({
                        title: '<i class="fas fa-exclamation-circle"></i>',
                        text: r.msj,
                        confirmButtonColor: '#343a40',
                        confirmButtonText: 'Ok'
                    });

                }

            }).catch(function (error){

                if (error.response.status == 422){

                    self.setState({
                        isLoading: false
                    });

                    swal.fire({
                        title: '<i class="fas fa-exclamation-circle"></i>',
                        text: error.response.data,
                        confirmButtonColor: '#343a40',
                        confirmButtonText: 'Ok'
                    });

                }

            });
    }

    render() {

        let correo      = this.state.correo;
        let password    = this.state.password;
        let passwordConfirmacion = this.state.passwordConfirmacion;
        let url         = this.state.url;
        let tokenValido = this.state.tokenvalido;

        let urlLogin    = url + '/';

        return (

            <div className="container" >
                <div className="absolute-center">

                    <form method="POST" onSubmit={this.handleReset} className="form-login form">

                        { tokenValido ?

                            <div>

                                <div className="text-center mb-4">
                                    <img src={logoOneShow} className="img-fluid logo-login" alt="ONE Show"/>
                                </div>

                                <h4 className="text-center mb-4">Cambiar Contraseña</h4>

                                <div className="form-group">
                                    <input type="text" className="form-control input-lg" id="correo" name="correo" value={correo} onChange={this.handleChange} placeholder="Ingresa tu correo" />
                                </div>

                                <div className="form-group">
                                    <input type="password" className="form-control input-lg" id="password" name="password" value={password} onChange={this.handleChange} placeholder="Ingresa tu nueva contraseña" />
                                </div>

                                <div className="form-group">
                                    <input type="password" className="form-control input-lg" id="passwordConfirmacion" name="passwordConfirmacion" value={passwordConfirmacion} onChange={this.handleChange} placeholder="Confirma tu contraseña" />
                                </div>

                                <button type="submit" className="btn btn-block btn-red-one">
                                    { this.state.isLoading ? <i className="fas fa-sync fa-spin"></i> : '' }
                                    &nbsp;&nbsp; Enviar
                                </button>

                            </div>

                            :

                            <div className="alert alert-faded-blue" role="alert">
                                <i className="fas fa-info-circle"></i>&nbsp;El link que intenta usar es invalido ó simplemente expiro. Intente recuperar su contraseña nuevamente.
                            </div>


                        }

                        <ul className="login-bottom-links">
                            <li><a href={urlLogin}>Volver al login</a></li>
                        </ul>


                    </form>

                </div>
            </div>


        );
    }
}

if (document.getElementById('reset-password')) {

    const element = document.getElementById('reset-password');

    const props = Object.assign({}, element.dataset);

    ReactDOM.render(<ResetPassword {...props} />, element);
}
