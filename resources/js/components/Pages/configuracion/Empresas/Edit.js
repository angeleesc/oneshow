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
            paises : [],
            estados : [],
            paisSeleccionado: "",
            estadoSeleccionado: "",
            identificacion:"",
            nombre:"",
            telefono:"",
            correo:"",
            opcion: "Empresas",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            infoEmpresa:null,
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getPaises = this.getPaises.bind(this);
    }

    getPaises(){
        axios.get('api/empresas/paises/',{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
            let r = res.data;
            console.log(r);
            console.log("hola que abajo")
            if(res.data.code == "200"){
            localStorage.setItem("paises", JSON.stringify(r.paises));
            localStorage.setItem("estados", JSON.stringify(r.estados));
            this.setState({
                paises:r.paises,
                estados: r.estados
            })
            }
        })
    }

     componentDidMount() {
        console.log(this.props.match.params);
        let idEmpresa = this.props.match.params.id;

        axios.get(`api/empresas/${idEmpresa}`,{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res => {
            console.log(res)
            let r = res.data;
            this.setState(() => ({
                empresa: r.data.empresa,
                identificacion:r.data.empresa.Cuit_rut,
                nombre:r.data.empresa.Nombre,
                telefono:r.data.empresa.Telefono,
                correo:r.data.empresa.Correo,
                paisSeleccionado: r.data.empresa.Pais_id,
                estadoSeleccionado: (r.data.empresa.Activo)? ("5b7e4c3b589bd25309f878ca"):("5b7e4c90eaf5685309c47a4f"),
                isLoading:false
            }));
        });
    }

    
        handleChange(event) {
            console.log("evento change")
            const target = event.target;
            const value = target.value;
            const name = target.name;
        
            this.setState({
              [name]: value
            })

          }
    

    updateLogo(){
        console.log("update logo!")
        let input = ($('#emp-logo-edit'))[0];
        var $image = $('#preview-emp-logo-edit-new');
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
                    $('#emp-edit-x').val(event.detail.x);
                            $('#emp-edit-y').val(event.detail.y);
                            $('#emp-edit-w').val(event.detail.width);
                            $('#emp-edit-h').val(event.detail.height);
                }
            });


        };
        $('#div-edit-emp-img-new').show();
        $('#div-edit-emp-img-preview').hide();
    }

    handleSubmit(e){
        e.preventDefault();
        let formData = new FormData();

        formData.append("emp-id",this.state.empresa._id);
        formData.append("identificacion", this.state.identificacion);
        formData.append("nombre", this.state.nombre);
        formData.append("correo", this.state.correo);
        formData.append("telefono", this.state.telefono);
        formData.append("pais", this.state.paisSeleccionado);
        formData.append("estatus", this.state.estadoSeleccionado);
        formData.append("logo", $('#form-edit-empresa input[name=emp-logo]')[0].files[0]);
        formData.append("x", $('#emp-edit-x').val());
        formData.append("y", $('#emp-edit-y').val());
        formData.append("w", $('#emp-edit-w').val());
        formData.append("h", $('#emp-edit-h').val());
        $("#save-empresa").prepend("<i class='fa fa-spinner fa-spin'></i> ");
        axios.post('api/empresas/update',formData,{
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res=>{
            $("save-empresa").find("i.fa").remove();
            if(res.data.code === 200) {

                Swal.fire({
                    text: "Empresa editada exitosamente exitosamente",
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
                            console.log(res);
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
        console.log(this.state)
        if (this.state.isLoading ) {
            this.getPaises();
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
                                            / Editar Empresa
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

                </ul>

                <hr className="line-gray"/>

                <form id="form-edit-empresa" className="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                    {console.log(this.state.empresa)}

                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Identificación</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="identificacion" name="identificacion" value={this.state.identificacion}placeholder="Ingrese el numero de identificacion fiscal"  onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Nombre</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="nombre" name="nombre" value={this.state.nombre} placeholder="Ingrese el nombre de la empresa"  onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Correo</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="correo" value={this.state.correo} name="correo"  placeholder="Ingrese el correo de la empresa"  onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label col-form-label-sm">Teléfono</label>
                                <div className="col-sm-4">
                                    <input type="text" className="form-control form-control-sm" id="telefono" name="telefono" value={this.state.telefono} placeholder="Ingrese el teléfono de la empresa"  onChange={this.handleChange}/>
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
                                <label className="col-sm-2 col-form-label col-form-label-sm">Estado</label>
                                <div className="col-sm-4">
                                    <select className="form-control form-control-sm" id="estatus" name="estadoSeleccionado" value={this.state.estadoSeleccionado} onChange={this.handleChange}>
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

                        

                            <div class="text-center btn-upload-image mb-5">
                                    <span class="btn btn-dark btn-file">Subir Imagen <input type="file" id="emp-logo-edit" name="emp-logo" onChange={this.updateLogo}/></span>
                                </div>



                                <div id="div-edit-emp-img-preview" class="text-center">
                                    <img id="preview-emp-logo-edit" src={this.state.empresa.Logo} class="rounded img-example preview-emp-logo-edit" alt=""/>
                                </div>

                                <div id="div-edit-emp-img-new" class="text-center area-cropper">
                                    <img id="preview-emp-logo-edit-new" src="" class="rounded img-example preview-emp-edit-new" alt=""/>
                                </div>

                                <input type="hidden" id="emp-edit-x"/>
                                <input type="hidden" id="emp-edit-y"/>
                                <input type="hidden" id="emp-edit-w"/>
                                <input type="hidden" id="emp-edit-h"/>


                        </div>

                    </div>

                    <div className="form-group row">
                        <div className="col-sm-4">
                            <button type="submit" id="save-empresa" className="btn btn-sm btn-dark mr-2">Guardar</button>

                            <Link to="/empresas" className="btn btn-sm btn-dark">Volver</Link>
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
