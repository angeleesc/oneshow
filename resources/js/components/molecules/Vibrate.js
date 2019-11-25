import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Vibrate extends React.Component {

  render () {
    const { vibrate } = this.props;

    return (
      <div className="console command rounded mt-3">
        <div className="console-header">
          <h6>
            <FontAwesomeIcon icon="assistive-listening-systems" /> {`   `} Vibración
          </h6>
        </div>
        <form>
          <div className="console-body">
            <div className="command-control" onClick={e => this.props.onChange()}>
              {vibrate &&
                <div className="my-2 text-center">
                  <FontAwesomeIcon 
                    icon="toggle-on" 
                    color="rgba(40, 167, 69, 0.4)" 
                    size="2x"
                  />
                  <p 
                    className="text-center" 
                    style={{ 
                      fontWeight: '600', 
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Encendido
                  </p>
                </div>
              }
              {!vibrate &&
                <div className="my-2 text-center">
                  <FontAwesomeIcon 
                    icon="toggle-off" 
                    color="rgba(108, 117, 125, 0.3)" 
                    size="2x"
                  />
                  <p 
                    className="text-center" 
                    style={{ 
                      fontWeight: '600', 
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Apagado
                  </p>
                </div>
              }
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Vibrate;