import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";
import Select from 'react-select';

import "../../css/configuracion/Biblioteca.css";
import "./css/Eventos.css";

export default class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            paises: JSON.parse(localStorage.getItem("paises")),
            estados: JSON.parse(localStorage.getItem("estados")),
            menuAppInvitados: [],
            idEmpresa: this.props.match.params.id,
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
            estado: "5b7e4c90eaf5685309c47a4f",
            app: "",
            logo: "",
            api_token: localStorage.getItem("api_token"),
            menuAppSeleccionados: [],
            isLoading: true,
            // Multiselect state values
            items: [],
            fotoAnfitrion1: "",
            fotoAnfitrion2: "",
            fotoAnfitrion3: "",
            loading: true,
            selectedItems: [],
            url: 'https://consola.oneshow.com.ar',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogo = this.handleLogo.bind(this);
        this.handleMultiChange = this.handleMultiChange.bind(this);
        this.getPaises = this.getPaises.bind(this);
    }

    getPaises() {
        axios.get('api/empresas/paises', {
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res => {
            let r = res.data

            localStorage.setItem("paises", JSON.stringify(r.paises));
            localStorage.setItem("estados", JSON.stringify(r.estados));

            this.setState({
                paises: r.paises,
                estados: r.estados,
                isLoading: false
            });
        });
    }

    componentDidMount() {
        axios.get("api/eventos/menus", {
            headers: {
                Authorization: this.state.api_token
            }
        })
            .then(res => {
                this.setState({
                    menuAppInvitados: res.data.data,
                    loading: false,
                    items: res.data.data.map(item => ({
                        value: item._id,
                        label: item.Nombre,
                    })),
                    selectedItems: [],
                });
            });
    }

    handleMultiChange(change) {
        this.setState({
            selectedItems: change,
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        if (target.type === 'checkbox') {
            if (target.checked == "m") {
                console.log("if")
                value = "MANUAL"
            } else {
                console.log("else")
                value = "GPS"
            }
        }
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        let s = this.state

        let ubicacion = $('input[name=ubicacion]:checked', '#form-add-evento').val();

        formData.append("id-emp", s.idEmpresa);
        formData.append("nombre", s.nombre);
        formData.append("anfitrion1", s.anfitrion1);
        formData.append("anfitrion2", s.anfitrion2);
        formData.append("apellido1", s.apellido1);
        formData.append("apellido2", s.apellido2);
        formData.append("vestimenta", s.vestimenta);
        formData.append("dir1", s.dir1);
        formData.append("dir2", s.dir2);
        formData.append("fecha", $('#form-add-evento input[name=fecha]').val());
        formData.append("hora", $('#form-add-evento input[name=hora]').val());
        formData.append("licencias", s.licencias);
        formData.append("pais", s.paisSeleccionado);
        formData.append("latitud", s.latitud);
        formData.append("longitud", s.longitud);
        formData.append("ubicacion", ubicacion === undefined ? '' : ubicacion);
        formData.append("app", s.app === "5b7e4c3b589bd25309f878ca" ? true : false);
        formData.append("estatus", s.estado === "5b7e4c3b589bd25309f878ca" ? true : false);
        formData.append("logo", $('#form-add-evento input[name=logo]')[0].files[0] === undefined ? '' : $('#form-add-evento input[name=logo]')[0].files[0]);
        formData.append("x", $('#add-x').val());
        formData.append("y", $('#add-y').val());
        formData.append("w", $('#add-w').val());
        formData.append("h", $('#add-h').val());
        formData.append("fotoAnfitrion-1", $('#form-add-evento input[name=fotoAnfitrion-1]')[0].files[0]);
        formData.append("x-1", $('#add-1-x').val());
        formData.append("y-1", $('#add-1-y').val());
        formData.append("w-1", $('#add-1-w').val());
        formData.append("h-1", $('#add-1-h').val());
        formData.append("fotoAnfitrion-2", $('#form-add-evento input[name=fotoAnfitrion-2]')[0].files[0]);
        formData.append("x-2", $('#add-2-x').val());
        formData.append("y-2", $('#add-2-y').val());
        formData.append("w-2", $('#add-2-w').val());
        formData.append("h-2", $('#add-2-h').val());
        formData.append("fotoAnfitrion-3", $('#form-add-evento input[name=fotoAnfitrion-3]')[0].files[0]);
        formData.append("x-3", $('#add-3-x').val());
        formData.append("y-3", $('#add-3-y').val());
        formData.append("w-3", $('#add-3-w').val());
        formData.append("h-3", $('#add-3-h').val());
        const menu = this.state.selectedItems.map(item => item.value).join(',');
        console.log('menu', menu);

        formData.append("menuapp", menu);
        $('#save-evento').prepend('<i class="fa fa-spinner fa-spin"></i> ');

        axios.post("api/eventos/add", formData, {
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res => {

            console.log('res-evento',res);
            if (res.data.code == 200) {
                sweetalert(
                    "Evento agregado correctamente",
                    "success",
                    "sweet"
                );
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    this.props.history.push("/empresa/eventos/" + s.idEmpresa);
                }, 2000);

            } else {

            }
        }).catch(error => {
            $('button#save-evento').find('i.fa').remove();
            sweetalert(error.response.data, 'error', 'sweet');
        })
    }

    handleLogo() {
        console.log("handle logo")
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
                crop: function (event) {

                    $('#add-x').val(event.detail.x);
                    $('#add-y').val(event.detail.y);
                    $('#add-w').val(event.detail.width);
                    $('#add-h').val(event.detail.height);
                }
            });


        };

    }

    handleFotografia(event) {
        const img = event.target.files[0]
        const idImg = event.target.id.split("-")[1]

        const $image = $(`#foto-anfitrion-${idImg}-preview`)
        const oFReader = new FileReader();

        console.log();


        oFReader.readAsDataURL(img);
        oFReader.onload = function (oFREvent) {

            // Destroy the old cropper instance
            $image.cropper('destroy');

            // Replace url
            $image.attr('src', this.result);


            // Start cropper
            $image.cropper({
                viewMode: 1,
                minContainerWidth: 320,
                // minContainerHeight: 320,
                autoCropArea: 1,
                crop: function (event) {
                    $(`#add-${idImg}-x`).val(event.detail.x);
                    $(`#add-${idImg}-y`).val(event.detail.y);
                    $(`#add-${idImg}-w`).val(event.detail.width);
                    $(`#add-${idImg}-h`).val(event.detail.height);
                }
            });


        };
        $(`#div-edit-emp-img-new-${idImg}`).show();
        $(`#div-edit-emp-img-preview-${idImg}`).hide();

    }
    render() {
        if (this.state.isLoading || !JSON.parse(localStorage.getItem("paises")) || !JSON.parse(localStorage.getItem("estados"))) {
            this.getPaises();
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
                                            <i className="fas fa-user-friends page-header-heading-icon" />
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
                                                Eventos
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
                                                <input type="text" className="form-control form-control-sm" id="nombre" name="nombre" placeholder="Ingrese el nombre del evento" value={this.state.nombre} onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Nombre</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="anfitrion1" name="anfitrion1" placeholder="Ingrese nombre de anfitrión" value={this.state.anfitrion1} onChange={this.handleChange} />
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
                                                <input type="text" className="form-control form-control-sm" id="fecha" name="fecha" placeholder="Ingrese la fecha del evento" />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Hora</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="hora" name="hora" placeholder="Ingrese la hora del evento" />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Licencias</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="licencias" name="licencias" placeholder="Ingrese la cantidad de licencias del evento" value={this.state.licencias} onChange={this.handleChange} />
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
                                                <input type="text" className="form-control form-control-sm" id="latitud" name="latitud" placeholder="Ingrese la latitud" value={this.state.latitud} onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label col-form-label-sm">Longitud</label>
                                            <div className="col-sm-4">
                                                <input type="text" className="form-control form-control-sm" id="longitud" name="longitud" placeholder="Ingrese la longitud" value={this.state.longitud} onChange={this.handleChange} />
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
                                                        <input type="radio" value="g" id="customRadioInline1" name="ubicacion" className="custom-control-input" onChange={this.handleChange} checked />
                                                        <label className="custom-control-label" htmlFor="customRadioInline1">GPS</label>
                                                    </div>
                                                    <div className="custom-control custom-radio custom-control-inline">
                                                        <input type="radio" value="m" id="customRadioInline2" name="ubicacion" className="custom-control-input" onChange={this.handleChange} />
                                                        <label className="custom-control-label" htmlFor="customRadioInline2">Manual</label>
                                                    </div>
                                                </div>
                                            ) : (
                                                    <div className="col-sm-4">
                                                        <div className="custom-control custom-radio custom-control-inline">
                                                            <input type="radio" value="g" id="customRadioInline1" name="ubicacion" className="custom-control-input" onChange={this.handleChange} />
                                                            <label className="custom-control-label" htmlFor="customRadioInline1">GPS</label>
                                                        </div>
                                                        <div className="custom-control custom-radio custom-control-inline">
                                                            <input type="radio" value="m" id="customRadioInline2" name="ubicacion" className="custom-control-input" onChange={this.handleChange} checked />
                                                            <label className="custom-control-label" htmlFor="customRadioInline2">Manual</label>
                                                        </div>
                                                    </div>
                                                )}
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
                                        {this.state.permisoUsuario.nombre === "ADMINISTRADOR" &&
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
                                        }
                                    </div>


                                    <div className="tab-pane fade" id="pills-logo" role="tabpanel" aria-labelledby="pills-logo-tab">

                                        <div className="alert alert-primary mb-4" role="alert">
                                            <i className="fas fa-info-circle"></i>&nbsp;
                              La imagén a subir debe tener una resolución de <strong>200x200</strong>, en formato <strong>.jpg</strong> o <strong>.png</strong> y un peso aproximado entre <strong>10KB</strong> y <strong>5MB</strong>.
                          </div>

                                        <div className="text-center btn-upload-image mb-5">
                                            <span className="btn btn-dark btn-file">Subir Imagen <input type="file" id="logo" name="logo" onChange={this.handleLogo} /></span>
                                        </div>

                                        <div id="div-add-emp-img" className="text-center area-cropper">
                                            <img id="preview-add-emp" src="" className="rounded img-example preview-add" alt="" />
                                        </div>

                                        <input type="hidden" id="add-x" />
                                        <input type="hidden" id="add-y" />
                                        <input type="hidden" id="add-w" />
                                        <input type="hidden" id="add-h" />

                                    </div>

                                    <div className="tab-pane fade" id="pills-invitados" role="tabpanel" aria-labelledby="pills-invitados-tab">
                                        <div className="alert alert-primary mb-4" role="alert">
                                            <i className="fas fa-info-circle"></i>&nbsp;
                                            Seleccione los menús que estaran habilitados en la App para el evento.
                        </div>
                                        <div className="mb-3">
                                            <Select
                                                isMulti={true}
                                                isSearchable={false}
                                                className="multiselect"
                                                classNamePrefix="oneshow"
                                                options={this.state.items}
                                                closeMenuOnSelect={false}
                                                onChange={this.handleMultiChange}
                                                placeholder="Agregue características..."
                                                styles={{ menu: base => ({ ...base, position: 'relative' }) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-fotografia" role="tabpanel" aria-labelledby="pills-fotografia-tab">

                                        <div className="alert alert-primary mb-4" role="alert">
                                            <i className="fas fa-info-circle"></i>&nbsp;
    La imagén a subir debe tener una resolución de <strong>1200x800</strong>, en formato <strong>.jpg</strong> o <strong>.png</strong> y un peso aproximado entre <strong>10KB</strong> y <strong>10MB</strong>.
                                        
</div>

                                        <div class="row justify-content-end">
                                            <div class="col-sm-5" style={{marginRight: '100px'}}>
                                                <div className="text-center btn-upload-image mb-8">
                                                    <input type="file" id="fotoAnfitrion-1" name="fotoAnfitrion-1" className="custom-file-input" onChange={this.handleFotografia} />
                                                    <label className="custom-file-label" for="fotoAnfitrion-1">Elegir Archivo</label>
                                                </div>
                                                <div id="div-edit-emp-img-preview-1" className="text-center">
                                                    <img id="foto-anfitrion-1" src={this.state.fotoAnfitrion1 ? this.state.fotoAnfitrion1 : `${this.state.url}/images/example.png`} className="rounded img-fotografia preview-emp-logo-edit" alt="" />
                                                </div>

                                                <div id="div-edit-emp-img-new-1" className="text-center area-cropper-foto">
                                                    <img id="foto-anfitrion-1-preview" src="" className="rounded img-fotografia preview-emp-edit-new" alt="" />
                                                </div>
                                                <input type="hidden" id="add-1-x" />
                                                <input type="hidden" id="add-1-y" />
                                                <input type="hidden" id="add-1-w" />
                                                <input type="hidden" id="add-1-h" />
                                            </div>
                                            <div class="col-sm-5">
                                                <div className="text-center btn-upload-image mb-8">
                                                    <input type="file" id="fotoAnfitrion-2" name="fotoAnfitrion-2" className="custom-file-input" onChange={this.handleFotografia} />
                                                    <label className="custom-file-label" for="fotoAnfitrion-2">Elegir Archivo</label>
                                                </div>
                                                <div id="div-edit-emp-img-preview-2" className="text-center">
                                                    <img id="foto-anfitrion-2" src={this.state.fotoAnfitrion2 ? this.state.fotoAnfitrion2 : `${this.state.url}/images/example.png`} className="rounded img-fotografia preview-emp-logo-edit" alt="" />
                                                </div>

                                                <div id="div-edit-emp-img-new-2" className="text-center area-cropper-foto">
                                                    <img id="foto-anfitrion-2-preview" src="" className="rounded img-fotografia preview-emp-edit-new" alt="" />
                                                </div>
                                                <input type="hidden" id="add-2-x" />
                                                <input type="hidden" id="add-2-y" />
                                                <input type="hidden" id="add-2-w" />
                                                <input type="hidden" id="add-2-h" />
                                            </div>
                                            <div class="col-sm-5 mx-auto">
                                                <div className="text-center btn-upload-image mb-8">
                                                    <input type="file" id="fotoAnfitrion-3" name="fotoAnfitrion-3" className="custom-file-input" onChange={this.handleFotografia} />
                                                    <label className="custom-file-label" for="fotoAnfitrion-3">Elegir Archivo</label>
                                                </div>
                                                <div id="div-edit-emp-img-preview-3" className="text-center">
                                                    <img id="foto-anfitrion-3-edit" src={this.state.fotoAnfitrion3 ? this.state.fotoAnfitrion3 : `${this.state.url}/images/example.png`} className="rounded img-fotografia preview-emp-logo-edit" alt="" />
                                                </div>

                                                <div id="div-edit-emp-img-new-3" className="text-center area-cropper-foto">
                                                    <img id="foto-anfitrion-3-preview" src="" className="rounded img-fotografia preview-emp-edit-new" alt="" />
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
