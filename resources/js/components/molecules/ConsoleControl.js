import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

class ConsoleControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render () {
    const { name, icon, color, current, roundedTop, roundedBottom, className } = this.props;
    const containerClassNames = classnames('console', {
      'rounded-top': roundedTop,
      'rounded-bottom': roundedBottom,
    });
    const consoleClassNames = classnames('console-status', {
      'running': current,
      'nothing': !current,
    });

    return (
      <div className={`${containerClassNames} ${className}`}>
        <div className="console-header">
          <h5>
            <FontAwesomeIcon icon={icon} color={color}/> {`   `} {name}
          </h5>
        </div>
        <div className={consoleClassNames}>
            {current ? (
              <p className="text-center py-1">
                <span className="blink">
                  <FontAwesomeIcon
                    icon="circle"
                    color="#eb3b5a"
                  />
                </span>
                {` `} Ejecutando
              </p>
            ):(
              <p className="text-center py-1">
                Nada Pendiente
              </p>
            )}
        </div>
      </div>
    )
  }
}

ConsoleControl.defaultProps = {
  roundedTop: true,
  roundedBottom: true,
};

export default ConsoleControl;