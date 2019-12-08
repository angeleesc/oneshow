import React from 'react';

function CargandoSpinner() {

    return (
        <div className="row">
            <div className="offset-6">
                <h3>
                    <i className="fa fa-spinner fa-spin" />{" "}
                    Cargando
                </h3>
            </div>
        </div>
    );
}

export default CargandoSpinner;

