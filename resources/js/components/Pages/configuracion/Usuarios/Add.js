import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Biblioteca.css";

export default class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresas: JSON.parse(localStorage.getItem("empresas")),
            usuarios: [],
            tiposDocumentos:[],
            roles:[],
            paises:[],
            estados:[],
            tipoDocumento:"",
            documento:"",
            nombre:"",
            apellido:"",
            estado:"",
            pais:"",
            estado:"",
            correo:"",
            telefono:"",
            rol:"",
            opcion: "Eventos",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeEmpresa = this.handleChangeEmpresa.bind(this);
        
    }

    componentDidMount() {
        axios.get("api/usuarios/selects").then(res => {
            console.log(res)
            let r = res.data.data;
            this.setState({
                empresas:r.empresas,
                estados:r.estados,
                paises:r.paises,
                estados:r.estados,
                tiposDocumentos:r.tipodocumentos,
                roles:r.roles,
                isLoading: false
            });
        });
    }

    handleChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        console.log(value)
        const name = target.name;
        this.setState({
          [name]: value
        })

    }

    handleChangeEmpresa(event){
        console.log("entre a este beta")
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        console.log(value)
        const name = target.name;
        this.setState({
          [name]: value
        })
        var emp = value;

        if(emp){
            console.log("ahora aqui")
            axios.get("api/empresas/eventos/"+emp).then(res=>{
                let r = res.data;
                $('#evento').empty();

                    var select = '<option value="">Seleccione</option>';

                    r.map((e ,index) =>{
                        console.log(value)
                        select +='<option value="'+e._id+'" key="'+index+'">'+e.Nombre+'</option>';
                    });

                    $("#evento").html(select);
            })
        }else{
            $('#evento').empty();
        }
    }


    handleSubmit(e){
        e.preventDefault();
        let formData = new FormData();

        formData.append("tipo-documento", this.state.tipoDocumento);
        formData.append("documento", this.state.documento);
        formData.append("nombre", this.state.nombre);
        formData.append("apellido", this.state.apellido);
        formData.append("correo", this.state.correo);
        formData.append("telefono", this.state.telefono);
        formData.append("pais", this.state.pais);
        formData.append("rol", this.state.rol);
        formData.append("empresa", this.state.empresa);
        formData.append("evento", this.state.evento);
        formData.append("estatus", this.state.estado);
        $('button#save-usuario').prepend('<i class="fa fa-spinner fa-spin"></i> ');
        axios.post("/api/usuarios/add",formData).then(res=>{
            $('button#save-usuario').find('i.fa').remove();

                if(res.data.code === 200) {

                    Swal.fire({
                        text: "Usuario agregado exitosamente",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#343a40",
                        confirmButtonText: "OK",
                        target: document.getElementById('sweet')
                    }).then((result) => {

                        if (result.value) {
                            window.scrollTo(0, 0);
                        this.props.history.push("/usuarios");
                        }

                    });

                }else if(res.data.code === 500){
                    sweetalert('Error al agregar usuario. Consulte al Administrador.', 'error', 'sweet');
                }
        }).catch(error => {
            $('button#save-usuario').find('i.fa').remove();
            sweetalert(error.response.data, 'error', 'sweet');
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Menu usuario={this.state.user} />
                    <Header usuario={this.state.user} />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-calendar-week page-header-heading-icon" />
                                            &nbsp; Agregar Usuario
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div id="sweet" className="container-fluid">
                            <div className="row">
                                <div className="offset-6">
                                    <h3>
                                        <i className="fa fa-spinner fa-spin" />{" "}
                                        Cagargando
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Menu usuario={this.state.user} />
                    <Header usuario={this.state.user} />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-calendar-week page-header-heading-icon" />
                                            &nbsp; 
                                            <Link to="/usuarios">
                                            Usuarios{" "}
                                            </Link>
                                            / Agregar Usuario
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="pills-datos-tab" data-toggle="pill" href="#pills-datos" role="tab" aria-controls="pills-datos" aria-selected="true">Datos</a>
                                </li>

                            </ul>

                            <hr className="line-gray"/>

                            <form id="form-add-usuario" className="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Tipo Documento</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="tipo-documento" name="tipoDocumento" onChange={this.handleChange} value={this.state.tipoDocumento}>
                                                    <option value="">Seleccione</option>
                                                    {this.state.tiposDocumentos.map(
                                                        (e, index) => {
                                                            return (
                                                                <option value={e._id} key={index}>{e.TipoDocumento}</option>
                                                            )
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>


                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Documento</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="documento" name="documento" placeholder="Ingrese el documento" value={this.state.documento} onChange={this.handleChange}/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Nombre</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="nombre" name="nombre" placeholder="Ingrese el nombre" value={this.state.nombre} onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Apellido</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="apellido" name="apellido" placeholder="Ingrese el apellido" value={this.state.apellido} onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Correo</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="correo" name="correo" placeholder="Ingrese el correo" value={this.state.correo} onChange={this.handleChange}/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Teléfono</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="telefono" name="telefono" placeholder="Ingrese el telefono" value={this.state.telefono} onChange={this.handleChange}/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">País</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="pais" name="pais" value={this.state.pais} onChange={this.handleChange}>
                                                    <option value="">Seleccione</option>
                                                    {this.state.paises.map(
                                                        (e, index) => {
                                                            return (
                                                                <option value={e._id} key={index}>{e.Nombre}</option>
                                                            )
                                                        }
                                                    )}

                                                </select>
                                            </div>
                                        </div>


                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Rol</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="rol" name="rol" value={this.state.rol} onChange={this.handleChange}>
                                                    <option value="">Seleccione</option>
                                                    {this.state.roles.map(
                                                        (e, index) => {
                                                            return (
                                                                <option value={e._id} key={index}>{e.Nombre}</option>
                                                            )
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>


                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Empresa</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="empresa" name="empresa" value={this.state.empresa} onChange={this.handleChangeEmpresa}>
                                                    <option value="">Seleccione</option>
                                                    {this.state.empresas.map(
                                                        (e, index) => {
                                                            return (
                                                                <option value={e._id} key={index}>{e.Nombre}</option>
                                                            )
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Evento</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="evento" name="evento" value={this.state.evento} onChange={this.handleChange}>
                                                    <option value="">Seleccione</option>
                                                </select>
                                            </div>
                                        </div>


                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Estado</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="estatus" name="estado" value={this.state.estado} onChange={this.handleChange}>
                                                    <option value="">Seleccione</option>
                                                    {this.state.estados.map(
                                                        (e, index) => {
                                                            return (
                                                                <option value={e._id} key={index}>{e.Nombre}</option>
                                                            )
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="alert alert-primary" role="alert">
                                            El password por defecto es: <b>Numero de documento</b>
                                        </div>


                                    </div>

                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-4">
                                        <button type="submit" id="save-usuario" className="btn btn-sm btn-dark mr-2">Guardar</button>

                                        <Link to="/usuarios"><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
