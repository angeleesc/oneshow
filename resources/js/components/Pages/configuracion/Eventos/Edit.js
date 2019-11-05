import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";
import RedesSociales from "./RedesSociales";
import Select from 'react-select';
import ConfigurarSocialWall from "./ConfigurarSocialWall";

import "../../css/configuracion/Biblioteca.css";
import "./css/Eventos.css";

export default class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            paises: JSON.parse(localStorage.getItem("paises")),
            estados: JSON.parse(localStorage.getItem("estados")),
            menuAppInvitados:[],
            idEvento: this.props.match.params.id,
            idEmpresa : "",
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
            infoEvento:"",
            logo:"",
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };

        this.configuracionRedesSociales = React.createRef();
        this.configuracionesSocialWall = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogo = this.handleLogo.bind(this);
        this.handleMultiChange = this.handleMultiChange.bind(this);
        this.getPaises = this.getPaises.bind(this);
    }

    getPaises(){
        axios.get('api/empresas/paises',{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
            console.log(res);
            let r = res.data;
            localStorage.setItem("paises", JSON.stringify(r.paises));
            localStorage.setItem("estados", JSON.stringify(r.estados));
            this.setState({
                paises:r.paises,
                estados: r.estados
            })
        })
    }

  componentDidMount () {
      axios
          .get("api/eventos/menus",{
              headers: {
                  Authorization: this.state.api_token
              }
          })
          .then(res => {
              console.log(res);
              this.setState({
                  menuAppInvitados: res.data.data
              });
              axios.get("api/eventos/one/"+this.state.idEvento,{
                  headers: {
                      Authorization: this.state.api_token
                  }
              }).then(res=>{
                  console.log('evento', res)
                  this.setState({
                      infoEvento:res.data.evento,
                      idEmpresa:res.data.evento.empresa._id,
                      nombre:res.data.evento.evento.Nombre,
                      fecha:res.data.evento.evento.Fecha,
                      hora:res.data.evento.evento.Hora,
                      licencias:res.data.evento.evento.Licencias,
                      paisSeleccionado:res.data.evento.evento.Pais_id,
                      latitud:res.data.evento.evento.Latitud,
                      longitud:res.data.evento.evento.Longitud,
                      ubicacion:res.data.evento.evento.Ubicacion,
                      items: res.data.evento.menusapp.map(item => ({ value: item._id, label: item.Nombre })),
                      selectedItems: res.data.evento.menusapp.filter(item => {
                        return res.data.evento.menuapp.some(selected => selected === item._id);
                      }).map(item => ({ value: item._id, label: item.Nombre})),
                      estado:res.data.evento.evento.Activo ? ("5b7e4c3b589bd25309f878ca"):("5b7e4c90eaf5685309c47a4f"),
                      app:res.data.evento.evento.App ? ("5b7e4c3b589bd25309f878ca"):("5b7e4c90eaf5685309c47a4f"),
                      logo:res.data.evento.evento.Logo,
                      isLoading:false
                  });
              })
          });
  }

  handleMultiChange (change) {
    this.setState({
      selectedItems: change,
    });
  }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        if(target.type === 'checkbox'){
            if(target.checked == "m"){
                console.log("if")
                value="MANUAL"
            }else{
                console.log("else")
                value="GPS"
            }
        }
        const name = target.name;
        this.setState({
          [name]: value
        })
    }

    handleSubmit (e) {
        e.preventDefault();

        // Enviar Configuraciones de redes sociales y Social Wall
        this.configuracionRedesSociales.current.handleClick();
        this.configuracionesSocialWall.current.enviarConfiguracion();


        let formData = new FormData();
        let s = this.state

        let ubicacion = $('input[name=ubicacion]:checked', '#form-add-evento').val();

        formData.append("id-evento", s.idEvento);
        formData.append("id-emp",s.idEmpresa)
        formData.append("nombre", s.nombre);
        formData.append("fecha", $('#form-add-evento input[name=fecha]').val());
        formData.append("hora", $('#form-add-evento input[name=hora]').val());
        formData.append("licencias", s.licencias);
        formData.append("pais", s.paisSeleccionado);
        formData.append("latitud", s.latitud);
        formData.append("longitud", s.longitud);
        formData.append("ubicacion",  ubicacion === undefined ? '' : ubicacion);
        formData.append("app", s.app);
        formData.append("estatus", s.estado);
        formData.append("logo", $('#form-add-evento input[name=logo]')[0].files[0] );
        formData.append("x", $('#add-x').val());
        formData.append("y", $('#add-y').val());
        formData.append("w", $('#add-w').val());
        formData.append("h", $('#add-h').val());
        const menu = this.state.selectedItems.map(item => item.value).join(',');

        formData.append("menuapp", menu);
        $('#update-evento').prepend('<i className="fa fa-spinner fa-spin"></i>');
        axios.post("api/eventos/edit",formData,{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
            $('button#save-evento').find('i.fa').remove();
            console.log(res);
            if (res.data.code == 200){
                $('#update-evento').find('i.fa').remove();
                Swal.fire({
                    text: "Evento editado exitosamente",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#343a40",
                    confirmButtonText: "OK",
                    target: document.getElementById('sweet')
                }).then((result) => {
                    if (result.value) {
                        window.scrollTo(0, 0);
                        this.props.history.push("/empresa/eventos/"+this.state.idEmpresa);
                    }
                });

                  
            }else{
                sweetalert('Error al editar el evento. Consulte al Administrador.', 'error', 'sweet');
            }
        }).catch(error => {
            $('#update-evento').find('i.fa').remove();
            sweetalert(error.response.data, 'error', 'sweet');
        });
    }

    handleLogo(){
            let input = ($('#logo'))[0];
            var $image =$('#preview-emp-logo-edit-new');
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

            $('#div-edit-emp-img-new').show();
            $('#div-edit-emp-img-preview').hide();
    }


    render() {
        if (this.state.isLoading || !JSON.parse(localStorage.getItem("paises")) || !JSON.parse(localStorage.getItem("estados"))) {
            this.getPaises();
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
                                            <i className="fas fa-calendar-week page-header-heading-icon" />
                                            &nbsp;
                                            <Link to="/empresas">
                                                Empresa
                                            </Link>
                                            <Link
                                                to={`/empresa/eventos/${
                                                    this.state.idEmpresa
                                                }`}
                                            >
                                                / Eventos
                                            </Link>{" "}
                                            / Editar Evento
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
                <Header  usuario={this.state.user} history={this.props.history}    />
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
                                        / Editar Evento
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
                            <a className="nav-link" id="pills-redes-sociales-tab" data-toggle="pill" href="#pills-redes-sociales" role="tab" aria-controls="pills-redes-sociales" aria-selected="false">Redes Sociales</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="pills-social-wall-tab" data-toggle="pill" href="#pills-social-wall" role="tab" aria-controls="pills-social-wall" aria-selected="false">Social Wall</a>
                        </li>
                    </ul>

                <hr className="line-gray"/>

                <form id="form-add-evento" className="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Nombre Evento</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" value={this.state.nombre} onChange={this.handleChange} id="nombre" name="nombre" placeholder="Ingrese el nombre del evento"  />
                                </div>
                            </div>

                            <div className="form-group row">
                                    <label className="col-sm-2 col-form-label col-form-label-sm">Fecha</label>
                                    <div className="col-sm-4">
                                        <input type="text" className="form-control form-control-sm" id="fecha" name="fecha" value={this.state.fecha} placeholder="Ingrese la fecha del evento"  />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label col-form-label-sm">Hora</label>
                                    <div className="col-sm-4">
                                        <input type="text" className="form-control form-control-sm" id="hora" name="hora"   value={this.state.hora} placeholder="Ingrese la hora del evento"  />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label col-form-label-sm">Licencias</label>
                                    <div className="col-sm-4">
                                        <input type="text" className="form-control form-control-sm" value={this.state.licencias} onChange={this.handleChange} id="licencias" name="licencias"  placeholder="Ingrese la cantidad de licencias del evento"  />
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
                                        <input type="text" className="form-control form-control-sm" value={this.state.latitud} onChange={this.handleChange} id="latitud" name="latitud"  placeholder="Ingrese la latitud"  />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label col-form-label-sm">Longitud</label>
                                    <div className="col-sm-4">
                                        <input type="text" className="form-control form-control-sm" value={this.state.longitud} onChange={this.handleChange} id="longitud" name="longitud"  placeholder="Ingrese la longitud"  />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label col-form-label-sm">Ubicación</label>
                                        {this.state.ubicacion=='GPS' ? (
                                            <div className="col-sm-4">
                                            <div className="custom-control custom-radio custom-control-inline">
                                                <input type="radio" value="g" id="customRadioInline1" name="ubicacion" className="custom-control-input" onChange={this.handleChange} checked/>
                                                <label className="custom-control-label" htmlFor="customRadioInline1">GPS</label>
                                            </div>
                                            <div className="custom-control custom-radio custom-control-inline">
                                                <input type="radio"  value="m" id="customRadioInline2" name="ubicacion" className="custom-control-input" onChange={this.handleChange}/>
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
                                                    <input type="radio"  value="m" id="customRadioInline2" name="ubicacion" className="custom-control-input" onChange={this.handleChange} checked/>
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
                                <span className="btn btn-dark btn-file">Subir Imagen <input type="file" id="logo" name="logo" onChange={this.handleLogo}/></span>
                            </div>


                            <div id="div-edit-emp-img-preview" className="text-center">
                                    <img id="preview-emp-logo-edit" src={this.state.logo} className="rounded img-example preview-emp-logo-edit" alt=""/>
                                </div>

                                <div id="div-edit-emp-img-new" className="text-center area-cropper">
                                    <img id="preview-emp-logo-edit-new" src="" className="rounded img-example preview-emp-edit-new" alt=""/>
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
                            <div className="mb-3">
                              <Select
                                isMulti={true} 
                                isSearchable={false}
                                className="multiselect"
                                classNamePrefix="oneshow"
                                closeMenuOnSelect={false}
                                options={this.state.items}
                                onChange={this.handleMultiChange}
                                defaultValue={this.state.selectedItems}
                                placeholder="Agregue características..."
                                styles={{ menu: base => ({ ...base, position: 'relative' }) }}
                              />
                            </div>
                        </div>

                        {/* Componente de configuracion de Redes Sociales */}
                        <div className="tab-pane fade" id="pills-redes-sociales" role="tabpanel" aria-labelledby="pills-redes-sociales-tab">
                            <RedesSociales 
                                ref={this.configuracionRedesSociales}
                                eventoId={this.state.idEvento} 
                            />
                        </div>

                        {/* Componente de configuracion del Social Wall */}
                        <div className="tab-pane fade" id="pills-social-wall" role="tabpanel" aria-labelledby="pills-social-wall-tab">
                            <ConfigurarSocialWall
                                ref={this.configuracionesSocialWall}
                                eventoId={this.state.idEvento}
                            />
                        </div>


                    </div>

                    <div className="form-group row">
                        <div className="col-sm-4">
                            <button type="submit" id="update-evento" className="btn btn-sm btn-dark mr-2">Guardar</button>

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
