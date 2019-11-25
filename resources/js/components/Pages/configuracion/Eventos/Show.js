import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";
import $ from "jquery"

import "../../css/configuracion/Biblioteca.css";
import "./css/Eventos.css";

export default class Show extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            paises: [],
            estados: [],
            menuAppInvitados: [],
            idEvento: this.props.match.params.id,
            idEmpresa: "",
            nombre: "",
            anfitrion1: "",
            anfitrion2: "",
            apellido1: "",
            apellido2: "",
            vestimenta: "",
            dir1: "",
            dir2: "",
            fecha: "",
            hora: "",
            licencias: "",
            paisSeleccionado: "",
            latitud: "",
            longitud: "",
            ubicacion: "",
            estado: "",
            app: "",
            menuAppSeleccionados: [],
            infoEvento: "",
            logo: "",
            fotoAnfitrion1: "",
            fotoAnfitrion2: "",
            fotoAnfitrion3: "",
            url: 'http://127.0.0.1:8001',
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };

    }

    componentDidMount() {
        axios
            .get("api/eventos/menus", {
                headers: {
                    Authorization: this.state.api_token
                }
            })
            .then(res => {
                this.setState({
                    menuAppInvitados: res.data.data
                });
                axios.get("api/eventos/one/" + this.state.idEvento, {
                    headers: {
                        Authorization: this.state.api_token
                    }
                }).then(res => {
                    console.log(res)
                    this.setState({
                        infoEvento: res.data.evento,
                        nombre: res.data.evento.evento.Nombre,
                        anfitrion1: res.data.evento.evento.Anfitrion1,
                        anfitrion2: res.data.evento.evento.Anfitrion2,
                        apellido1: res.data.evento.evento.Apellido1,
                        apellido2: res.data.evento.evento.Apellido2,
                        vestimenta: res.data.evento.evento.Vestimenta,
                        dir1: res.data.evento.evento.Dir1,
                        dir2: res.data.evento.evento.Dir2,
                        fecha: res.data.evento.evento.Fecha,
                        idEmpresa: res.data.evento.evento.Empresa_id,
                        hora: res.data.evento.evento.Hora,
                        licencias: res.data.evento.evento.Licencias,
                        paises: res.data.evento.paises,
                        estados: res.data.evento.estados,
                        paisSeleccionado: res.data.evento.evento.Pais_id,
                        latitud: res.data.evento.evento.Latitud,
                        longitud: res.data.evento.evento.Longitud,
                        ubicacion: res.data.evento.evento.Ubicacion,
                        estado: (res.data.evento.evento.Activo) ? ("5b7e4c3b589bd25309f878ca") : ("5b7e4c90eaf5685309c47a4f"),
                        app: (res.data.evento.evento.App) ? ("5b7e4c3b589bd25309f878ca") : ("5b7e4c90eaf5685309c47a4f"),
                        logo: res.data.evento.evento.Logo,
                        fotoAnfitrion1: res.data.evento.evento.FotoAnfitrion1,
                        fotoAnfitrion2: res.data.evento.evento.FotoAnfitrion2,
                        fotoAnfitrion3: res.data.evento.evento.FotoAnfitrion3,
                        isLoading: false
                    })
                    console.log(this.state)
                    this.infoForm()
                })
            });
    }

    infoForm() {
        var optionSelectMultiple = {
            placeholder: 'Seleccione',
            selectAllText: 'Todos',
            allSelected: 'Todos',
            countSelected: '# de % opciones'
        };
        $('#menuapp').multipleSelect(optionSelectMultiple).multipleSelect('setSelects', this.state.menuAppInvitados);
        $('#licencias').inputmask({ "mask": "9999999", greedy: false, "placeholder": "" });
        var fecha = (this.state.fecha.split("/")).reverse();
        fecha = fecha.toString();
        fecha = fecha.replace(/,/g, "-");
        var ms = Date.parse(fecha);
        fecha = new Date(ms);
        $('#fecha').datetimepicker({
            format: 'DD/MM/YYYY',
            minDate: fecha,
        });

        $('#hora').datetimepicker({
            format: 'LT'
        });

        $('#div-edit-emp-img-preview').show();
        $('#div-edit-emp-img-new').hide();
    }


    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Menu usuario={this.state.usuario} />
                    <Header usuario={this.state.usuario} history={this.props.history} />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-user-friends page-header-heading-icon" />
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
                                            / Mostrar Evento
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
                    <Header usuario={this.state.user} history={this.props.history} />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-calendar-week page-header-heading-icon" />
                                            &nbsp;
                                        <Link to="/empresas">
                                                Empresa /
                                        </Link>{" "}
                                            {" "}
                                            <Link
                                                to={`/empresa/eventos/${
                                                    this.state.idEmpresa
                                                    }`}
                                            >
                                                Eventos
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
                                <li className="nav-item">
                                    <a className="nav-link" id="pills-fotografia-tab" data-toggle="pill" href="#pills-fotografia" role="tab" aria-controls="pills-fotografia" aria-selected="false">Fotografias</a>
                                </li>
                            </ul>

                            <hr className="line-gray" />

                            <form id="form-add-evento" className="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Nombre Evento</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="nombre" name="nombre" placeholder="Ingrese el nombre del evento" defaultValue={this.state.nombre} onChange={this.handleChange} disabled />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Nombre</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="anfitrion1" name="anfitrion1" placeholder="Ingrese nombre de anfitrión" value={this.state.anfitrion1} />
                                            </div>

                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Apellido</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="apellido1" name="apellido1" placeholder="Ingrese apellido de anfitrión" value={this.state.apellido1} onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Nombre 2</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="anfitrion2" name="anfitrion2" placeholder="Ingrese nombre de anfitrión" value={this.state.anfitrion2} onChange={this.handleChange} />
                                            </div>

                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Apellido 2</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="apellido2" name="apellido2" placeholder="Ingrese apellido de anfitrión" value={this.state.apellido2} onChange={this.handleChange} />
                                            </div>

                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Vestimenta</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="vestimenta" name="vestimenta" placeholder="Ingrese tipo de vestimenta" value={this.state.vestimenta} onChange={this.handleChange} />
                                            </div>

                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Fecha</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="fecha" name="fecha" placeholder="Ingrese la fecha del evento" defaultValue={this.state.fecha} onChange={this.handleChange} disabled />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Hora</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="hora" name="hora" placeholder="Ingrese la hora del evento" defaultValue={this.state.hora} onChange={this.handleChange} disabled />
                                            </div>
                                        </div>


                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Licencias</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="licencias" name="licencias" placeholder="Ingrese la cantidad de licencias del evento" defaultValue={this.state.licencias} onChange={this.handleChange} disabled />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">País</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="pais" name="paisSeleccionado" defaultValue={this.state.paisSeleccionado} onChange={this.handleChange} disabled>
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
                                                <input type="text" className="form-control form-control-sm" id="latitud" name="latitud" placeholder="Ingrese la latitud" defaultValue={this.state.latitud} onChange={this.handleChange} disabled />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Longitud</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="longitud" name="longitud" placeholder="Ingrese la longitud" defaultValue={this.state.longitud} onChange={this.handleChange} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Dirección</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="dir1" name="dir1" placeholder="Ingrese la dirección" value={this.state.dir1} onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Dirección 2</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="dir2" name="dir2" placeholder="Ingrese la dirección" value={this.state.dir2} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Ubicación</label>
                                            {this.state.ubicacion == 'GPS' ? (
                                                <div className="col-sm-4">
                                                    <div className="custom-control custom-radio custom-control-inline">
                                                        <input type="radio" defaultValue="g" id="customRadioInline1" name="ubicacion" className="custom-control-input" onChange={this.handleChange} checked disabled />
                                                        <label className="custom-control-label" htmlFor="customRadioInline1">GPS</label>
                                                    </div>
                                                    <div className="custom-control custom-radio custom-control-inline">
                                                        <input type="radio" defaultValue="m" id="customRadioInline2" name="ubicacion" className="custom-control-input" onChange={this.handleChange} disabled />
                                                        <label className="custom-control-label" htmlFor="customRadioInline2">Manual</label>
                                                    </div>
                                                </div>
                                            ) : (
                                                    <div className="col-sm-4">
                                                        <div className="custom-control custom-radio custom-control-inline">
                                                            <input type="radio" defaultValue="g" id="customRadioInline1" name="ubicacion" className="custom-control-input" onChange={this.handleChange} disabled />
                                                            <label className="custom-control-label" htmlFor="customRadioInline1">GPS</label>
                                                        </div>
                                                        <div className="custom-control custom-radio custom-control-inline">
                                                            <input type="radio" defaultValue="m" id="customRadioInline2" name="ubicacion" className="custom-control-input" onChange={this.handleChange} checked disabled />
                                                            <label className="custom-control-label" htmlFor="customRadioInline2">Manual</label>
                                                        </div>
                                                    </div>
                                                )}


                                        </div>


                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm" >App &nbsp;</label>
                                            <div className="col-sm-4">
                                                <select className="form-control form-control-sm" id="app" name="app" defaultValue={this.state.app} onChange={this.handleChange} disabled>
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
                                                <select className="form-control form-control-sm" id="estatus" name="estado" defaultValue={this.state.estado} onChange={this.handleChange} disabled>
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
                                        <div id="div-edit-emp-img-preview" className="text-center">
                                            <img id="preview-emp-logo-edit" src={this.state.logo} className="rounded img-example preview-emp-logo-edit" alt="" />
                                        </div>

                                        <input type="hidden" id="add-x" />
                                        <input type="hidden" id="add-y" />
                                        <input type="hidden" id="add-w" />
                                        <input type="hidden" id="add-h" />

                                    </div>
                                    <div className="tab-pane fade" id="pills-fotografia" role="tabpanel" aria-labelledby="pills-fotografia-tab">

                                        <div class="row justify-content-center">
                                            <div class="col-sm-6 text-center">
                                                <span className="btn btn-dark btn-file">Imagen anfitrión 1</span>

                                                <div id="div-edit-emp-img-new-1" className="text-center area-cropper-foto">
                                                    <img id="foto-anfitrion-1-preview" src={this.state.fotoAnfitrion1 ? this.state.fotoAnfitrion1 : `${this.state.url}/images/example.png`} className="rounded img-fotografia preview-emp-edit-new" alt="" />
                                                </div>
                                                <input type="hidden" id="add-1-x" />
                                                <input type="hidden" id="add-1-y" />
                                                <input type="hidden" id="add-1-w" />
                                                <input type="hidden" id="add-1-h" />
                                            </div>
                                            <div class="col-sm-6 text-center">
                                                <span className="btn btn-dark btn-file">Imagen anfitrión 2</span>


                                                <div id="div-edit-emp-img-new-2" className="text-center area-cropper-foto">
                                                    <img id="foto-anfitrion-2-preview" src={this.state.fotoAnfitrion2 ? this.state.fotoAnfitrion2 : `${this.state.url}/images/example.png`} className="rounded img-fotografia preview-emp-edit-new" alt="" />
                                                </div>
                                                <input type="hidden" id="add-2-x" />
                                                <input type="hidden" id="add-2-y" />
                                                <input type="hidden" id="add-2-w" />
                                                <input type="hidden" id="add-2-h" />
                                            </div>
                                            <div class="col-12 text-center">
                                                <span className="btn btn-dark btn-file">Imagen juntos</span>


                                                <div id="div-edit-emp-img-new-3" className="text-center area-cropper-foto">
                                                    <img id="foto-anfitrion-3-preview" src={this.state.fotoAnfitrion3 ? this.state.fotoAnfitrion3 : `${this.state.url}/images/example.png`} className="rounded img-fotografia preview-emp-edit-new" alt="" />
                                                </div>
                                                <input type="hidden" id="add-3-x" />
                                                <input type="hidden" id="add-3-y" />
                                                <input type="hidden" id="add-3-w" />
                                                <input type="hidden" id="add-3-h" />
                                            </div>
                                        </div>
                                        <div class="row justify-content-end">

                                        </div>

                                    </div>
                                    <div className="tab-pane fade" id="pills-invitados" role="tabpanel" aria-labelledby="pills-invitados-tab">

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

                                        <Link to={`/empresa/eventos/${
                                            this.state.idEmpresa
                                            }`}><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>

            )
        }
    }
}
