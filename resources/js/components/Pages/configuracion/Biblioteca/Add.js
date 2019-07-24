import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Biblioteca.css";

export default class Add extends React.Component {
    constructor() {
        super();
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            eventos: JSON.parse(localStorage.getItem("eventos")),
            evento: null,
            eventoid: null,
            archivos: [],
            categorias: [],
            categoriaSeleccionada: "",
            estados: [],
            isLoading: true
        };
        /** declaro las funciones que haran uso del state */
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
    }

    /**
     * Funcion que se llama al estar el componente pre cargado
     * obtencio la informacion de los archivos añadidos
     */
    componentDidMount() {
        this.state.eventoid = this.props.match.params.id;
        axios.get('api/biblioteca/evento/files/data-add').then(res => {
            console.log(res);
            this.setState({
                isLoading : false,
                categorias : res.data.data.categorias,
                idCategoria: res.data.data.categorias[0]._id,
                nombreArchivo: '',
                estados: res.data.data.estados
            })
        });
    }
    /**
     * evento que  cambia a tiempo real el valor de las variables en el state asociada a los input
     * @param {*} e 
     */
    handleInputChange(e) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if(name == 'nombreArchivo'){
            this.setState({
                nombreArchivo: value
              })
        }else{
            this.setState({
                idCategoria:value
            })
        }
    }
    
    /**
     * funcion que se dispara al dar click en guardar,
     * se hace uso de la ruta api add/file
     * @param {*} e 
     */
  handleSubmit(e) {
    $('button#save-file').prepend('<i class="fa fa-spinner fa-spin"></i> ');
    e.preventDefault();
    let formData = new FormData();
    formData.append("id-evento", this.state.eventoid);
    formData.append("name", this.state.nombreArchivo);
    console.log(this.state.nombreArchivo)
    formData.append("categoria",this.state.idCategoria);
    formData.append("archivo", (this.fileInput.current.files[0] === undefined) ? '' : this.fileInput.current.files[0] );
    console.log(formData);
    axios.post('api/biblioteca/evento/add-file',formData).then(res=>{
        $('button#save-file').find('i.fa').remove()
        if(res.data.code === 200) {

            Swal.fire({
                text: "Archivo agregado exitosamente",
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#343a40",
                confirmButtonText: "OK",
                target: document.getElementById('sweet')
            }).then((result) => {

                if (result.value) {
                    this.props.history.push(`/biblioteca/evento/${
                        this.state.eventoid
                    }`)
                }

            });

        }else if(res.data.code === 500){
            sweetalert('Error al agregar archivo. Consulte al Administrador.', 'error', 'sweet');
        }
    }).catch(error => {
        $('button#save-file').find('i.fa').remove()
        sweetalert(error.response.data, 'error', 'sweet');
    })
  }

    render() {
        if(this.state.isLoading){
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
                                    <i className="fas fa-book page-header-heading-icon" />
                                    &nbsp;
                                    <Link to="/biblioteca">
                                        Biblioteca
                                    </Link>{" "}
                                    /{" "}
                                    <Link
                                        to={`/biblioteca/evento/${
                                            this.state.eventoid
                                        }`}
                                    >
                                        Archivos
                                    </Link>
                                    / Añadir Archivo
                                </h1>
                            </div>
                        </div>
                    </div>
                </header>

                <div id="sweet" className="container-fluid">
                            <h3><i class="fa fa-spinner fa-spin"></i>{" "}Cargando espere</h3>
                </div>
            </div>
        </div>
            )
            
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
                                            <i className="fas fa-book page-header-heading-icon" />
                                            &nbsp;
                                            <Link to="/biblioteca">
                                                Biblioteca
                                            </Link>{" "}
                                            /{" "}
                                            <Link
                                                to={`/biblioteca/evento/${
                                                    this.state.eventoid
                                                }`}
                                            >
                                                Archivos
                                            </Link>
                                            / Añadir Archivo
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
                            </ul>
    
                            <hr class="line-gray"/>
    
                            <form id="form-add" class="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                                                        
                                <div class="tab-content" id="pills-tabContent">
                                    <div class="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">
    
    
    
                                        <div class="form-group row">
                                            <label class="col-sm-2 col-form-label col-form-label-sm">Archivo</label>
                                            <div class="col-sm-5">
                                                <input type="file" class="form-control-file" id="archivo" name="archivo" ref={this.fileInput} required/>
                                            </div>
                                        </div>
    
                                        <div class="form-group row">
                                            <label class="col-sm-2 col-form-label col-form-label-sm">Nombre del Archivo</label>
                                            <div class="col-sm-5">
                                                <input type="text" class="form-control" id="nombreArchivo" name="nombreArchivo" placeholder="Nombre del archivo (Max. 10 caracteres sin espacio)" onChange={this.handleInputChange} required/>
                                            </div>
                                        </div>
    
                                        <div class="form-group row">
                                            <label class="col-sm-2 col-form-label col-form-label-sm">Categoria</label>
                                            <div class="col-sm-4">
                                                <select class="form-control form-control-sm" id="categoria" name="categoria" value={this.state.value} onChange={this.handleInputChange} required>
                                                    <option value="">Seleccione</option>
                                                    { this.state.categorias.map((e, index) => {
                                                        return (
                                                            <option key={index} value={e._id}>{e.Nombre}</option>
                                                        )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-sm-4">
                                        <button type="submit" id="save-file" class="btn btn-sm btn-dark mr-2">Guardar</button>
                                        <Link
                                                to={`/biblioteca/evento/${
                                                    this.state.eventoid
                                                }`}
                                            >
                                            <button type="button" class="btn btn-sm btn-dark">Volver</button></Link>
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
