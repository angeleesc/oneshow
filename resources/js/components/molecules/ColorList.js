import React, { Component } from 'react';
import Color from './../atoms/Color';

class ColorList extends Component {
  render() {
    const colors = this.props.colors.map((color, i) => (
      <Color 
        key={i}
        index={i}
        color={color} 
        onClick={this.props.onDelete}
      />
    ));

    if (colors.length === 0)
      return null;

    return (
      <div className="color-list mt-3 py-1">
        {colors}
      </div>
    )
  }
}

export default ColorList;