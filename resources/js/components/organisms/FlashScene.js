import React from 'react';
import Toggle from './../atoms/Toggle';
import classnames from 'classnames';

class FlashScene extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      bpm: '',
      vibrate: false,
      enabled: false,
      error: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.getConfiguration = this.getConfiguration.bind(this);
    this.cleanConfiguration = this.cleanConfiguration.bind(this);
  }

  handleChange (e) {
    const { type, name } = e.target;

    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    const realName = type === 'checkbox' ? name.split('-')[1] : name;

    this.setState({
      [realName]: value,
    });
  }

  getConfiguration () {
    const { bpm, enabled } = this.state;
    const intBPM = parseInt(bpm);
    let failure = false;

    if (enabled && (intBPM <= 0 || isNaN(intBPM))) {
      this.setState({ error: 'BPM debe ser un número mayor a cero.' });
      failure = true;
    } else {
      this.setState({ error: '' });
      failure = false;
    }

    return { 
      time: 0,
      failure,
      loop: -1,
      bpm: intBPM,
      vibrate: this.state.vibrate,
      enabled: this.state.enabled,
    }
  }

  cleanConfiguration () {
    this.setState({
      bpm: '',
      vibrate: false,
    });
  }

  render () {
    const { containerStyle } = this.props;
    const containerClasses = classnames({
      'border': this.state.error !== '',
      'border-danger': this.state.error !== '',
      'rounded': this.state.error !== '',
      'mt-1': this.state.error !== '',
    });

    return (
      <div className={`${containerStyle} ${containerClasses}`}>
        {this.state.error !== '' &&
          <p className="text-center text-danger m-0" style={{ fontSize: '12px' }}>
            {this.state.error}
          </p>
        }
        <Toggle 
          name="flash-enabled" 
          checked={this.state.enabled} 
          onChange={this.handleChange}
          className="mb-1"
        >
          Flash
        </Toggle>
        <div className="row">
          <div className="col-md-12">
            <div className="form-inline">
              <div className="form-group">
                <label htmlFor="bpm" className="sr-only">Beats por Minuto</label>
                <input
                  id="bpm"
                  name="bpm"
                  type="number"
                  placeholder="Beats por minuto"
                  className="form-control"
                  value={this.state.bpm}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <Toggle 
                  name="flash-vibrate" 
                  checked={this.state.vibrate} 
                  onChange={this.handleChange}
                >
                  Vibración
                </Toggle>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FlashScene;