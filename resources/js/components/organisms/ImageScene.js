import React from 'react';
import Toggle from './../atoms/Toggle';
import { getFilesFromEvent } from './../../redux/actions/show';
import { connect } from 'react-redux';
import DropdownImageSelector from './../molecules/DropdownImageSelector';
import classnames from 'classnames';

class ImageScene extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      time: '',
      files: [],
      vibrate: false,
      isSelectorOpen: false,
      enabled: false,
      error: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.getConfiguration = this.getConfiguration.bind(this);
    this.handleImageSelect = this.handleImageSelect.bind(this);
    this.cleanConfiguration = this.cleanConfiguration.bind(this);
  }

  componentDidMount () {
    this.props.getFilesFromEvent('Imagen').then(files => {
      this.setState({ files });

      console.log('Image', files);
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

  handleImageSelect (imageId) {
    this.setState(state => ({
      files: state.files.map(file => {
        if (file._id === imageId)
          return {...file, selected: !file.selected };

        return file;
      })
    }));
  }

  getConfiguration () {
    const { time, enabled, files } = this.state;
    const selected = files.filter(f => f.selected);
    const intTime = parseInt(time);
    let failure = false;

    if (enabled && (intTime < 0 || isNaN(intTime))) {
      this.setState({ error: 'La duración de las imágenes debe ser mayor a 0' });
      failure = true;

    } else if (enabled && selected.length === 0) {
      this.setState({ error: 'Seleccione las imágenes que desea reproducir' });
      failure = true;

    } else {
      this.setState({ error: '' });
      failure = false;
    }

    return { 
      failure,
      loop: -1,
      time: intTime,
      files: selected,
      vibrate: this.state.vibrate,
      enabled: this.state.enabled,
    };
  }

  cleanConfiguration () {
    this.setState(state => ({
      time: '',
      files: state.files.map(file => ({...file, selected: false })),
      vibrate: false,
    }));
  }

  render () {
    const { containerStyle } = this.props;

    const images = this.state.files.map(file => ({
      id: file._id,
      selected: file.selected,
      url: `storage/${file.Path}`
    }));

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
          name="image-enabled" 
          checked={this.state.enabled} 
          onChange={this.handleChange}
          className="mb-1"
        >
          Image
        </Toggle>
        <div className="row">
          <div className="col-md-2">
            <button 
              onClick={e => this.setState(state => ({ isSelectorOpen: !state.isSelectorOpen }))}
              className="btn btn-sm btn-block btn-light rounded"
            >
              {this.state.isSelectorOpen ? (
                'Close'
              ) : (
                'Select'
              )}
            </button>
          </div>
          <div className="col-md-4">
            <DropdownImageSelector
              images={images}
              open={this.state.isSelectorOpen}
              handleSelect={this.handleImageSelect}
            />
          </div>
          <div className="col-md-6">
            <div className="form-inline">
              <div className="form-group">
                <label htmlFor="time" className="sr-only">Intérvalo</label>
                <input
                  id="time"
                  name="time"
                  type="number"
                  placeholder="Tiempo entre imágenes (seg)"
                  className="form-control"
                  value={this.state.time}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <Toggle 
                  name="image-vibrate" 
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

const mapDispatchToProps = dispatch => ({
  getFilesFromEvent: (type) => dispatch(getFilesFromEvent(type))
});

export default connect(null, mapDispatchToProps, null, {
  forwardRef: true,
})(ImageScene);