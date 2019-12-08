import React from 'react';
import Toggle from './../atoms/Toggle';
import ColorList from './../molecules/ColorList';
import ColorSelector from './../molecules/ColorSelector';
import classnames from 'classnames';

class ColorScene extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      bpm: '',
      colors: [],
      vibrate: false,
      enabled: false,
      error: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleNewColor = this.handleNewColor.bind(this);
    this.getConfiguration = this.getConfiguration.bind(this);
    this.cleanConfiguration = this.cleanConfiguration.bind(this);
    this.handleDeletedColor = this.handleDeletedColor.bind(this);
  }

  handleChange (e) {
    const { type, name } = e.target;

    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    const realName = type === 'checkbox' ? name.split('-')[1] : name;

    this.setState({
      [realName]: value,
    });
  }

  handleNewColor (color) {
    this.setState(state => ({
      colors: [...state.colors, color]
    }));
  }

  handleDeletedColor (i) {
    this.setState(state => ({
      colors: state.colors.filter((_, index) => i !== index)
    }))
  }

  getConfiguration () {
    const { enabled, bpm, colors } = this.state;
    let failure = false;
    let intBPM = parseInt(bpm);
    
    if (enabled && colors.length === 0) {
      this.setState({ error: 'Seleccione los colores que se van a utilizar.' });
      failure = true;

    } else if (enabled && (intBPM <= 0 || isNaN(intBPM))) {
      this.setState({ error: 'BPM debe ser un número mayor a cero.' });
      failure = true;
    } else {
      this.setState({ error: '' });
      failure = false;
    }

    return { 
      colors,
      failure,
      time: 0,
      loop: -1,
      bpm: intBPM,
      vibrate: this.state.vibrate,
      enabled: this.state.enabled,
    }
  }

  cleanConfiguration () {
    this.setState({
      bpm: '',
      colors: [],
      vibrate: false,
    })
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
          name="color-enabled" 
          checked={this.state.enabled} 
          onChange={this.handleChange}
          className="mb-1"
        >
          Color
        </Toggle>
        <div className="row">
          <div className="col-md-3">
            <ColorSelector
              onSubmit={this.handleNewColor}
            />
            <ColorList 
              onDelete={this.handleDeletedColor}
              colors={this.state.colors}
            />
          </div>
          <div className="col-md-9">
            <div className="form-inline">
              <div className="form-group mx-sm-3">
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
                  name="color-vibrate" 
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

export default ColorScene;