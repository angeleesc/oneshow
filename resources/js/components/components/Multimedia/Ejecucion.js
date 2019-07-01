import React from "react";

import "./css/Ejecucion.css";

const Ejecucion = props => {
    return (
        <div>
            <table className="table table-dark-theme-console fixed_header">
                <thead>
                    <tr className="titulos-tabla">
                        <th>Ejecutando</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Sectores</th>
                        <th>Parametros</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {props.envios.map((e, index) => {
                        if (e.Estado != "ejecucion") {
                            return false;
                        }
                        var evento = props.evento.split("_")[0];
                        if (e.Evento != evento) {
                            return false;
                        }
                        return (
                            <tr key={index} id={e._id}>
                                <td>{e.Tipo}</td>
                                <td>{e.Inicio}</td>
                                <td>{e.Fin}</td>
                                <td>Grada, Campo</td>
                                <td>{e.Parametro}</td>
                                <td>
                                    <i
                                        className="fa fa-trash"
                                        style={{ cursor: "pointer" }}
                                        onClick={ev =>
                                            props.sincola(
                                                "ejecucion",
                                                e.Tipo,
                                                e.inicio,
                                                e.fin,
                                                e._id
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Ejecucion;

/*
 <tr>
                    <td>Luces Flash</td>
                    <td>15:30:55</td>
                    <td>15:50:00</td>
                    <td>Grada, Campo</td>
                    <td>Intermitencia 30ms</td>
                    <td><i className="fas fa-ban fa-lg icon-console"></i></td>
                </tr>

*/
