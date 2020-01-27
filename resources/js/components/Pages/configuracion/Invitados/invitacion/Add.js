import React, { Component, Fragment, createRef } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link, Redirect } from "react-router-dom";
import FormInvitacion from './FormInvitacion';
import FormPlantilla from './FormPlantilla'
import { connect } from 'react-redux'
import * as plantillasActions from '../../../../../redux/actions/plantillas'
import * as invitacionesActions from '../../../../../redux/actions/invitaciones'
import * as eventosActions from '../../../../../redux/actions/eventos'
const {
    guardarInvitacion,
    handleInputImagenInvitacion,
    handleInputPdfInvitacion,
    handleInputTipoInvitacion,
    handleInputPlantillaPdfInvitacion,
    traerInvitacionesEventoID,
    limpiarForm
} = invitacionesActions;
const { traerPlantillas } = plantillasActions
const { traerEventos } = eventosActions
class Show extends Component {
    constructor(props) {

        super(props);
        this.state = {
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            archivos: [],
            evento: "",
            empresa: "",
            tipo: "",
            opcion: "Invitacion",
            footer: "Footer",
            url: process.env.MIX_CONSOLE_URL
        };
        this.templateSelect = createRef();
        this.imagenRef = createRef();
        this.pdfRef = createRef();
        this.pdfPlantillaRef = createRef();
        // this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmitFormJPGPDF = this.handleSubmitFormJPGPDF.bind(this);
        this.listPlantillas = this.listPlantillas.bind(this);
        this.handleSaveTemplate = this.handleSaveTemplate.bind(this);

    }

    async componentDidMount() {

        const { match: { params: { id } } } = this.props

        if (!this.props.eventos.eventos.length) {
            //si no existen los eventos los traemos del reducer
            await this.props.traerEventos()
        }

        const evento = this.props.eventos.eventos.filter(e => (e._id == id))
        this.setState({
            eventoNombre: evento[0].Evento,
        })

        if (!this.props.plantillas.length) {
            this.props.traerPlantillas(this.state.api_token)
        }

        const keyEvento = this.props.eventos.eventos.map((e, key) => {
            if (e._id == id) {
                return key
            }
        })
        let key = keyEvento.filter(k => k != undefined)//seleccionamos la key del evento activo

        if (!('invitacion_key' in evento[0])) {
            await this.props.traerInvitacionesEventoID(id, key[0])

        }

        this.setState({
            keyEvento: this.props.eventos.eventos[key[0]].invitacion_key,
            eventoSelected: evento[0]
        })

    }

    componentWillUnmount(){
        this.props.handleInputImagenInvitacion("")
        this.props.handleInputPdfInvitacion("")
        this.props.handleInputPlantillaPdfInvitacion("")
        this.props.handleInputTipoInvitacion("")

    }
    handleSaveTemplate() {

        const { match: { params: { id } } } = this.props
        const idPlantilla = this.templateSelect.current.value;

        if (idPlantilla !== "0") {
            let formData = new FormData();
            formData.append("Evento_id", id);
            formData.append("idPlantilla", idPlantilla);
            formData.append("archivopdf", this.props.invitaciones.inputPlantillaPdf ? this.props.invitaciones.inputPlantillaPdf : "");

            this.props.guardarInvitacion(formData, id, this.state.keyEvento, true)

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


    handleInputChange(event) {
        const target = event.target
        const id = target.id
        const value = target.value

        if (id == "archivoimg") {

            const imagenInvitacion = this.imagenRef.current.files[0]
            this.props.handleInputImagenInvitacion(imagenInvitacion)
        }

        if (id == "archivopdf") {

            const pdfInvitacion = this.pdfRef.current.files[0]
            this.props.handleInputPdfInvitacion(pdfInvitacion)
        }


        if (id == "archivoplantillapdf") {
            const pdfIPlantillainvitacion = this.pdfPlantillaRef.current
            const ext = pdfIPlantillainvitacion.files[0].type.split("/")[1]
            if (ext == 'pdf') {
             
                 this.props.handleInputPlantillaPdfInvitacion(pdfIPlantillainvitacion.files[0])
            } else {
                sweetalert(
                    "Archivo no soportado debe ser un archivo PDF",
                    "error",
                    "sweet"
                );
                return false;
            }
           
        }


        if (id == "tipo") {
            this.props.handleInputTipoInvitacion(value)
        }


    }

    handleSubmitFormJPGPDF(e) {
        const { match: { params: { id } } } = this.props
        e.preventDefault();
        let formData = new FormData();
        formData.append("tipo", this.props.invitaciones.inputTipo);
        formData.append("archivoimg", this.props.invitaciones.inputImagen);
        formData.append("archivopdf", this.props.invitaciones.inputPdf ? this.props.invitaciones.inputPdf : "");

        this.props.guardarInvitacion(formData, id, this.state.keyEvento, false)

    }

    listPlantillas() {
        const { plantillas } = this.props.plantillas
        if (plantillas.plantillas) {
            return (
                plantillas.plantillas.map((plantilla, key) => {
                    return <option key={key} value={plantilla._id} >Plantilla Modelo {plantilla.nombre}</option>
                })
            )
        }

    }
    render() {
        const { match: { params: { id } } } = this.props
        // console.log('props', this.props);

        if (this.props.invitaciones.error) {
            sweetalert(`${this.props.invitaciones.error}.`, 'error', 'sweet')

        }
        if (this.props.invitaciones.regresar) {
            sweetalert(`Se ha guardado exitosamente.`, 'success', 'sweet')
            setTimeout(() => {
                window.scrollTo(0, 0);
                this.props.history.push(`/invitacion/show/${id}`);
            }, 2000);
        }
        return (
            <Fragment>
                <Menu />
                <Header history={this.props.history} />
                <div className="content-wrapper">
                    <header className="page-header">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">
                                    <h1 className="page-header-heading">
                                        <Link to="/invitacion">
                                            <i className="fas fa-envelope-open-text sidebar-nav-link-logo" />
                                            &nbsp; Invitación
                                        </Link>{" "}
                                        / <Link to={`/invitacion/show/${id}`}>{this.state.eventoNombre}&nbsp; </Link>{" "}
                                        / Agregar Invitación
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
                                <FormInvitacion
                                    handleSubmitFormJPGPDFFormJPGPDF={this.handleSubmitFormJPGPDF}
                                    imagenRef={this.imagenRef}
                                    pdfRef={this.pdfRef}
                                    idEvento={id}
                                    hanldeInput={this.handleInputChange}
                                    tipo={this.handleChange}
                                    cargandoGuardar={this.props.invitaciones.cargando_guardar}
                                />
                            </div>
                            <div className="tab-pane fade" id="pills-plantilla" role="tabpanel" aria-labelledby="pills-plantilla-tab">
                                <FormPlantilla
                                    listarP={this.listPlantillas}
                                    evento={this.state.eventoSelected}
                                    selectRef={this.templateSelect}
                                    pdfPlantillaRef={this.pdfPlantillaRef}
                                    url={this.state.url}
                                    hanldeInput={this.handleInputChange}
                                    handleSubmit={this.handleSaveTemplate}
                                    idEvento={id}
                                />
                            </div>
                        </div>
                        <footer className="content-wrapper-footer">
                            {/* <span>{this.state.footer}</span> */}
                        </footer>
                    </div>
                </div>
            </Fragment>
        );
    }
}
const mapStateToProps = ({ plantillas, eventos, invitaciones }) => {
    return {
        plantillas,
        eventos,
        invitaciones
    }
}
const mapDispatchToProps = {
    traerPlantillas,
    traerEventos,
    handleInputImagenInvitacion,
    handleInputPdfInvitacion,
    handleInputTipoInvitacion,
    handleInputPlantillaPdfInvitacion,
    guardarInvitacion,
    traerInvitacionesEventoID,
    limpiarForm
};

export default connect(mapStateToProps, mapDispatchToProps)(Show);

