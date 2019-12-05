import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconSelector from './../atoms/IconSelector';

function DropdownIconSelector (props) {
  const [ isOpen, setOpen ] = useState(false);

  const handleChange = (icon) => {
    props.onChange(icon);
    setOpen(false);
  }

  return (
    <div className="icon-dropdown rounded">
      <div 
        onClick={e => setOpen(!isOpen)} 
        className="icon-dropdown-header text-center rounded"
      >
        <FontAwesomeIcon
          color={props.color}
          icon={props.icon}
        />
      </div>
      <IconSelector 
        open={isOpen}
        color="#5e72e4"
        onChange={handleChange}
      />
    </div>
  );
}

export default DropdownIconSelector;