import React from 'react';
import ConsoleControl from './../molecules/ConsoleControl';
import Loop from './../molecules/Loop';
import Time from './../molecules/Time';
import Vibrate from './../molecules/Vibrate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFilesFromEvent } from './../../redux/actions/show';
import DropdownImageSelector from './../molecules/DropdownImageSelector';
import { displayAlertMessage } from './../../redux/actions/alert';
import { 
  endRunningShow,
  setCurrentScene, 
  updateCurrentLoop,
  endCurrentSceneTime,
} from './../../redux/actions/show';
import { connect } from 'react-redux';

class ImageControls extends React.Component {  
  constructor (props) {
    super(props);

    this.state = {
      loop: 0,
      time: 0,
      files: [],
      isSelectorOpen: false,
      vibrate: false,
    }

    this.handleImageSelect = this.handleImageSelect.bind(this);

    // Functions to control execution
    this.startCommand = this.startCommand.bind(this);
    this.endCurrentShow = this.endCurrentShow.bind(this);
    this.validateConfiguration = this.validateConfiguration.bind(this);

    // Class attributes
    this.interval = '';
    this.timeout = '';
    this.step = 0;
  }

  componentDidMount () {
    this.props.getFilesFromEvent('Imagen').then(files => {
      this.setState({ 
        files: files.map(file => ({...file, selected: false }))
      });
    })
    .catch(e => {
      console.log('Error', e);
    })
  }

  componentWillUnmount () {
    clearInterval(this.interval);
    clearTimeout(this.timeout);

    this.props.endRunningShow('flash');
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.selectedSceneId === null && this.props.selectedSceneId !== null) {
      const { image } = this.props.selectedScene;

      if (image.enabled) {
        this.setState({
          loop: image.loop,
          time: image.time,
          files: prevState.files.map(file => {
            let img = image.files.find(f => file._id === f._id);

            return img ? img : file;
          }),
          vibrate: image.vibrate,
        }, () => this.startCommand())
      }
    }
  }

  endCurrentShow () {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
    
    this.props.endRunningShow('image');

    this.props.submitCommand(`REM,0,1,IMG`);
  }

  handleImageSelect (imageId) {
    this.setState(state => ({
      files: state.files.map(file => {
        if (file._id === imageId)
          return {...file, selected: !file.selected };

        return file;
      })
    }));
  }

  startCommand () {
    // Checking if the configuration is valid
    const selected = this.state.files.filter(file => file.selected);    
    if (!this.validateConfiguration(selected))
      return;

    // End previous execution
    this.endCurrentShow();

    this.props.setCurrentScene('image', { 
      files: selected,
      loop: this.state.loop,
      time: this.state.time,
      vibrate: this.state.vibrate,
    });

    // First command execution
    const firstCommand = `IMG,1,${this.step},${selected[this.step].NombreCompleto},${this.state.vibrate ? 1 : 0}`;
    this.props.submitCommand(firstCommand);

    if (this.step === selected.length - 1) {
      this.step = 0;
    } else {
      this.step = this.step + 1;
    }

    // Executing a command every time a
    // beat is produced
    this.interval = setInterval(() => {
      const { current } = this.props.image;

      if (current.loop === 0)
        return this.endCurrentShow();

      let id = this.step;
      let image = current.files[this.step].NombreCompleto;
      let moment = 1;
      let vibrate = current.vibrate ? 1 : 0;

      let command = `IMG,${moment},${id},${image},${vibrate}`;

      this.props.submitCommand(command);

      if (this.step === (current.files.length - 1)) {
        this.step = 0;

        if (current.loop > 0) {
          this.props.updateCurrentLoop('image', current.loop - 1);
        }
      } else {
        this.step = this.step + 1;
      }
    }, this.state.time * 1000);
  }

  validateConfiguration (selected) {
    const { loop, time } = this.state;

    if (selected.length <= 0) {
      this.props.displayAlertMessage('', 'No seleccionó ningúna imagen para empezar el show', 'error');
      return false;
    }
    
    if (loop === 0) {
      this.props.displayAlertMessage('', 'Las imágenes deben repetirse por lo menos una vez', 'error');
      return false;
    }

    if (time === 0) {
      this.props.displayAlertMessage('', 'Seleccione un tiempo entre imágenes', 'error');
      return false;
    }
  
    return true;
  }

  render () {

    const images = this.state.files.map(file => ({
      id: file._id,
      selected: file.selected,
      url: `storage/${file.Path}`
    }));

    return (
      <React.Fragment>
        <ConsoleControl 
          name="imagen"
          icon={this.props.image.icon}
          color={this.props.image.color}
          running={this.props.image.running}
          current={this.props.image.current}
        />
        <button 
          onClick={this.startCommand}
          className="btn btn-sm btn-block btn-running mt-3 py-0 rounded"
        >
          <FontAwesomeIcon icon="paper-plane" color="#fff"/>
        </button>
        {this.props.image.current && 
          <button 
            onClick={this.endCurrentShow}
            className="btn btn-sm btn-block btn-danger mt-3 py-0 rounded"
          >
            <FontAwesomeIcon icon="stop" color="#fff"/>
          </button>
        }
        <div className="mt-1">
          <button 
            onClick={e => this.setState(state => ({ isSelectorOpen: !state.isSelectorOpen }))}
            className="btn btn-block btn-primary mt-3 py-0 rounded btn-txt"
          >
            {this.state.isSelectorOpen ? (
              <FontAwesomeIcon icon="sort-up" color="#fff"/>
              ) : (
              <FontAwesomeIcon icon="sort-down" color="#fff"/>
            )}
          </button>
        </div>
        <div className="mt-3">
          <DropdownImageSelector
            images={images}
            open={this.state.isSelectorOpen}
            handleSelect={this.handleImageSelect}
          />
        </div>
        <Loop 
          value={this.state.loop}
          onChange={loop => this.setState({ loop })}
        />
        <Time 
          value={this.state.time}
          onChange={time => this.setState({ time })}
        />
        <Vibrate 
          vibrate={this.state.vibrate}
          onChange={() => this.setState(state => ({ vibrate: !state.vibrate }))}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ show }) => ({
  image: show.image,
  selectedSceneId: show.scenes.selected,
  selectedScene: show.scenes.items.find(item => {
    return item._id === show.scenes.selected;
  }),
});

const mapDispatchToProps = dispatch => ({
  getFilesFromEvent: (type) => dispatch(getFilesFromEvent(type)),
  setCurrentScene: (scene, current) => dispatch(setCurrentScene(scene, current)),
  updateCurrentLoop: (scene, loop) => dispatch(updateCurrentLoop(scene, loop)),
  endCurrentSceneTime: scene => dispatch(endCurrentSceneTime(scene)),
  endRunningShow: (scene) => dispatch(endRunningShow(scene)),
  displayAlertMessage: (title, text, type = 'info') => dispatch(displayAlertMessage(title, text, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageControls);