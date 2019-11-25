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
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeEmpresa = this.handleChangeEmpresa.bind(this);
        
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

    handleChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        
        const name = target.name;
        this.setState({
          [name]: value
        })

    }

    handleChangeEmpresa(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        })
        var emp = value;

        if(emp){
            axios.get("api/empresas/eventos/"+emp,{
                headers: {
                    Authorization: this.state.api_token
                }
            }).then(res=>{
                let r = res.data;
                $('#evento').empty();

                    var select = '<option value="">Seleccione</option>';

                    r.map((e ,index) =>{
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
        formData.append("usuario-id",this.state.idUsuario)
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
        axios.post("/api/usuarios/edit",formData,{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
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
                    sweetalert('Error al Editar usuario. Consulte al Administrador.', 'error', 'sweet');
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
                    <Header  usuario={this.state.user} history={this.props.history}    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-user-cog page-header-heading-icon" />
                                            &nbsp; Editar Usuario
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
                                            / Editar Usuario
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
