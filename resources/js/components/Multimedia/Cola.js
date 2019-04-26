import React from 'react';

const Cola = (props) => {

    return (

        <div>

            <table className="table table-dark-theme-console">
                <thead>
                <tr>
                    <th>Cola</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Sectores</th>
                    <th>Parametros</th>
                    <th>Accion</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Luces Led</td>
                    <td>16:30:55</td>
                    <td>16:40:00</td>
                    <td>Grada, Campo</td>
                    <td>Intermitencia 30ms</td>
                    <td>
                        <i className="fas fa-ban fa-lg icon-console mr-2"></i>
                        <i className="fas fa-arrow-up fa-lg icon-console mr-2"></i>
                        <i className="fas fa-arrow-down fa-lg icon-console mr-2"></i>
                        <i className="fas fa-pencil-alt fa-lg icon-console mr-2"></i>
                    </td>
                </tr>
                <tr>
                    <td>Ola humana</td>
                    <td>17:00:00</td>
                    <td>17:10:00</td>
                    <td>Grada</td>
                    <td>Intermitencia 10ms</td>
                    <td>
                        <i className="fas fa-ban fa-lg icon-console mr-2"></i>
                        <i className="fas fa-arrow-up fa-lg icon-console mr-2"></i>
                        <i className="fas fa-arrow-down fa-lg icon-console mr-2"></i>
                        <i className="fas fa-pencil-alt fa-lg icon-console mr-2"></i>
                    </td>
                </tr>
                <tr>
                    <td>Pantalla</td>
                    <td>18:00:00</td>
                    <td>18:50:00</td>
                    <td>Todos</td>
                    <td>Ninguno</td>
                    <td>
                        <i className="fas fa-ban fa-lg icon-console mr-2"></i>
                        <i className="fas fa-arrow-up fa-lg icon-console mr-2"></i>
                        <i className="fas fa-arrow-down fa-lg icon-console mr-2"></i>
                        <i className="fas fa-pencil-alt fa-lg icon-console mr-2"></i>
                    </td>
                </tr>
                </tbody>
            </table>

        </div>

    );

};

export default Cola;
