import React, { Component, createRef } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import * as traerPlantillas from '../../../../../redux/actions/plantillas'

class Show extends Component {
    constructor(props) {

        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            archivos: [],
            idEvento: props.location.state.idEvento,
            evento: "",
            empresa: "",
            tipo: "",
            opcion: "Invitacion",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: false,

            url: 'http://127.0.0.1:8001',
            templateSelect: createRef()
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.listPlantillas = this.listPlantillas.bind(this);
        this.handlChaneSelectTemplate = this.handlChaneSelectTemplate.bind(this);
        this.handleSaveTemplate = this.handleSaveTemplate.bind(this);
        this.spinner = this.spinner.bind(this);

    }

    componentDidMount() {


        if (!this.props.plantillas.length) {
            this.props.traerPlantillas(this.state.api_token)
        }


    }

    handleSaveTemplate() {
        const evento = this.state.eventos.filter(ev => ev._id == this.state.idEvento)[0]
        this.setState({
            evento: evento
        })
        const idPlantilla = this.state.templateSelect.current.value;
        if (idPlantilla !== "0") {
            const plantilla = {
                Evento_id: this.state.idEvento,
                idPlantilla
            }

            this.props.agregarPlantillaEvento(plantilla);

        }
    }


    async handlChaneSelectTemplate() {
        const evento = this.state.eventos.filter(ev => ev._id == this.state.idEvento)[0]
        this.setState({
            evento: evento
        })
        const id = this.state.templateSelect.current.value
        const $contenedorPlantillas = document.querySelector("#contenedor-plantilla");
        if (id !== "0") {

            const template = await fetch(`${this.state.url}/plantillas/${id}/index.html`)
            const result = await template.text();


            $contenedorPlantillas.innerHTML = result

            const nombreEvento = document.querySelector('#nombre');
            const anfrition1 = document.querySelector('#anfrition1');
            const fechaMes = document.querySelector('#fecha #fecha-mes');
            const fechaDia = document.querySelector('#fecha #fecha-dia');
            const fechaAnio = document.querySelector('#fecha #fecha-anio');
            const hora = document.querySelector('#hora');
            const dir1 = document.querySelector('#dir1');
            const vestimenta = document.querySelector('#vestimenta');

            nombreEvento.innerHTML = this.state.evento.Evento
            anfrition1.innerHTML = this.state.evento.Anfitrion1
            fechaMes.innerHTML = this.state.evento.Fecha.split(" ")[0].split("/")[0]
            fechaDia.innerHTML = this.state.evento.Fecha.split(" ")[0].split("/")[1]
            fechaAnio.innerHTML = this.state.evento.Fecha.split(" ")[0].split("/")[2]
            hora.innerHTML = `${this.state.evento.Fecha.split(" ")[1]} ${this.state.evento.Fecha.split(" ")[2]}`
            dir1.innerHTML = this.state.evento.Dir1
            dir2.innerHTML = this.state.evento.Dir2
            vestimenta.innerHTML = this.state.evento.Vestimenta
        }
    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }

    spinner() {

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
                                        <Link to="/invitacion">
                                            Invitación
                                    </Link>{" "}
                                        / Agregar Archivos
                                </h1>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
        )

    }

    handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("id-evento", this.state.idEvento);
        formData.append("tipo", this.state.tipo);
        formData.append("archivoimg", $('#form-add input[name=archivoimg]')[0].files[0] === undefined ? '' : $('#form-add input[name=archivoimg]')[0].files[0]);
        formData.append("archivopdf", $('#form-add input[name=archivopdf]')[0].files[0] === undefined ? '' : $('#form-add input[name=archivopdf]')[0].files[0]);
        $('button#save-file').prepend('<i class="fa fa-spinner fa-spin"></i> ');
        axios.post("api/invitaciones/file/add", formData, {
            headers: {
                Authorization: this.state.api_token
            }
        }).then(res => {
            console.log(res);

            $('button#save-file').find('i.fa').remove();
            if (res.data.code === 200) {
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
                        this.props.history.push("/invitaciones/show/" + this.state.idEvento);
                    }
                });
            } else if (res.data.code === 500) {
                sweetalert('Error al agregar archivo. Consulte al Administrador.', 'error', 'sweet');
            }
        }).catch(error => {
            $('button#save-file').find('i.fa').remove();
            sweetalert(error.response.data, 'error', 'sweet');
        })
    }

    listPlantillas() {
        const { plantillas } = this.props.plantillas
        if (plantillas) {
            return (
                plantillas.map((plantilla, key) => {
                    return <option key={key} value={plantilla._id} >{plantilla.nombre}</option>
                })
            )
        }

    }
    render() {
        console.log('props', this.props);
        const frame = {
            with: '100%',
            border: 'solid #466a7b 1px',
            height: '100vh',
            padding: '0px'
        };


        if (this.state.isLoading || this.props.cargando) {
            return this.spinner()
        } else {
            return (
                <div>

                    {this.props.regresar && sweetalert(`Se ha creado la invitación exitosamente.`, 'success', 'sweet')}
                    {this.props.regresar && <Redirect to={`/invitacion/show/${this.props.location.state.idEvento}`} />}
                    <Menu usuario={this.state.user} />
                    <Header usuario={this.state.user} history={this.props.history} />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <Link to="/invitacion">
                                                Invitación
                                            </Link>{" "}
                                            / Agregar Archivo - Plantilla
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="pills-datos-tab" data-toggle="pill" href="#pills-datos" role="tab" aria-controls="pills-datos" aria-selected="true">Archivos</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="pills-plantilla-tab" data-toggle="pill" href="#pills-plantilla" role="tab" aria-controls="pills-plantilla" aria-selected="false">Plantillas</a>
                                </li>
                            </ul>

                            <hr className="line-gray" />
                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-datos" role="tabpanel" aria-labelledby="pills-datos-tab">
                                    <form id="form-add" className="form-change-password form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

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
                                        <div className="form-group row">
                                            <div className="col-sm-4">
                                                <button type="submit" id="save-file" className="btn btn-sm btn-dark mr-2">Guardar</button>
                                                <Link to={"/invitacion/show/" + this.state.idEvento}><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="tab-pane fade" id="pills-plantilla" role="tabpanel" aria-labelledby="pills-plantilla-tab">


                                    <div className="form-group row">

                                        <label className="col-sm-2 col-form-label col-form-label-sm">Seleccionar Plantilla</label>
                                        <div className="col-sm-4">
                                            <select ref={this.state.templateSelect} onChange={this.handlChaneSelectTemplate} className="form-control form-control-sm" id="template" name="template">
                                                <option value="0">Seleccione</option>
                                                {this.listPlantillas()}
                                            </select>

                                        </div>

                                        <div className="col-sm-4">
                                            <button type="submit" onClick={this.handleSaveTemplate} id="save-template" className="btn btn-sm btn-dark mr-2">Guardar</button>
                                            <Link to={"/invitacion/show/" + this.state.idEvento}><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
                                        </div>

                                    </div>

                                    <div className="row justify-content-md-center">
                                        <div className="col-sm-4" id="contenedor-plantilla" style={frame}>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/**esto de abajo es de php, es el texto que cambia con el menu */}
                            <footer className="content-wrapper-footer">
                                <span>{this.state.footer}</span>
                            </footer>
                        </div>
                    </div>
                    {
                        this.props.error &&
                        sweetalert(`${this.props.error} Consulte al Administrador.`, 'error', 'sweet')
                    }
                </div>
            );
        }
    }
}

const mapStateToProps = (reducers) => {
    return reducers.plantillas;
};

export default connect(mapStateToProps, traerPlantillas)(Show);