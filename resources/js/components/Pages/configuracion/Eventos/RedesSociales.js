import React, { Component } from "react";
import axios from "axios";

export default class RedesSociales extends Component {
    constructor(props) {
        super(props);

        this.hashtagsTwitter = [];
        this.hashtagsInstagram = [];

        this.state = {
            isLoading: false,
            opcion: "Empresas",
            api_token: localStorage.getItem("api_token"),
            usuario: JSON.parse(localStorage.getItem("usuario"))
        };

        this.handleClick = this.handleClick.bind(this);
        this.enviarHashtagsDelEvento = this.enviarHashtagsDelEvento.bind(this);
        this.consultarHashtagsDelEvento = this.consultarHashtagsDelEvento.bind(this);
        this.agregarValorAlCampo = this.agregarValorAlCampo.bind(this);
        this.obtenerValorGuardado = this.obtenerValorGuardado.bind(this);

        this.estiloIconoBoton = {
            marginRight: '5px'
        }

        this.estiloBotonTwitter = {
            'width': '119px'
        }
    }

    componentDidMount() {
        this.consultarHashtagsDelEvento();
    }

    /**
     * Consultar Hashtags asignados al servidor
     * 
     * @return {void}
     */
    consultarHashtagsDelEvento() 
    {
        this.isLoading = true;

        axios.get('api/eventos/redes-sociales/consultar?eventoId=' + this.props.eventoId, {
            headers: {
                Authorization: this.state.api_token
            }
        }).then(respuesta => {
            if (respuesta.status === 200) {
                this.isLoading = false;

                this.hashtagsTwitter = (respuesta.data.hashtagsTwitter) ? JSON.parse(respuesta.data.hashtagsTwitter) : [];
                this.hashtagsInstagram = (respuesta.data.hashtagsInstagram) ? JSON.parse(respuesta.data.hashtagsInstagram) : [];

                this.agregarValorAlCampo('Twitter');
                this.agregarValorAlCampo('Instagram');

                return
            }

            sweetalert(
                'Problema con la conexión',
                'error',
                'sweet'
            );
        })
    }

    /**
     * Enviar Hashtags asignados al servidor
     * 
     * @return {void}
     */
    enviarHashtagsDelEvento() 
    {
        let datosDelFormulario = new FormData();
        datosDelFormulario.append("eventoId", this.props.eventoId);
        datosDelFormulario.append("HashtagsTwitter", JSON.stringify(this.hashtagsTwitter));
        datosDelFormulario.append("HashtagsInstagram", JSON.stringify(this.hashtagsInstagram));

        this.isLoading = true;

        axios.post('api/eventos/redes-sociales/actualizar', datosDelFormulario, {
            headers: {
                Authorization: this.state.api_token
            },
        }).then(respuesta => {
            if (respuesta.status === 200) {
                this.isLoading = false;

                setTimeout(() => window.scrollTo(0, 0), 2000);
            }
        })
    }

    /**
     * Obtener valores de la propiedad requerida
     * 
     * @param {string} redSocial
     * @return {array}
     */
    obtenerValorGuardado(redSocial) {
        return this["hashtags" + redSocial];
    }
    
    /**
     * Guardar Hashtags asignados
     * 
     * @return {void}
     */
    handleClick() {
        if (!this.camposEstanVacios()) {
            this.guardarHashtags('Twitter');
            this.guardarHashtags('Instagram');

            this.enviarHashtagsDelEvento();

            return
        }

        this.alertaCamposVacios();
    }

    /**
     * Verificar si los campos estan vacios
     * 
     * @return {boolean}
     */
    camposEstanVacios() {
        const valorCampoHashtagsTwitter = document.getElementById("campoHashtagsTwitter").value;
        const valorCampoHashtagsInstagram = document.getElementById("campoHashtagsInstagram").value;
        
        return !valorCampoHashtagsTwitter && !valorCampoHashtagsInstagram;
    }

    /**
     * Guardar Hashtags recolectados
     * 
     * @param {string} redSocial
     * @return {void}
     */
    guardarHashtags(redSocial) {
        const hashtags = this.obtenerHashtags(redSocial);

        const nombreDePropiedad = "hashtags" + redSocial;

        this[nombreDePropiedad] = hashtags;
    }

    /**
     * Obtener los Hashtags del campo
     * 
     * @param {string} redSocial
     * @return {array}
     */
    obtenerHashtags(redSocial) {
        return document.getElementById("campoHashtags" + redSocial)
            .value
            .replace(" ", "")
            .split(",")
            .map((hashtag) => (hashtag && hashtag[0] != "#") ? "#" + hashtag : hashtag)
            .filter((hashtag) => hashtag !== "");
    }

    /**
     * Levantar alerta de campos vacios
     * 
     * @return {void}
     */
    alertaCamposVacios() {
        sweetalert(
            'Por favor ingrese los Hashtags del Evento',
            'error',
            'sweet'
        );
    }

    /**
     * Mostrar Hashtags registrados para el evento
     * 
     * @param {string} redSocial
     * @return {void}
     */
    agregarValorAlCampo(redSocial) {
        document.getElementById("campoHashtags" + redSocial).value = this.obtenerValorGuardado(redSocial).join();
    }

    render() {
        return (
            <div>
                <div id="sweet" className="container-fluid">

                    <div className="alert alert-primary mb-4" role="alert">
                        <i className="fas fa-info-circle"></i>&nbsp;
                        Ingrese los #Hashtags separados por coma (,)
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label col-form-label-sm">
                            <i className="fab fa-twitter" style={this.estiloIconoBoton}></i> Twitter
                        </label>
                        <div className="col-sm-4">
                            <input 
                                type="text"
                                id="campoHashtagsTwitter"
                                className="form-control form-control-sm"
                                placeholder="Ingrese los hashtags para Twitter"
                                autoComplete="false"
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label col-form-label-sm">
                            <i className="fab fa-instagram" style={this.estiloIconoBoton}></i> Instagram
                        </label>
                        <div className="col-sm-4">
                            <input 
                                type="text"
                                id="campoHashtagsInstagram"
                                className="form-control form-control-sm"
                                placeholder="Ingrese los hashtags para Instagram"
                                autoComplete="false"
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
