import React, { Component } from "react";
import CreatableSelect from 'react-select/creatable';
import axios from "axios";

const components = {
  DropdownIndicator: null,
};

const createOption = label => ({
  label, 
  value: label,
});

export default class RedesSociales extends Component {
    constructor(props) {
        super(props);

        this.state = {
          twitterValue: '',
          twitterHashtags: [],
          instagramValue: '',
          instagramHashtags: [],
          isLoading: false,
          opcion: "Empresas",
          api_token: localStorage.getItem("api_token"),
          usuario: JSON.parse(localStorage.getItem("usuario"))
        };

        this.handleHashtagChange = this.handleHashtagChange.bind(this);
        this.handleHashtagSubmit = this.handleHashtagSubmit.bind(this);
        this.handleKeyDownTwitter = this.handleKeyDownTwitter.bind(this);
        this.handleKeyDownInsta = this.handleKeyDownInsta.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.consultarHashtagsDelEvento();
    }

    handleHashtagSubmit (social, value) {
      this.setState({ [`${social}Hashtags`]: value });
    }

    handleHashtagChange (social, value) {
      this.setState({ [`${social}Value`]: value });
    }

    handleKeyDownTwitter (event) {
      const { twitterValue, twitterHashtags } = this.state;

      if (!twitterValue)
        return;

      switch (event.key) {
        case 'Enter':
        case 'Tab':
          
          this.setState({
            twitterValue: '',
            twitterHashtags: [...twitterHashtags, createOption(twitterValue)],
          });
          
          event.preventDefault();
      }
    }

    handleKeyDownInsta (event) {
      const { instagramValue, instagramHashtags } = this.state;

      if (!instagramValue)
        return;

      switch (event.key) {
        case 'Enter':
        case 'Tab':
          
          this.setState({
            instagramValue: '',
            instagramHashtags: [...instagramHashtags, createOption(instagramValue)],
          });
          
          event.preventDefault();
      }
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
     * Guardar Hashtags asignados
     * 
     * @return {void}
     */
    handleClick () {
        if (!this.camposEstanVacios()) {
            this.guardarHashtags('Twitter');
            this.guardarHashtags('Instagram');

            this.enviarHashtagsDelEvento();

            return
        }

        this.alertaCamposVacios();
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

    render() {
      const { twitterValue, twitterHashtags, instagramValue, instagramHashtags } = this.state;

      return (
        <div>
          <div id="sweet" className="container-fluid">
            <div className="alert alert-primary mb-4" role="alert">
              <i className="fas fa-info-circle"></i>&nbsp;
              Ingrese los <b>#Hashtags</b> para el evento
            </div>
            <div className="form-group">
              <label>
                <i className="fab fa-twitter"></i> 
                {`  `} Twitter
              </label>
              <CreatableSelect 
                components={components}
                inputValue={twitterValue}
                menuIsOpen={false}
                isClearable
                isMulti
                onChange={(value) => this.handleHashtagSubmit('twitter', value)}
                onInputChange={(value) => this.handleHashtagChange('twitter', value)}
                onKeyDown={this.handleKeyDownTwitter}
                placeholder="Escribe algo y presiona enter..."
                value={twitterHashtags}
              />
            </div>
            <div className="form-group">
              <label>
                <i className="fab fa-instagram"></i>
                {`  `} Instagram
              </label>
              <CreatableSelect 
                components={components}
                inputValue={instagramValue}
                menuIsOpen={false}
                isClearable
                isMulti
                onChange={(value) => this.handleHashtagSubmit('instagram', value)}
                onInputChange={(value) => this.handleHashtagChange('instagram', value)}
                onKeyDown={this.handleKeyDownInsta}
                placeholder="Escribe algo y presiona enter..."
                value={instagramHashtags}
              />
            </div>
          </div>
        </div>
      );
    }
}
