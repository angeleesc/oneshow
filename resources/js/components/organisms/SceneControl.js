import React from 'react';
import ConsoleControl from './../molecules/ConsoleControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { executeScene, executionDone, endRunningShow} from './../../redux/actions/show';
import classnames from 'classnames';
import { connect } from 'react-redux';


class SceneControl extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      current: null,
      error: '',
    }

    this.waitingTime = 2000;
    this.startScene = this.startScene.bind(this);
    this.endCurrentShow = this.endCurrentShow.bind(this);
  }

  startScene () {
    if (this.props.selectedSceneId !== null) {
      return this.setState({ 
        error: 'Espere un momento para realizar la ejecución' 
      }, () => setTimeout(() => this.setState({ error: '' }), this.waitingTime));
    }
    

    this.setState({ current: {} });

    this.props.executeScene(this.props.id);

    setTimeout(() => {
      this.setState({
        current: null,
      }, () => this.props.executionDone());
    }, this.waitingTime);
  }

  endCurrentShow () {
    this.props.endRunningShow('color');
    this.props.submitCommand(`REM,0,1,COL`);
    this.props.endRunningShow('flash');
    this.props.submitCommand(`REM,0,1,FLH`);
    this.props.endRunningShow('audio');
    this.props.submitCommand(`REM,0,1,AUD`);
    this.props.endRunningShow('video');
    this.props.submitCommand(`REM,0,1,VID`);
    this.props.endRunningShow('image');
    this.props.submitCommand(`REM,0,1,IMG`);
  }

  render () {
    const controlStyles = classnames('mb-3', {
      'border': this.state.error !== '',
      'bg-danger': this.state.error !== '',
      'border-danger': this.state.error !== '',
    });

    return (
      <div className={controlStyles}>
        {this.state.error !== '' && 
          <div className="m-0 text-center" style={{ fontSize: '11px' }}>
            <p>{this.state.error}</p>
          </div>
        }
        <ConsoleControl
          running={false}
          roundedBottom={false}
          name={this.props.name}
          icon={this.props.icon}
          color={this.props.color}
          current={this.state.current}
          className="no-border-bottom"
        />
        <button 
          onClick={this.startScene}
          className="btn btn-sm btn-block btn-running py-0 rounded-bottom"
        >
          <FontAwesomeIcon icon="paper-plane" color="#fff"/>
        </button>
        
          <button 
            onClick={this.endCurrentShow}
            className="btn btn-sm btn-block btn-danger mt-3 py-0 rounded"
          >
            <FontAwesomeIcon icon="stop" color="#fff"/>
          </button>
              
      </div>
    );  
  }
}

const mapStateToProps = state => ({
  selectedSceneId: state.show.scenes.selected
});

const mapDispatchToProps = dispatch => ({
  executeScene: (sceneId) => dispatch(executeScene(sceneId)),
  endRunningShow: (scene) => dispatch(endRunningShow(scene)),
  executionDone: () => dispatch(executionDone()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SceneControl);