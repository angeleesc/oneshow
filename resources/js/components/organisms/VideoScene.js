import React from 'react';
import Toggle from './../atoms/Toggle';
import { getFilesFromEvent } from './../../redux/actions/show';
import { connect } from 'react-redux';
import classnames from 'classnames';

class VideoScene extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      time: '',
      files: [],
      selected: '',
      enabled: false,
      error: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.getConfiguration = this.getConfiguration.bind(this);
    this.cleanConfiguration = this.cleanConfiguration.bind(this);
  }

  componentDidMount () {
    this.props.getFilesFromEvent('Video').then(files => {
      this.setState({ files });
    })
    .catch(e => {
      console.log('Error', e);
    })
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
    const { time, selected, enabled } = this.state;
    const intTime = parseInt(time);
    let failure = false;

    if (enabled && (intTime < 0 || isNaN(intTime))) {
      this.setState({ error: 'El tiempo entre reproducciones no puede ser menor a cero' })
      failure = true;
    } else if (enabled && selected == '') {
      this.setState({ error: 'Seleccione el video que desea reproducir' });
      failure = true;
    } else {
      this.setState({ error: '' });
      failure = false;
    }

    return { 
      failure,
      loop: -1,
      time: intTime,
      vibrate: false,
      selected: this.state.selected,
      enabled: this.state.enabled,
    };
  }

  cleanConfiguration () {
    this.setState({
      time: '',
      selected: '',
    })
  }

  render () {
    const { containerStyle } = this.props;

    const options = this.state.files.map(file => (
      <option key={file._id} value={file._id}>{file.NombreCompleto}</option>
    ));

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
          name="video-enabled" 
          checked={this.state.enabled} 
          onChange={this.handleChange}
          className="mb-1"
        >
          Video
        </Toggle>
        <div className="row">
          <div className="col-md-3">
            <select 
              onChange={e => this.setState({ selected: e.target.value })}
              className="form-control"
            >
              <option value="">Seleccione</option>
              {options}
            </select>
          </div>
          <div className="col-md-4">
            <div className="form-inline">
              <div className="form-group mx-sm-3">
                <label htmlFor="time" className="sr-only">Intervalo</label>
                <input
                  id="time"
                  name="time"
                  type="number"
                  placeholder="Tiempo entre videos"
                  className="form-control"
                  value={this.state.time}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getFilesFromEvent: (type) => dispatch(getFilesFromEvent(type))
});

export default connect(null, mapDispatchToProps, null, {
  forwardRef: true,
})(VideoScene);