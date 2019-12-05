import React from 'react';
import Image from './Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

class ImageWrapperSelection extends React.Component {
  render () {
    const { url, id, selected  } = this.props; 

    const classNames = classnames('image-wrapper', 'rounded', 'mt-3', {
      'selected': selected,
    });

    return (
      <div 
        className={classNames} 
        onClick={e => this.props.onClick(id)}
      >
        <Image
          rounded={!selected}
          url={url}
        />
        {selected &&
          <div className="image-checker">
            <FontAwesomeIcon 
              color="#1CA2CE"
              icon="check-circle" 
            />
          </div>
        }
      </div>
    );
  }
}

export default ImageWrapperSelection;