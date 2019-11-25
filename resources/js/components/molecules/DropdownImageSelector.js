import React from 'react';
import ImageWrapperSelection from './../atoms/ImageWrapperSelection';
import { useSpring, animated } from 'react-spring';
import classnames from 'classnames';

function DropdownImageSelector (props) {  
  const style = useSpring({
    height: props.open ? '300px' : '0px',
  });
  
  const images = props.images.map(image => (
    <ImageWrapperSelection
      id={image.id}
      key={image.id}
      onClick={props.handleSelect}
      selected={image.selected}
      url={image.url}
    />
  ));

  const classNames = classnames('image-dropdown', 'rounded', 'px-2', {
    'pb-3': props.open,
  });

  return (
    <animated.div 
      className={classNames}
      style={style}
    >
      {images}
    </animated.div>
  );
}

export default DropdownImageSelector;