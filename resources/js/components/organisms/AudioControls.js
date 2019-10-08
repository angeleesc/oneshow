import React from 'react';
import ConsoleControl from './../molecules/ConsoleControl';
import Loop from './../molecules/Loop';
import Time from './../molecules/Time';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFilesFromEvent } from './../../redux/actions/show';
import { displayAlertMessage } from './../../redux/actions/alert';
import { 
  endRunningShow,
  setCurrentScene, 
  updateCurrentLoop,
  endCurrentSceneTime,
} from './../../redux/actions/show';
import { connect } from 'react-redux';

class AudioControls extends React.Component {  
  constructor (props) {
    super(props);

    this.state = {
      loop: 0,
      time: 0,
      files: [],
      selected: '',
    }

    // Functions to control execution
    this.startCommand = this.startCommand.bind(this);
    this.endCurrentShow = this.endCurrentShow.bind(this);
    this.validateConfiguration = this.validateConfiguration.bind(this);

    // Class attributes
    this.interval = '';
  }

  componentDidMount () {
    this.props.getFilesFromEvent('Audio').then(files => {
      this.setState({ files });
    })
    .catch(e => {
      console.log('Error', e);
    })
  }

  componentWillUnmount () {
    this.endCurrentShow();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.selectedSceneId === null && this.props.selectedSceneId !== null) {
      const { audio } = this.props.selectedScene;

      if (audio.enabled) {
        this.setState({
          loop: audio.loop,
          time: audio.time,
          selected: audio.selected,
        }, () => this.startCommand())
      }
    }
  }

  endCurrentShow () {
    clearInterval(this.interval);

    this.props.endRunningShow('audio');
  }

  startCommand () {
    // Checking if the configuration is valid
    if (!this.validateConfiguration())
      return;

    // End previous execution
    this.endCurrentShow();

    const selectedFile = this.state.files.find(audio => audio._id === this.state.selected);
    
    this.props.setCurrentScene('audio', {
      loop: this.state.loop,
      time: this.state.time,
      file: selectedFile,
    });

    // Executing a command every time a
    // beat is produced
    const interval = selectedFile.Duracion + (this.state.time * 1000);

    this.interval = setInterval(() => {
      const { current } = this.props.audio;

      if (current.loop === 0)
        return this.endCurrentShow();

      let id = 1;
      let audio = current.file.NombreCompleto;
      let moment = 1;
      let now = (new Date()).getTime();
      let end = now + 5000;

      let command = `AUD,${moment},${id},${audio},${now},${end}`;

      this.props.submitCommand(command);
      
      if (current.loop > 0) {
        this.props.updateCurrentLoop('audio', current.loop - 1);
      }
    }, interval);

    this.setState({
      bpm: 0,
      loop: 0,
      time: 0,
    });
  }

  validateConfiguration () {
    const { selected, loop, time } = this.state;

    if (selected === '') {
      this.props.displayAlertMessage('', 'Seleccione un archivo de audio', 'error');
      return false;
    }
    
    if (loop === 0 && time === 0) {
      this.props.displayAlertMessage('', 'Duración del comando no especificado', 'error');
      return false;
    }
  
    return true;
  }

  render () {
    const options = this.state.files.map(file => (
      <option key={file._id} value={file._id}>{file.NombreCompleto}</option>
    ));

    return (
      <React.Fragment>
        <ConsoleControl 
          name="audio"
          icon={this.props.audio.icon}
          color={this.props.audio.color}
          running={this.props.audio.running}
          current={this.props.audio.current}
        />
        <button 
          onClick={this.startCommand}
          className="btn btn-sm btn-block btn-running mt-3 py-0 rounded"
        >
          <FontAwesomeIcon icon="paper-plane" color="#fff"/>
        </button>
        {this.props.audio.current && 
          <button 
            onClick={this.endCurrentShow}
            className="btn btn-sm btn-block btn-danger mt-3 py-0 rounded"
          >
            <FontAwesomeIcon icon="stop" color="#fff"/>
          </button>
        }
        <div className="mt-3">
          <select 
            onChange={e => this.setState({ selected: e.target.value })} 
            className="form-control form-control-sm"
          >
            <option value="">Seleccione</option>
            {options}
          </select>
        </div>
        <Loop 
          value={this.state.loop}
          onChange={value => this.setState({ loop: value })}
        />
        <Time 
          value={this.state.time}
          onChange={value => this.setState({ time: value })}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ show }) => ({
  audio: show.audio,
  selectedSceneId: show.scenes.selected,
  selectedScene: show.scenes.items.find(item => {
    return item._id === show.scenes.selected;
  }),
});

const mapDispatchToProps = dispatch => ({
  getFilesFromEvent: (type) => dispatch(getFilesFromEvent(type)),
  setCurrentScene: (scene, current) => dispatch(setCurrentScene(scene, current)),
  endCurrentSceneTime: scene => dispatch(endCurrentSceneTime(scene)),
  endRunningShow: (scene) => dispatch(endRunningShow(scene)),
  updateCurrentLoop: (scene, loop) => dispatch(updateCurrentLoop(scene, loop)),
  displayAlertMessage: (title, text, type = 'info') => dispatch(displayAlertMessage(title, text, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioControls);