import React from 'react';
import classnames from 'classnames';

function Image ({ url, rounded = true, fluid = true }) {
  const classNames = classnames({
    'rounded': rounded,
    'img-fluid': fluid,
  });

  return (
    <img 
      src={url}
      className={classNames}
    />
  );
}

export default Image;