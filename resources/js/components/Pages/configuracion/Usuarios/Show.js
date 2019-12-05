import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Biblioteca.css";

export default class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresas: JSON.parse(localStorage.getItem("empresas")),
            idUsuario: this.props.match.params.id,
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
            eventos: [],
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
        
    }

    componentDidMount() {
        axios.get("api/usuarios/infoEdit/"+this.state.idUsuario,{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res => {
            let r = res.data.data;
            let usuario = r.usuario;
            if (usuario.Activo){
                this.setState({estado:"5b7e4c3b589bd25309f878ca"})
            }else{
                this.setState({estado:"5b7e4c90eaf5685309c47a4f"})
            }
            this.setState({
                empresas:r.empresas,
                estados:r.estados,
                paises:r.paises,
                eventos:r.eventos,
                tiposDocumentos:r.tipodocumentos,
                roles:r.roles,
                nombre:usuario.Nombre,
                correo:usuario.Correo,
                rol:usuario.Rol_id,
                pais:usuario.Pais_id,
                empresa:usuario.Empresa_id,
                evento:usuario.Evento_id,
                nombre:usuario.Nombre,
                apellido:usuario.Apellido,
                documento:usuario.Documento,
                tipoDocumento:usuario.TipoDocumento_id,
                telefono:usuario.Telefono,
                isLoading: false
            });
        });
    }

     

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Menu usuario={this.state.user} />
                    <Header  usuario={this.state.user} history={this.props.history}    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-user-cog page-header-heading-icon" />
                                            &nbsp; Mostrar Usuario
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
                                        Cargando
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
                    <Header  usuario={this.state.user} history={this.props.history}    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-user-cog page-header-heading-icon" />
                                            &nbsp; 
                                            <Link to="/usuarios">
                                            Usuarios{" "}
                                            </Link>
                                            / Mostrar Usuario
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

                            <form id="form-add-usuario" className="form-change-password form" encType="multipart/form-data" >
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Tipo Documento</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="tipo-documento" name="tipoDocumento" value={this.state.tipoDocumento} disabled>
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
                                                <input type="text" className="form-control form-control-sm" id="documento" name="documento" placeholder="Ingrese el documento" value={this.state.documento} disabled/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Nombre</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="nombre" name="nombre" placeholder="Ingrese el nombre" value={this.state.nombre} disabled />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Apellido</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="apellido" name="apellido" placeholder="Ingrese el apellido" value={this.state.apellido} disabled />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Correo</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="correo" name="correo" placeholder="Ingrese el correo" value={this.state.correo} disabled/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Teléfono</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="telefono" name="telefono" placeholder="Ingrese el telefono" value={this.state.telefono} disable/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">País</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="pais" name="pais" value={this.state.pais} disabled>
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
                                                <select className="form-control form-control-sm" id="rol" name="rol" value={this.state.rol} disabled>
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
                                                <select className="form-control form-control-sm" id="empresa" name="empresa" value={this.state.empresa} disabled>
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
                                                <select className="form-control form-control-sm" id="evento" name="evento" value={this.state.evento} disabled>
                                                    <option value="">Seleccione</option>
                                                    {this.state.eventos.map(
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
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Estado</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="estatus" name="estado" value={this.state.estado} disabled>
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


                                    </div>

                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-4">
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
