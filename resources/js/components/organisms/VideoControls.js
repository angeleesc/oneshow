import React from 'react';
import ConsoleControl from './../molecules/ConsoleControl';
import Loop from './../molecules/Loop';
import Time from './../molecules/Time';
import Vibrate from './../molecules/Vibrate';
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

class VideoControls extends React.Component {  
  constructor (props) {
    super(props);

    this.state = {
      loop: 0,
      time: 0,
      files: [],
      selected: '',
      vibrate: false,
    }

    // Functions to control execution
    this.startCommand = this.startCommand.bind(this);
    this.endCurrentShow = this.endCurrentShow.bind(this);
    this.validateConfiguration = this.validateConfiguration.bind(this);

    // Class attributes
    this.interval = '';
  }

  componentDidMount () {
    this.props.getFilesFromEvent('Video').then(files => {
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
      const { video } = this.props.selectedScene;

      if (video.enabled) {
        this.setState({
          loop: video.loop,
          time: video.time,
          selected: video.selected,
          vibrate: video.vibrate,
        }, () => this.startCommand())
      }
    }
  }

  endCurrentShow () {
    clearInterval(this.interval);

    this.props.endRunningShow('video');
  }

  startCommand () {
    // Checking if the configuration is valid
    if (!this.validateConfiguration())
      return;

    // End previous execution
    this.endCurrentShow();

    const selectedFile = this.state.files.find(video => video._id === this.state.selected);
    
    this.props.setCurrentScene('video', {
      file: selectedFile,
      loop: this.state.loop,
      time: this.state.time,
      vibrate: this.state.vibrate,
    });

    // Executing a command every time a
    // beat is produced
    const interval = selectedFile.Duracion + (this.state.time * 1000);

    this.interval = setInterval(() => {
      const { current } = this.props.video;

      if (current.loop === 0)
        return this.endCurrentShow();

      let id = 1;
      let video = current.file.NombreCompleto;
      let vibrate = current.vibrate ? 1 : 0;
      let moment = 1;

      let command = `VID,${moment},${id},${video},${vibrate}`;

      this.props.submitCommand(command);
      
      if (current.loop > 0) {
        this.props.updateCurrentLoop('video', current.loop - 1);
      }
    }, interval);

    this.setState({
      bpm: 0,
      loop: 0,
      time: 0,
      vibrate: false,
    });
  }

  validateConfiguration () {
    const { selected, loop, time } = this.state;

    if (selected === '') {
      this.props.displayAlertMessage('', 'Seleccione un archivo de video', 'error');
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
          name="video"
          icon={this.props.video.icon}
          color={this.props.video.color}
          running={this.props.video.running}
          current={this.props.video.current}
        />
        <button 
          onClick={this.startCommand}
          className="btn btn-sm btn-block btn-running mt-3 py-0 rounded"
        >
          <FontAwesomeIcon icon="paper-plane" color="#fff"/>
        </button>
        {this.props.video.current && 
          <button 
            onClick={this.endCurrentShow}
            className="btn btn-sm btn-block btn-danger mt-3 py-0 rounded"
          >
            <FontAwesomeIcon icon="stop" color="#fff"/>
          </button>
        }
        <div className="mt-3">
          <select 
            className="form-control form-control-sm"
            onChange={e => this.setState({ selected: e.target.value })}
          >
            <option value="">Seleccione</option>
            {options}
          </select>
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
  video: show.video,
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoControls);