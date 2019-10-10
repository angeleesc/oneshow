import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class BPM extends React.Component {
  constructor (props) {
    super(props);

    this.onWheelMovement = this.onWheelMovement.bind(this);
    this.onRestartClick = this.onRestartClick.bind(this);
    this.loopRef = React.createRef();
  }

  /**
   * Lifecycle components
   */
  componentDidMount () {
    this.loopRef.current.addEventListener('wheel', this.onWheelMovement, { passive: false });
  }

  componentDidUpdate (prevProps) {
    if (prevProps.value == -1 && this.props.value > -1) {
      this.loopRef.current.addEventListener('wheel', this.onWheelMovement, { passive: false });
    }
  }

  /**
   * Event handler components
   */
  onWheelMovement (e) {
    e.preventDefault();

    let next = this.props.value + (e.deltaY * -0.01);
    let value = next < -1 ? -1 : next;

    this.props.onChange(value);
  }

  onRestartClick (e) {
    e.preventDefault();

    this.props.onChange(0);
  }

  render () {
    const { value } = this.props;

    return (
      <div className="console command rounded mt-3">
        <div className="console-header">
          <h6>
            <FontAwesomeIcon icon="heartbeat" /> {`   `} Beats por Minuto
          </h6>
        </div>
        <form>
          <div className="console-body">
            <div className="command-control" ref={this.loopRef}>
              {value === -1 &&
                <div className="my-2 text-center">
                  <FontAwesomeIcon 
                    icon="circle" 
                    color="#fff" 
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
                    Fijo
                  </p>
                </div>
              }
              {value === 0 &&
                <div className="my-2 text-center">
                  <FontAwesomeIcon 
                    icon="power-off" 
                    color="#fff" 
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
              {value > 0 && 
                <input 
                  name="n" 
                  min="-1"
                  value={value}
                  onChange={e => this.props.onChange(parseInt(e.target.value))}
                  type="number"
                />
              }
            </div>
            <div className="command-control">
              <div className="btn-group" style={{ display: 'flex' }}>
                <button 
                  type="button" 
                  className="btn btn-sm p-0 nothing" 
                  onClick={this.onRestartClick}
                >
                  <FontAwesomeIcon icon="undo-alt" color="#fff" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default BPM;