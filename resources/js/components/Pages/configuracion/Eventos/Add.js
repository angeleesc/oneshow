import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Biblioteca.css";

export default class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            paises: JSON.parse(localStorage.getItem("paises")),
            estados: JSON.parse(localStorage.getItem("estados")),
            menuAppInvitados:[],
            idEmpresa: this.props.match.params.id,
            nombre:"",
            fecha:"",
            hora:"",
            licencias:"",
            paisSeleccionado:"",
            latitud:"",
            longitud:"",
            ubicacion:"",
            estado:"",
            app:"",
            menuAppSeleccionados: [],
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogo = this.handleLogo.bind(this);
        this.handleChangeMulti = this.handleChangeMulti.bind(this);
    }

    componentDidMount() {
        axios
            .get("api/eventos/menus")
            .then(res => {
                console.log(res);
                this.setState({
                    menuAppInvitados: res.data.data,
                    isLoading: false
                });
            });
    }

    handleChangeMulti(e){
        
        this.setState({menuAppSeleccionados: [...e.target.selectedOptions].map(o => o.value)});
        console.log(this.state.menuAppSeleccionados);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        console.log(value)
        const name = target.name;
        this.setState({
          [name]: value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        let formData = new FormData();
        let s = this.state

        let ubicacion = $('input[name=ubicacion]:checked', '#form-add-evento').val();
        console.log(s.ubicacion)
        console.log(ubicacion)

        formData.append("id-emp", s.idEmpresa);
        formData.append("nombre", s.nombre);
        formData.append("fecha", s.fecha);
        formData.append("hora", s.hora);
        formData.append("licencias", s.licencias);
        formData.append("pais", s.paisSeleccionado);
        formData.append("latitud", s.latitud);
        formData.append("longitud", s.longitud);
        formData.append("ubicacion",  ubicacion === undefined ? '' : ubicacion);
        formData.append("app", s.app);
        formData.append("estatus", s.estado);
        formData.append("logo", $('#form-add-evento input[name=logo]')[0].files[0] === undefined ? '' : $('#form-add-evento input[name=logo]')[0].files[0] );
        formData.append("x", $('#add-x').val());
        formData.append("y", $('#add-y').val());
        formData.append("w", $('#add-w').val());
        formData.append("h", $('#add-h').val());

        var menu = $('#menuapp').multipleSelect('getSelects');

        formData.append("menuapp", menu);

        $('button#save-evento').prepend('<i className="fa fa-spinner fa-spin"></i> ');
        axios.post("api/eventos/add",formData).then(res=>{
            $('button#save-evento').find('i.fa').remove();
            console.log(res);
            if (res.data.code == 200){
                console.log("estoy aca")
                sweetalert(
                    "Evento agregado correctamente",
                    "success",
                    "sweet"
                );
                setTimeout(()=>{
                    this.props.history.push("/empresa/eventos/"+s.idEmpresa);
                },2000);
        
            }else{

            }
        });
    }

    handleLogo(){
        
        
            let input = ($('#logo'))[0];
            var $image = $('#preview-add-emp');
            var oFReader = new FileReader();
    
            oFReader.readAsDataURL(input.files[0]);
            oFReader.onload = function (oFREvent) {
    
                // Destroy the old cropper instance
                $image.cropper('destroy');
    
                // Replace url
                $image.attr('src', this.result);
    
                // Start cropper
                $image.cropper({
                    viewMode: 1,
                    minContainerWidth: 200,
                    minContainerHeight: 200,
                    autoCropArea: 1,
                    crop: function(event) {
    
                        $('#add-x').val(event.detail.x);
                        $('#add-y').val(event.detail.y);
                        $('#add-w').val(event.detail.width);
                        $('#add-h').val(event.detail.height);
                    }
                });
    
    
            };
        
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
                                            &nbsp;
                                            <Link to="/empresas">
                                                Empresa
                                            </Link>{" "}
                                            /{" "}
                                            <Link
                                                to={`/empresa/eventos/${
                                                    this.state.idEmpresa
                                                }`}
                                            >
                                                / Eventos
                                            </Link>{" "}
                                            / Agregar Evento
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <h3>
                                <i className="fa fa-spinner fa-spin" /> Cargando
                                espere
                            </h3>
                        </div>
                    </div>
                </div>
            );
        }else{
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
                                        <Link to="/empresas">
                                            Empresa
                                        </Link>{" "}
                                        {" "}
                                        <Link
                                            to={`/empresa/eventos/${
                                                this.state.idEmpresa
                                            }`}
                                        >
                                            / Eventos
                                        </Link>{" "}
                                        / Agregar Evento
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
                        <li className="nav-item">
                            <a className="nav-link" id="pills-logo-tab" data-toggle="pill" href="#pills-logo" role="tab" aria-controls="pills-logo" aria-selected="false">Logo</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="pills-invitados-tab" data-toggle="pill" href="#pills-invitados" role="tab" aria-controls="pills-invitados" aria-selected="false">APP Invitados</a>
                        </li>
                    </ul>

                <hr className="line-gray"/>

                <form id="form-add-evento" className="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Nombre Evento</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="nombre" name="nombre" placeholder="Ingrese el nombre del evento" value={this.state.nombre} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Fecha</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="fecha" name="fecha" placeholder="Ingrese la fecha del evento"  value={this.state.fecha} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Hora</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="hora" name="hora"  placeholder="Ingrese la hora del evento"  value={this.state.hora} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Licencias</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="licencias" name="licencias"  placeholder="Ingrese la cantidad de licencias del evento" value={this.state.licencias} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">País</label>
                                <div className="col-sm-4">
                                <select className="form-control form-control-sm" id="pais" name="paisSeleccionado" value={this.state.paisSeleccionado} onChange={this.handleChange}>
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
                                <label className="col-sm-2 col-form-label col-form-label-sm">Latitud</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="latitud" name="latitud"  placeholder="Ingrese la latitud"  value={this.state.latitud} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Longitud</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="longitud" name="longitud"  placeholder="Ingrese la longitud"  value={this.state.longitud} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Ubicación</label>
                                <div className="col-sm-4">

                                    <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" value="g" id="customRadioInline1" name="ubicacion" className="custom-control-input" checked={this.state.ubicacion} onChange={this.handleChange}/>
                                        <label className="custom-control-label" htmlFor="customRadioInline1">GPS</label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                        <input value="m" type="radio"  id="customRadioInline2" name="ubicacion" className="custom-control-input" checked={this.state.ubicacion} onChange={this.handleChange}/>
                                        <label className="custom-control-label" htmlFor="customRadioInline2">Manual</label>
                                    </div>

                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm" >App &nbsp;</label>
                                <div className="col-sm-4">
                                    <select className="form-control form-control-sm" id="app" name="app" value={this.state.app} onChange={this.handleChange} >
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

                        </div>


                        <div className="tab-pane fade" id="pills-logo" role="tabpanel" aria-labelledby="pills-logo-tab">

                            <div className="alert alert-primary mb-4" role="alert">
                                <i className="fas fa-info-circle"></i>&nbsp;
                                La imagén a subir debe tener una resolución de <strong>200x200</strong>, en formato <strong>.jpg</strong> o <strong>.png</strong> y un peso aproximado entre <strong>10KB</strong> y <strong>5MB</strong>.
                            </div>

                            <div className="text-center btn-upload-image mb-5">
                                <span className="btn btn-dark btn-file">Subir Imagen <input type="file" id="logo" name="logo" value={this.state.logo} onChange={this.handleLogo}/></span>
                            </div>

                            <div id="div-add-emp-img" className="text-center area-cropper">
                                <img id="preview-add-emp" src="" className="rounded img-example preview-add" alt="" />
                            </div>

                            <input type="hidden" id="add-x"/>
                            <input type="hidden" id="add-y"/>
                            <input type="hidden" id="add-w"/>
                            <input type="hidden" id="add-h"/>

                        </div>

                        <div className="tab-pane fade" id="pills-invitados" role="tabpanel" aria-labelledby="pills-invitados-tab">

                            <div className="alert alert-primary mb-4" role="alert">
                                <i className="fas fa-info-circle"></i>&nbsp;
                                Seleccione los menús que estaran habilitado en la App para el evento.
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Menús</label>
                                <div className="col-sm-4">
                                    <select className="form-control form-control-sm" id="menuapp" name="menuAppSeleccionados" value={this.state.menuAppSeleccionados} onChange={this.handleChangeMulti} multiple="multiple">
                                    {this.state.menuAppInvitados.map(
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
                            <button type="submit" id="save-evento" className="btn btn-sm btn-dark mr-2">Guardar</button>

                            <Link to={`/empresa/eventos/${
                                                    this.state.idEmpresa
                                                }`}><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
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
