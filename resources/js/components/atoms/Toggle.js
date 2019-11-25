import React from 'react';

function Toggle (props) {
  return (
    <div className={`custom-control custom-switch ${props.className}`}>
      <input 
        type="checkbox"
        id={props.name}
        name={props.name}
        value={props.checked}
        onChange={e => {
          console.log('name', e.target.name);
          
          props.onChange(e)
        }}
        className="custom-control-input"
      />
      <label 
        style={{ fontWeight: 700 }}
        className="custom-control-label" 
        htmlFor={props.name}
      >
        {props.children}
      </label>
    </div>
  );
}

export default Toggle;