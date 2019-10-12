import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";

import "./css/invitacion.css";
export default class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            archivos: [],
            idEvento: props.location.state.idEvento,
            empresa: "",
            tipo:"",
            opcion: "Invitacion",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("id-evento", this.state.idEvento);
        formData.append("tipo", this.state.tipo);
        formData.append("archivoimg", $('#form-add input[name=archivoimg]')[0].files[0] === undefined ? '' : $('#form-add input[name=archivoimg]')[0].files[0] );
        formData.append("archivopdf", $('#form-add input[name=archivopdf]')[0].files[0] === undefined ? '' : $('#form-add input[name=archivopdf]')[0].files[0] );
        $('button#save-file').prepend('<i class="fa fa-spinner fa-spin"></i> ');
        axios.post("api/invitaciones/file/add",formData,{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
            $('button#save-file').find('i.fa').remove();
            if(res.data.code === 200) {
                Swal.fire({
                    text: "Archivos agregados exitosamente",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#343a40",
                    confirmButtonText: "OK",
                    target: document.getElementById('sweet')
                }).then((result) => {
                    if (result.value) {
                        window.scrollTo(0, 0);
                        this.props.history.push("/invitaciones/show/"+this.state.idEvento);
                    }
                });
            }else if(res.data.code === 500){
                sweetalert('Error al agregar archivo. Consulte al Administrador.', 'error', 'sweet');
            }
        }).catch(error => {
            $('button#save-file').find('i.fa').remove();
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
                                            <Link to="/invitacion">
                                                Invitación
                                            </Link>{" "}
                                            / Agregar Archivo
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
                                            <Link to="/invitacion">
                                                Invitación
                                            </Link>{" "}
                                            / Agregar Archivo
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

                <form id="form-add" className="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">
                            <div className="alert alert-primary mb-4" role="alert">
                                <i className="fas fa-info-circle"></i>&nbsp;
                                La imagén de la invitación a subir debe tener una resolución de 
                                <strong>1200x800</strong>
                                , en formato 
                                <strong>.jpg</strong>
                                 o 
                                 <strong>.png</strong>
                                  y un peso aproximado entre 
                                  <strong>10KB</strong>
                                   y <strong>10MB</strong>.
                                <br></br><i className="fas fa-info-circle"></i>&nbsp;&nbsp;El Pdf  debe estar en formato <strong>.pdf</strong> y un peso aproximado entre <strong>10KB</strong> y <strong>10MB</strong>.

                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Posición Invitación</label>
                                <div className="col-sm-5">
                                    <select className="form-control form-control-sm" id="tipo" name="tipo" value={this.state.tipo} onChange={this.handleChange} required>
                                        <option value="">Seleccione</option>
                                        <option value="h" >Horizontal</option>
                                        <option value="v" >Vertical</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Invitación (Imagen)</label>
                                <div className="col-sm-5">
                                    <input 
                                      type="file" 
                                      id="archivoimg" 
                                      name="archivoimg" 
                                      className="form-control-file" 
                                      required
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Invitación (PDF)</label>
                                <div className="col-sm-5">
                                    <input 
                                      type="file" 
                                      className="form-control-file" 
                                      id="archivopdf" 
                                      name="archivopdf" 
                                      required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4">
                            <button type="submit" id="save-file" className="btn btn-sm btn-dark mr-2">Guardar</button>
                            <Link to={"/invitacion/show/"+this.state.idEvento}><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
                        </div>
                    </div>
                </form>
                            {/**esto de abajo es de php, es el texto que cambia con el menu */}
                            <footer className="content-wrapper-footer">
                                <span>{this.state.footer}</span>
                            </footer>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
