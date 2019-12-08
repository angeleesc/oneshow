import React from 'react';
import { HuePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ColorSelector extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      color: '#5e72e4',
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();

    this.props.onSubmit(this.state.color);
  }

  render () {

    return (
      <form onSubmit={this.handleSubmit} className={this.props.className}>
        <div className="input-group mb-1">
          <input 
            type="text"
            className="form-control form-control-sm rounded-left text-center"
            value={this.state.color}
            onChange={e => this.setState({ color: e.target.value })}
            style={{ 
              color: this.state.color, 
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-sm btn-outline-secondary rounded-right">
              <FontAwesomeIcon icon="plus" />
            </button>
          </div>
        </div>
        <HuePicker
          width="100%"
          direction="horizontal"
          color={this.state.color}
          onChange={color => this.setState({ color: color.hex })}
        />
      </form>
    )
  }
}

export default ColorSelector;