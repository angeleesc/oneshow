import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Checkbox(props) {
    return (
        <div onClick={e => props.onChange()}>
            { props.valor &&
                <div>
                    <FontAwesomeIcon 
                        icon="toggle-on" 
                        color="rgba(40, 167, 69, 0.4)" 
                        size="2x"
                    />
                </div>
            }
            { !props.valor &&
                <div>
                    <FontAwesomeIcon 
                        icon="toggle-off" 
                        color="rgba(108, 117, 125, 0.3)" 
                        size="2x"
                    />
                </div>
            }
        </div>
    );
}