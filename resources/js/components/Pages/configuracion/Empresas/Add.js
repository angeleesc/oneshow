import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Empresas.css";

export default class AddEmpresas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresasTabla: JSON.parse(localStorage.getItem("empresasTabla")),
            paises : JSON.parse(localStorage.getItem("paises")),
            estados : JSON.parse(localStorage.getItem("estados")),
            paisSeleccionado: "",
            estadoSeleccionado: "",
            identificacion:"",
            nombre:"",
            telefono:"",
            correo:"",
            opcion: "Empresas",
            footer: "Footer",
            api_token: localStorage.getItem("api_token"),
            eventos: JSON.parse(localStorage.getItem("eventos")),
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getPaises = this.getPaises.bind(this);
    }

    getPaises(){
        axios.get('api/empresas/paises',{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
            let r = res.data
            console.log(res)
            localStorage.setItem("paises", JSON.stringify(r.paises));
            localStorage.setItem("estados", JSON.stringify(r.estados));
            this.setState({
                paises:r.paises,
                estados: r.estados,
                paisSeleccionado:r.paises[0]._id,
                estadoSeleccionado: r.estados[0]._id,
                isLoading:false
            })
        })
    }

    
    handleChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      });
    }
    

    addLogo () {
      let input = ($('#emp-logo'))[0];
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
            $('#emp-add-x').val(event.detail.x);
            $('#emp-add-y').val(event.detail.y);
            $('#emp-add-w').val(event.detail.width);
            $('#emp-add-h').val(event.detail.height);
          }
        });
      };
    }

    handleSubmit(e){
        e.preventDefault();
        let formData = new FormData();
        formData.append("identificacion", this.state.identificacion);
        formData.append("nombre", this.state.nombre);
        formData.append("correo", this.state.correo);
        formData.append("telefono", this.state.telefono);
        formData.append("pais", this.state.paisSeleccionado);
        formData.append("estatus", this.state.estadoSeleccionado);
        formData.append("logo", $('#form-add-empresa input[name=emp-logo]')[0].files[0] === undefined ? '' : $('#form-add-empresa input[name=emp-logo]')[0].files[0] );
        formData.append("x", $('#emp-add-x').val());
        formData.append("y", $('#emp-add-y').val());
        formData.append("w", $('#emp-add-w').val());
        formData.append("h", $('#emp-add-h').val());
        $('button#save-empresa').prepend('<i class="fa fa-spinner fa-spin"></i> ');
        axios.post('api/empresas/add',formData,{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
            
            if(res.data.code === 200) {

                Swal.fire({
                    text: "Empresa agregada exitosamente",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#343a40",
                    confirmButtonText: "OK",
                    target: document.getElementById('sweet')
                }).then((result) => {
                    if(result.value){
                        axios
                        .post("api/empresas/tabla", {
                            rol: this.state.permisoUsuario.nombre,
                            id: this.state.usuario._id
                        },{
                            headers: {
                                Authorization: this.state.api_token
                            }
                        })
                        .then(res => {
                            localStorage.setItem("empresasTabla", JSON.stringify(res.data));
                            this.props.history.push("/empresas");
                        });
                    }
                   

                });

            }else if(res.data.code === 500){
                sweetalert('Error al agregar empresa. Consulte al Administrador.', 'error', 'sweet');
            }
        }).catch(error => {
            $('button#save-empresa').find('i.fa').remove();
            sweetalert(error.response.data, 'error', 'sweet');
        })
    }



    render() {
        if (!JSON.parse(localStorage.getItem("paises")) || !JSON.parse(localStorage.getItem("estados"))) {
            console.log("no esta en local storage");
            this.getPaises();
        } else {
            console.log("esta en local storage");
            this.state.isLoading = false;
        }
        if (this.state.isLoading) {
            return (
                <div>
                    <Menu usuario={this.state.user} />
                    <Header                     usuario={this.state.user}                     history={this.props.history}                 />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-industry page-header-heading-icon" />
                                            {this.state.opcion}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div id="sweet" className="container-fluid">
                            <div className="row">
                                <div className="offset-6">
                                    <h3>
                                        <i className="fas fa-industry fa-spin" />{" "}
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
                    <Header                     usuario={this.state.user}                     history={this.props.history}                 />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                        <Link to="/empresas">
                                            <i className="fas fa-industry page-header-heading-icon" />
                                            {this.state.opcion}
                                            </Link>
                                            {" "}
                                            / Agregar Empresa
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="pills-datos-tab" data-toggle="pill" href="#pills-datos" role="tab" aria-controls="pills-datos" aria-selected="true">Datos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="pills-logo-tab" data-toggle="pill" href="#pills-logo" role="tab" aria-controls="pills-logo" aria-selected="false">Logo</a>
                    </li>

                </ul>

                <hr class="line-gray"/>

                <form id="form-add-empresa" class="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">ID fiscal</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control form-control-sm" id="identificacion" name="identificacion" placeholder="Ingrese el numero de identificacion fiscal"  onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Nombre</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control form-control-sm" id="nombre" name="nombre" placeholder="Ingrese el nombre de la empresa"  onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Correo</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control form-control-sm" id="correo" name="correo"  placeholder="Ingrese el correo de la empresa"  onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Teléfono</label>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control form-control-sm" id="telefono" name="telefono"  placeholder="Ingrese el teléfono de la empresa"  onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">País</label>
                                <div class="col-sm-4">
                                    <select class="form-control form-control-sm" id="pais" name="paisSeleccionado" value={this.state.paisSeleccionado} onChange={this.handleChange}>
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

                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label col-form-label-sm">Estado</label>
                                <div class="col-sm-4">
                                    <select class="form-control form-control-sm" id="estatus" name="estadoSeleccionado" value={this.state.estadoSeleccionado} onChange={this.handleChange}>
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


                        <div class="tab-pane fade" id="pills-logo" role="tabpanel" aria-labelledby="pills-logo-tab">

                            <div class="alert alert-primary mb-4" role="alert">
                                <i class="fas fa-info-circle"></i>&nbsp;
                                La imagén a subir debe tener una resolución de <strong>200x200</strong>, en formato <strong>.jpg</strong> o <strong>.png</strong> y un peso aproximado entre <strong>10KB</strong> y <strong>5MB</strong>.
                            </div>

                            <div class="text-center btn-upload-image mb-5">
                                <span class="btn btn-dark btn-file">Subir Imagen <input type="file" id="emp-logo" name="emp-logo" onChange={this.addLogo}/></span>
                            </div>

                            <div id="div-add-emp-img" class="text-center area-cropper">
                                <img id="preview-add-emp" src="" class="rounded img-example preview-add" alt=""/>
                            </div>

                            <input type="hidden" id="emp-add-x"/>
                            <input type="hidden" id="emp-add-y"/>
                            <input type="hidden" id="emp-add-w"/>
                            <input type="hidden" id="emp-add-h"/>

                        </div>

                    </div>

                    <div class="form-group row">
                        <div class="col-sm-4">
                            <button type="submit" id="save-empresa" class="btn btn-sm btn-dark mr-2">Guardar</button>

                            <a href=""><button type="button" class="btn btn-sm btn-dark">Volver</button></a>
                        </div>
                    </div>

                </form>

                        </div>

                        {/**esto de abajo es de php, es el texto que cambia con el menu */}
                        <footer className="content-wrapper-footer">
                            <span>{this.state.footer}</span>
                        </footer>
                    </div>
                </div>
            );
        }
    }
}
