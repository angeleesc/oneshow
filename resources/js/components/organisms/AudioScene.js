import React from 'react';
import Toggle from './../atoms/Toggle';
import { getFilesFromEvent } from './../../redux/actions/show';
import { connect } from 'react-redux';

class AudioScene extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      time: '',
      files: [],
      selected: '',
      enabled: false,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    this.props.getFilesFromEvent('Audio').then(files => {
      this.setState({ files });
    })
    .catch(e => {
      console.log('Error', e);
    })
  }

  handleChange (e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    this.setState({
      [e.target.name]: value,
    })
  }

  render () {
    const options = this.state.files.map(file => (
      <option key={file._id} value={file._id}>{file.NombreCompleto}</option>
    ));

    return (
      <div className={this.props.containerStyle}>
        <Toggle 
          name="enabled" 
          checked={this.state.enabled} 
          onChange={this.handleChange}
          className="mb-1"
        >
          Audio
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
                  placeholder="Tiempo entre audios (seg)"
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

export default connect(null, mapDispatchToProps)(AudioScene);