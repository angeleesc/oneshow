import React, { useMemo } from 'react';
import { useSpring, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import icons from './../../data/icons';

function IconSelector (props) {
  const style = useSpring({
    height: props.open ? '200px' : '0px',
  });

  const iconItem = useMemo(() => icons.map((icon, i) => (
    <div 
      key={i} 
      className="icon-dropdown-item text-center" 
      onClick={() => props.onChange(icon)}
    >
      <FontAwesomeIcon
        icon={icon}
        color={props.color}
      />
    </div>
  )));

  const dropdownListClass = classnames('icon-dropdown-list', 'rounded', {
    'py-2': props.open
  }, 'mt-1', 'bg-light');

  return (
    <animated.div style={style} className={dropdownListClass}>
      {iconItem}
    </animated.div>
  );
}

export default IconSelector;