import React from 'react';
import ConsoleControl from './../molecules/ConsoleControl';
import Loop from './../molecules/Loop';
import BPM from './../molecules/BPM';
import Time from './../molecules/Time';
import Vibrate from './../molecules/Vibrate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { displayAlertMessage } from './../../redux/actions/alert';
import { 
  endRunningShow,
  setCurrentScene, 
  updateCurrentLoop,
  endCurrentSceneTime,
} from './../../redux/actions/show';
import { connect } from 'react-redux';

class FlashControls extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      bpm: 0,
      time: 0,
      loop: 0,
      vibrate: false
    }

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
    this.endCurrentShow();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.selectedSceneId === null && this.props.selectedSceneId !== null) {
      const { flash } = this.props.selectedScene;

      if (flash.enabled) {
        this.setState({
          bpm: flash.bpm,
          time: flash.time,
          loop: flash.loop,
          vibrate: flash.vibrate
        }, () => this.startCommand())
      }

    }
  }

  endCurrentShow () {
    clearInterval(this.interval);
    clearTimeout(this.timeout);

    this.props.endRunningShow('flash');
  }

  startCommand () {
    // Checking if the configuration is valid
    if (!this.validateConfiguration())
      return;

    // End previous execution
    this.endCurrentShow();

    this.props.setCurrentScene('flash', this.state);
    const interval = (60 / this.state.bpm) * 1000;

    // Updating timer to 0 when time finishes
    if (this.state.time > 0) {
      this.timeout = setTimeout(() => {
        this.props.endCurrentSceneTime('flash')
        
        if (this.props.flash.current.loop === 0)
          return this.endCurrentShow();
        
      }, this.state.time * 1000);
    }

    // Executing a command every time a
    // beat is produced
    this.interval = setInterval(() => {
      const { current } = this.props.flash;

      if (current.time === 0 && current.loop === 0)
        return this.endCurrentShow();

      let id = this.step;
      let flash = this.step;
      let vibrate = current.vibrate ? 1 : 0;
      let moment = 1;

      let command = `FLH,${moment},${id},${flash},${vibrate}`;

      this.props.submitCommand(command);

      if (this.step === 1) {
        this.step = 0;

        if (current.loop > 0) {
          this.props.updateCurrentLoop('flash', current.loop - 1);
        }    
      } else {
        this.step = this.step + 1;
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
    const { loop, time } = this.state;
    
    if (loop === 0 && time === 0) {
      this.props.displayAlertMessage('', 'Duración del comando no especificado', 'error');
      return false;
    }
  
    return true;
  }

  render () {
    return (
      <React.Fragment>
        <ConsoleControl 
          name="flash"
          icon={this.props.flash.icon}
          color={this.props.flash.color}
          running={this.props.flash.running}
          current={this.props.flash.current}
        />
        <button 
          onClick={this.startCommand}
          className="btn btn-sm btn-block btn-running mt-3 py-0 rounded"
        >
          <FontAwesomeIcon icon="paper-plane" color="#fff"/>
        </button>
        {this.props.flash.current && 
          <button 
            onClick={this.endCurrentShow}
            className="btn btn-sm btn-block btn-danger mt-3 py-0 rounded"
          >
            <FontAwesomeIcon icon="stop" color="#fff"/>
          </button>
        }
        <Loop 
          value={this.state.loop}
          onChange={value => this.setState({ loop: value })}
        />
        <Time 
          value={this.state.time}
          onChange={value => this.setState({ time: value })}
        />
        <BPM
          value={this.state.bpm}
          onChange={value => this.setState({ bpm: value })}
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
  flash: show.flash,
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

export default connect(mapStateToProps, mapDispatchToProps)(FlashControls);