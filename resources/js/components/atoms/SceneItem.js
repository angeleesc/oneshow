import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SceneItem (props) {
  return (
    <div className={`oneshow-card ${props.className}`}>
      <div className="oneshow-card-body">
        {props.name} 
        <span style={{ cursor: 'pointer'}}>
          <FontAwesomeIcon 
            icon="minus-circle" 
            color="#dc3545"
            pull="right"
            onClick={e => props.handleDelete(props.id)}
          />
        </span>
      </div>
    </div>
  );
}

export default SceneItem;