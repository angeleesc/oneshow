import React, { Component } from "react";
import CreatableSelect from 'react-select/creatable';
import { connect } from 'react-redux';
import { getEventHashtags, updateEventHashtags } from './../../../../redux/actions/social-wall';

const components = {
  DropdownIndicator: null,
};

const createOption = label => ({
  label, 
  value: label,
});

class RedesSociales extends Component {
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
      this.props.getEventHashtags(this.props.eventoId)
        .then(({ hashtagsTwitter, hashtagsInstagram }) => this.setState({
          twitterHashtags: hashtagsTwitter.map(createOption),
          instagramHashtags: hashtagsInstagram.map(createOption),
        }));
    }

    componentDidUpdate (prevProps, prevState) {
      if (this.state.twitterHashtags === null) {
        this.setState({
          twitterHashtags: [],
        });
      } else if (this.state.instagramHashtags === null) {
        this.setState({
          instagramHashtags: [],
        });
      }
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
          
          this.setState((state) => ({
            twitterValue: '',
            twitterHashtags: [...state.twitterHashtags, createOption(twitterValue)],
          }));
          
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
     * Guardar Hashtags asignados
     * 
     * @return {void}
     */
    handleClick () {
      const eventId = this.props.eventoId;
      const twitter = this.state.twitterHashtags.map(hashtag => hashtag.value);
      const instagram = this.state.instagramHashtags.map(hashtag => hashtag.value);

      console.log('hashtags', twitter, instagram);

      this.props.updateEventHashtags(eventId, twitter, instagram)
        .then(res => {
          console.log('done');
        })
        .catch(err => {
          console.log('err', err);
        })
    }

    render() {
      const { twitterValue, twitterHashtags, instagramValue, instagramHashtags } = this.state;

      return (
        <div>
          <div id="sweet" className="container-fluid">
            <div className="alert alert-primary mb-4" role="alert">
              <i className="fas fa-info-circle"></i>&nbsp;
              Ingrese las palabras que serám buscadas como <b>#hashtags</b> para el evento
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

const mapDispatchToProps = dispatch => ({
  getEventHashtags: (eventId) => dispatch(getEventHashtags(eventId)),
  updateEventHashtags: (eventId, twitter, instagram) => dispatch(updateEventHashtags(eventId, twitter, instagram)),
});


export default connect(null, mapDispatchToProps, null, { forwardRef: true })(RedesSociales);