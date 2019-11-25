import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Color (props) {
  
  return (
    <div 
      className="color-box p-3 mr-1 rounded" 
      style={{
        backgroundColor: props.color
      }}
    >
      <div 
        className="color-box-option" 
        onClick={() => props.onClick(props.index)}
      >
        <FontAwesomeIcon icon="times" color="#eb3b5a"/>
      </div>
    </div>
  )
}

export default Color;
