import React from 'react';
import ConsoleControl from './../molecules/ConsoleControl';
import Loop from './../molecules/Loop';
import BPM from './../molecules/BPM';
import ColorSelector from './../molecules/ColorSelector';
import ColorList from './../molecules/ColorList';
import Vibrate from './../molecules/Vibrate';
import Time from './../molecules/Time';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { displayAlertMessage } from './../../redux/actions/alert';
import { 
  endRunningShow,
  setCurrentScene, 
  updateCurrentLoop,
  endCurrentSceneTime,
} from './../../redux/actions/show';
import { connect } from 'react-redux';

class ColorControls extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      bpm: 0,
      loop: 0,
      time: 0,
      colors: [],
      vibrate: false,
    }

    // Class functions
    this.handleNewColor = this.handleNewColor.bind(this);
    this.handleDeletedColor = this.handleDeletedColor.bind(this);
    
    // Functions to control execution
    this.startCommand = this.startCommand.bind(this);
    this.endCurrentShow = this.endCurrentShow.bind(this);
    this.validateConfiguration = this.validateConfiguration.bind(this);

    // Class attributes
    this.interval = '';
    this.timeout = '';
    this.step = 0;
  }

  componentWillUnmount () {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
    
    this.props.endRunningShow('color');
  }

  componentDidUpdate (prevProps) {
    if (prevProps.selectedSceneId === null && this.props.selectedSceneId !== null) {
      const { color } = this.props.selectedScene;

      if (color.enabled) {
        this.setState({
          bpm: color.bpm,
          loop: color.loop,
          time: color.time,
          colors: color.colors,
          vibrate: color.vibrate,
        }, () => this.startCommand())
      }
    }
  }

  endCurrentShow () {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
    
    this.props.endRunningShow('color');

    this.props.submitCommand(`REM,0,1,COL`);
  }

  startCommand () {
    // Checking if the configuration is valid
    if (!this.validateConfiguration())
      return;

    // End previous execution
    this.endCurrentShow();

    this.props.setCurrentScene('color', this.state);
    const interval = (60 / this.state.bpm) * 1000;

    // Updating timer to 0 when time finishes
    if (this.state.time > 0) {
      this.timeout = setTimeout(() => {
        this.props.endCurrentSceneTime('color')
        
        if (this.props.color.current.loop === 0)
          return this.endCurrentShow();
        
      }, this.state.time * 1000);
    }

    // First command execution
    const firstCommand = `COL,${1},${this.step},${this.state.colors[this.step]},${this.state.vibrate ? 1 : 0}`;
    this.props.submitCommand(firstCommand);

    if (this.step === (this.state.colors.length - 1)) {
      this.step = 0;
    } else {
      this.step = this.step + 1;
    }

    // If bpm is equal to zero, just execute the command once
    // and let it be there
    if (this.state.bpm === 0)
      return;

    // Executing a command every time a
    // beat is produced
    this.interval = setInterval(() => {
      const { current } = this.props.color;

      if (current.time === 0 && current.loop === 0)
        return this.endCurrentShow();

      let id = this.step;
      let color = current.colors[this.step];
      let vibrate = current.vibrate ? 1 : 0;
      let moment = 1;

      let command = `COL,${moment},${id},${color},${vibrate}`;

      this.props.submitCommand(command);

      if (this.step === (current.colors.length - 1)) {
        this.step = 0;

        if (current.loop > 0) {
          this.props.updateCurrentLoop('color', current.loop - 1);
        }
      } else {
        this.step = this.step + 1;
      }
    }, interval);
  }

  handleNewColor (color) {
    this.setState(state => ({
      colors: [...state.colors, color]
    }));
  }

  handleDeletedColor (index) {
    this.setState(state => ({
      colors: state.colors.filter((_, i) => i !== index)
    }));
  }

  validateConfiguration () {
    const { colors, loop, time, bpm } = this.state;

    if (colors.length <= 0) {
      this.props.displayAlertMessage('', 'No seleccionó ningún color para empezar el show', 'error');
      return false;
    }
    
    if (loop === 0 && time === 0 && bpm > 0) {
      this.props.displayAlertMessage('', 'Duración del comando no especificado', 'error');
      return false;
    }
  
    return true;
  }

  render () {
    return (
      <React.Fragment>
        <ConsoleControl 
          name="color"
          icon={this.props.color.icon}
          color={this.props.color.color}
          running={this.props.color.running}
          current={this.props.color.current}
        />
        <button 
          onClick={this.startCommand}
          className="btn btn-sm btn-block btn-running mt-3 py-0 rounded"
        >
          <FontAwesomeIcon icon="paper-plane" color="#fff"/>
        </button>
        {this.props.color.current && 
          <button 
            onClick={this.endCurrentShow}
            className="btn btn-sm btn-block btn-danger mt-3 py-0 rounded"
          >
            <FontAwesomeIcon icon="stop" color="#fff"/>
          </button>
        }
        <ColorSelector
          className="mt-3"
          onSubmit={this.handleNewColor}
        />
        <ColorList 
          onDelete={this.handleDeletedColor}
          colors={this.state.colors}
        />
        <Loop
          value={this.state.loop}
          onChange={loop => this.setState({ loop })}
        />
        <Time 
          value={this.state.time}
          onChange={time => this.setState({ time })}
        />
        <BPM
          value={this.state.bpm}
          onChange={bpm => this.setState({ bpm })}
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
  color: show.color,
  selectedSceneId: show.scenes.selected,
  selectedScene: show.scenes.items.find(item => {
    return item._id === show.scenes.selected;
  }),
});

const mapDispatchToProps = dispatch => ({
  setCurrentScene: (scene, current) => dispatch(setCurrentScene(scene, current)),
  updateCurrentLoop: (scene, loop) => dispatch(updateCurrentLoop(scene, loop)),
  endCurrentSceneTime: scene => dispatch(endCurrentSceneTime(scene)),
  endRunningShow: (scene) => dispatch(endRunningShow(scene)),
  displayAlertMessage: (title, text, type = 'info') => dispatch(displayAlertMessage(title, text, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColorControls);