import React from 'react';

const Mensaje = (props) => {

    return (

        <div className="section-empty mt-5 mb-5">

            <div className="text-center">
                <i className={props.icono + " fa-5x"}></i>
            </div>

            <div className="text-center mt-3 roboto-condensed">
                {props.texto}
            </div>

        </div>

    );

};

export default Mensaje;
