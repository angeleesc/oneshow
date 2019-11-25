import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import swal from "sweetalert2";


export default class EmpresaTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            passwordnew: '',
            passwordold: '',
            passwordrepeat: '',
            isLoading: false
        };

        this.actionChangePassword = this.actionChangePassword.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    actionChangePassword(e){

        let self = this;

        self.setState({
            isLoading: true
        });

        let passwordold    = this.state.passwordold;
        let passwordnew    = this.state.passwordnew;
        let passwordrepeat = this.state.passwordrepeat;

        e.preventDefault();

        axios.post('/ajax-change-password', {passwordold, passwordnew, passwordrepeat})
            .then(res => {

                let r = res.data;

                if(r.code === 200){

                    self.setState({
                        passwordnew: '',
                        passwordold: '',
                        passwordrepeat: '',
                        changePassword: false,
                        isLoading: false
                    });

                    swal.fire({
                        title: '<i class="fa fa-check-circle"></i>',
                        text: r.msj,
                        showCancelButton: false,
                        confirmButtonColor: '#343a40',
                        confirmButtonText: 'Ok',
                        target: document.getElementById('cp')
                    }).then((result) => {
                        if (result.value) {

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
                        confirmButtonText: 'Ok',
                        target: document.getElementById('cp')

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
                        confirmButtonText: 'Ok',
                        target: document.getElementById('cp')
                    });

                }

            });
    }

    render() {

        let url = this.state.url;
        let urlAdd = url + '/empresa-add';
        let passwordold    = this.state.passwordold;
        let passwordnew    = this.state.passwordnew;
        let passwordrepeat = this.state.passwordrepeat;
        let changePassword = this.state.changePassword;

        return (


            <div id="sw" className="col-lg-12">

                <div className="widget widget-default">

                    <div className="widget-body">

                        <a href={urlAdd}><button className="btn btn-sm btn-dark mb-4">Agregar Empresa</button></a>


                        <table className="table table-hover table-condensed table-dark-theme table-responsive-sm">
                            <thead>
                            <tr>
                                <th>NOMBRE</th>
                                <th>CORREO</th>
                                <th>TELÉFONO</th>
                                <th>PAÍS</th>
                                <th>ESTADO</th>
                                <th className="text-center">ACCIONES</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>No hay data</th>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>

            </div>


        );
    }
}

if (document.getElementById('empresa-table')) {

    const element = document.getElementById('empresa-table');

    const props = Object.assign({}, element.dataset);

    ReactDOM.render(<EmpresaTable {...props} />, element);
}
