import axios from 'axios';
import swal from "sweetalert2";
import Menu from "../components/Menu";
import Header from "../components/Header";
import  React, { Component } from 'react';
import { connect } from 'react-redux';
import Mensaje from "../atoms/Mensaje";
import { 
    getEventos, 
    getCompanies,
    setCompany,
    setEvent,
    getEventsFromCompany 
  } from './../../redux/actions/multimedia';
import { mostrarElementoDeCarga, ocultarElementoDeCarga } from "./../../redux/actions/loader";

/*
- Pasar datos al Iframe (Array)
- Hacer endpoint para guardar y consultar esas configuraciones
*/


class SocialWall extends Component {

    constructor(props) {
        super(props);

        this.mostrarFiltros = true;

        this.state = {
            eventoId: "",
            mostrarIframe: false,
            api_token: localStorage.getItem("api_token"),
            usuario: JSON.parse(localStorage.getItem("usuario")),
            hashtagsTwitter: [],
            hashtagsInstagram: [],
            estilosIframe: {
                width: "inherit",
                border: "none"
            },
            urlParaIframe: window.location.protocol + "//" + window.location.hostname + "/Lib"
        };

        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handleEventChange = this.handleEventChange.bind(this);
        this.consultarHashtagsDelEvento = this.consultarHashtagsDelEvento.bind(this);
        this.activarIframe = this.activarIframe.bind(this);
        this.colocarPantallaCompleta = this.colocarPantallaCompleta.bind(this);
        this.editarFiltroDeTipoDeContenido = this.editarFiltroDeTipoDeContenido.bind(this);
        this.agregarEventoPantallaCompletaAIframe = this.agregarEventoPantallaCompletaAIframe.bind(this);   
        this.existenHashtagsParaEvento = this.existenHashtagsParaEvento.bind(this);
    }

    /**
     * Ejecutar despues del Render
     * 
     * @return {void}
     */
    componentDidMount () {
        this.props.mostrarElementoDeCarga();
        this.props.getCompanies().then(() => this.props.ocultarElementoDeCarga());
    }

    handleCompanyChange (e) {
        const { value } = e.target;
  
        if (!value) {
          this.props.setCompany('');
          this.props.setEvent('');
        } else {
          this.props.setCompany(value);
          this.props.getEventsFromCompany(value);
        }
    }
  
    handleEventChange (e) {
        const { value } = e.target;
  
        if (!value) {
            this.props.setEvent('');
            return
        }
  
        this.props.setEvent(value);
        this.setState({ eventoId: value },
        () => this.consultarHashtagsDelEvento());
    }

    /**
     * Consultar Hashtags asignados al evento
     * 
     * @return {void}
     */
    consultarHashtagsDelEvento() {
        this.props.mostrarElementoDeCarga();
        
        axios.get('api/eventos/redes-sociales/consultar?eventoId=' + this.state.eventoId, {
            headers: {
                Authorization: this.state.api_token
            }
        }).then(respuesta => {
            if (respuesta.status === 200) {

                let hashtagsTwitter = (respuesta.data.hashtagsTwitter) ? JSON.parse(respuesta.data.hashtagsTwitter) : [];
                let hashtagsInstagram = (respuesta.data.hashtagsInstagram) ? JSON.parse(respuesta.data.hashtagsInstagram) : [];

                this.props.ocultarElementoDeCarga();

                this.setState({
                    hashtagsTwitter,
                    hashtagsInstagram,
                    mostrarIframe: true
                },
                () => this.activarIframe());

                return
            }

            swal(
                'Problema con la conexión',
                'error',
                'sweet'
            );
        })
    }

    /**
     * Lanzar Iframe con la libreria de Social Wall
     * 
     * @return {void}
     */
    activarIframe() {
        // Agregar informacion al URL
        if (this.existenHashtagsParaEvento()) {
            this.props.mostrarElementoDeCarga();
            document.getElementById("iFrameSocialWall").setAttribute("src", this.state.urlParaIframe);
        }
    }

    /**
     * Colocar iFrame de Social Wall en pantalla completa
     * 
     * @return {void}
     */
    colocarPantallaCompleta() {
        let elementoIframe = document.getElementById("iFrameSocialWall");

        if (elementoIframe.requestFullscreen) {
            elementoIframe.requestFullscreen();
        } else if (elementoIframe.mozRequestFullScreen) { /* Firefox */
            elementoIframe.mozRequestFullScreen();
        } else if (elementoIframe.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elementoIframe.webkitRequestFullscreen();
        } else if (elementoIframe.msRequestFullscreen) { /* IE/Edge */
            elementoIframe.msRequestFullscreen();
        }
    }

    /**
     * Agregar|Retirar Filtro de tipo de contenido (Twitter o Instagram o ambos)
     * 
     * @return {void}
     */
    editarFiltroDeTipoDeContenido() {

        this.mostrarFiltros = !this.mostrarFiltros;

        document.getElementById('iFrameSocialWall')
            .contentDocument
            .getElementsByClassName("filter-items")[0]
            .style
            .visibility = (this.mostrarFiltros) ? "visible" : "hidden";
    }

    /**
     * Agregar evento de Full Screen a Iframe
     * 
     * @return {void}
     */
    agregarEventoPantallaCompletaAIframe() {

        this.props.ocultarElementoDeCarga();

        document.getElementById('iFrameSocialWall').addEventListener('webkitfullscreenchange', () => {
            this.editarFiltroDeTipoDeContenido();
        });
    }

    /**
     * Comprobar si existen hashtags para el evento
     * 
     * @return {boolean}
     */
    existenHashtagsParaEvento() {
        return (this.state.hashtagsTwitter.length > 0 || this.state.hashtagsInstagram.length > 0) ? true : false;
    }

    render() {
        return (
            <div>
                <Menu usuario={this.state.user} />
                <Header usuario={this.state.user} history={this.props.history} />

                <div className="content-wrapper">
                    <header className="page-header">
                        <div className="container-fluid">
                            
                            <div className="row">
                                <div className="col-sm-6 col-md-6">
                                    <div className="d-flex">
                                        <div className="my-2">
                                            <h1 className="page-header-heading">
                                                <div>
                                                    <i className="fas fa-photo-video page-header-heading-icon" />
                                                    Social Wall
                                                </div>
                                            </h1>
                                        </div>

                                        <div className="col-sm-9">
                                            <form>
                                                <div className="form-row">
                                                <div className="col">
                                                    <select
                                                    name="company"
                                                    className="form-control form-control-sm"
                                                    onChange={this.handleCompanyChange}
                                                    value={this.state.company}
                                                    >
                                                    <option value="">Selecione una Empresa</option>
                                                    {this.props.companies.map(company => (
                                                        <option key={company.id} value={`${company.id}`}>
                                                        {company.name}
                                                        </option>
                                                    ))}
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <select 
                                                        name="event"
                                                        className="form-control form-control-sm" 
                                                        onChange={this.handleEventChange}
                                                        value={this.props.eventId}
                                                    >
                                                    <option value="">Seleccione un Evento</option>
                                                    {this.props.eventos.map(event => (
                                                        <option key={event.id} value={`${event.id}`}>
                                                        {event.name}
                                                        </option>
                                                    ))}
                                                    </select>
                                                </div>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>

                                <div className="ml-auto">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-dark ml-4"
                                        onClick={this.colocarPantallaCompleta}
                                    >
                                        <i className="fas fa-arrows-alt" />
                                        &nbsp;Fullscreen
                                    </button>
                                </div>

                            </div>
                        </div>
                    </header>

                    <div id="sweet" className="container-fluid">
                        <>
                            {!this.state.mostrarIframe &&
                                <Mensaje
                                    icono="fas fa-photo-video"
                                    texto="Seleccione un evento para el Social Wall"
                                />
                            }
                            {(this.state.mostrarIframe && !this.existenHashtagsParaEvento()) &&
                                <Mensaje
                                    icono="fas fa-exclamation-circle"
                                    texto="No existen hashtags registrados en el evento"
                                />
                            }
                            {(this.state.mostrarIframe && this.existenHashtagsParaEvento()) &&
                                <iframe
                                    id="iFrameSocialWall"
                                    style={this.state.estilosIframe}
                                    onLoad={this.agregarEventoPantallaCompletaAIframe}
                                ></iframe>
                            }
                        </>
                    </div>

                    {/**esto de abajo es de php, es el texto que cambia con el menu */}
                    <footer className="content-wrapper-footer"></footer>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    companyId: state.multimedia.companyId,
    eventId: state.multimedia.eventId,
    companies: state.multimedia.companies,
    eventos: state.multimedia.eventos
});

const mapDispatchToProps = dispatch => ({
    setCompany: (companyId) => dispatch(setCompany(companyId)),
    setEvent: (eventId) => dispatch(setEvent(eventId)),
    getCompanies: () => dispatch(getCompanies()),
    getEvents: (userId, apiToken) => dispatch(getEventos(userId, apiToken)),
    getEventsFromCompany: (companyId) => dispatch(getEventsFromCompany(companyId)),
    mostrarElementoDeCarga: () => dispatch(mostrarElementoDeCarga()),
    ocultarElementoDeCarga: () => dispatch(ocultarElementoDeCarga())
});

export default connect(mapStateToProps, mapDispatchToProps)(SocialWall);