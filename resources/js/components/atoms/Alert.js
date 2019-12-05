import React from 'react';
import classnames from 'classnames';

function Alert (props) {
  const alertStyle = classnames('alert', `alert-${props.type}`);

  return (
    <div className={alertStyle}>
      {/* onClick={e => props.handleClose()} */}
      <button type="button" className="close" >
        <span aria-hidden="true">&times;</span>
      </button>
      {props.children}
    </div>
  );
}

export default Alert;