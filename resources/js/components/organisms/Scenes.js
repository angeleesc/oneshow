import React from 'react';
import ColorSelector from './../molecules/ColorSelector';
import ColorScene from './ColorScene';
import FlashScene from './FlashScene';
import AudioScene from './AudioScene';
import VideoScene from './VideoScene';
import ImageScene from './ImageScene';
import DropdownIconSelector from './../molecules/DropdownIconSelector';
import SceneList from './SceneList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createScene } from './../../redux/actions/show';
import { connect } from 'react-redux';
import classnames from 'classnames';
 
class Scenes extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      name: '',
      icon: 'star',
      color: '#5e72e4',
      loading: false,
      error: '',
    };

    // Refs
    this.nameRef = React.createRef();
    this.colorRef = React.createRef();
    this.flashRef = React.createRef();
    this.audioRef = React.createRef();
    this.videoRef = React.createRef();
    this.imageRef = React.createRef();

    // Functions
    this.setColor = this.setColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  setColor (color) {
    this.setState({ color });
  }

  handleSubmit (e) {
    e.preventDefault();

    const colorConf = this.colorRef.current.getConfiguration();
    const flashConf = this.flashRef.current.getConfiguration();
    const audioConf = this.audioRef.current.getConfiguration();
    const videoConf = this.videoRef.current.getConfiguration();
    const imageConf = this.imageRef.current.getConfiguration();
    const name = this.nameRef.current.value;
    const { color, icon } = this.state;

    if (colorConf.failure || flashConf.failure || audioConf.failure || videoConf.failure || imageConf.failure) {
      return;
    }

    if (!colorConf.enabled && !flashConf.enabled && !audioConf.enabled && !videoConf.enabled && !imageConf.enabled) {
      return this.setState({ error: 'La escena debe contener algún tipo de comando activo' })
    }

    if (name.length === 0) {
      return this.setState({ error: 'El nombre es necesario para poder guardar la escena' });
    }
    
    if (icon.length === 0) {
      return this.setState({ error: 'El nombre es necesario para poder guardar la escena' });
    }
    
    if (color.length === 0) {
      return this.setState({ error: 'Un color es necesario para poder guardar la escena' });
    }

    this.setState({ loading: true });

    const scene = { 
      name, 
      icon,
      iconColor: color,
      color: colorConf,
      flash: flashConf,
      audio: audioConf,
      video: videoConf,
      image: imageConf,
    }

    this.props.createScene(scene).then(createdScene => {
      this.colorRef.current.cleanConfiguration();
      this.flashRef.current.cleanConfiguration();
      this.audioRef.current.cleanConfiguration();
      this.videoRef.current.cleanConfiguration();
      this.imageRef.current.cleanConfiguration();
      
      this.setState({ loading: false });
    })
    .catch(e => {
      this.setState({ loading: false });
      
      console.log('error', e)
    });
  }

  render () {
    const buttonIcon = this.state.loading ? 'sync' : 'save';
    const rowStyle = classnames('row', {
      'mb-1': this.state.error !== '',
      'border': this.state.error !== '',
      'border-danger': this.state.error !== '',
      'rounded': this.state.error !== ''
    })

    return (
      <div>
        <div className={rowStyle}>
          {this.state.error !== '' &&
            <p className="text-center text-danger my-1" style={{ fontSize: '12px', width: '100%' }}>
              {this.state.error}
            </p>
          }
          <div className="col-md-4">
            <h5 className="text-center mb-1 mt-2 oneshow-title">
              Nombre
            </h5>
            <div className="form-group">
              <input 
                type="text"
                name="name"
                ref={this.nameRef}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <h5 className="text-center mb-1 mt-2 oneshow-title">
              Icono
            </h5>
            <DropdownIconSelector
              icon={this.state.icon}
              color={this.state.color}
              onChange={(icon) => this.setState({ icon })}
            />
          </div>
          <div className="col-md-4">
            <h5 className="text-center mb-1 mt-2 oneshow-title">
              Color
            </h5>
            <ColorSelector 
              onSubmit={this.setColor}
            />
          </div>
        </div>
        <div>
          <ColorScene
            ref={this.colorRef}
            containerStyle="bg-dark py-3 px-3"
          />
          <FlashScene
            ref={this.flashRef}
            containerStyle="py-3 px-3"
          />
          <AudioScene
            ref={this.audioRef}
            containerStyle="bg-dark py-3 px-3"
          />
          <VideoScene
            ref={this.videoRef}
            containerStyle="py-3 px-3"
          />
          <ImageScene
            ref={this.imageRef}
            containerStyle="bg-dark py-3 px-3"
          />
          <div className="text-right my-3">
            <button 
              onClick={this.handleSubmit}
              disabled={this.state.loading}
              className="btn btn-primary btn-sm rounded"
            >
              Guardar Escena {` `}
              <FontAwesomeIcon 
                color="#fff" 
                icon={buttonIcon} 
                spin={this.state.loading}
              />
            </button>
          </div>
        </div>
        {this.props.areScenesCreated && 
          <div className="pb-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)'}}>
            <h1 className="display-4">Escenas</h1>
            <SceneList />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  areScenesCreated: state.show.scenes.items.length === 0 ? false : true,
})

const mapDispatchToProps = dispatch => ({
  createScene: (scene) => dispatch(createScene(scene))
});

export default connect(mapStateToProps, mapDispatchToProps)(Scenes);