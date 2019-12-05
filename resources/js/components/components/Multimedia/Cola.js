import React from "react";
import { connect } from 'react-redux';
import { deleteJob } from './../../../redux/actions/multimedia';

import "./css/Cola.css";

const Cola = props => {
    return (
        <div>
            <table className="table table-dark-theme-console fixed_header">
                <thead>
                    <tr className="titulos-tabla">
                        <th>Cola</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Sectores</th>
                        <th>Parametros</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {props.envios.map(event => {
                        if (event.status != "cola")
                            return null;

                        if (event.eventId != props.evento)
                            return null;

                        const startTime = new Date(event.startTime);
                        const endTime = new Date(event.endTime);
                        const startTimeString = `${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`;
                        const endTimeString = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`;
                        
                        return (
                            <tr key={event.id} id={event.id}>
                                <td>{event.type}</td>
                                <td>{startTimeString}</td>
                                <td>{endTimeString}</td>
                                <td>Grada, Campo</td>
                                <td>{event.payload}</td>
                                <td>
                                    <i
                                      className="fa fa-trash mr-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={e => props.deleteJob(event.id)}
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

const mapDispatchToProps = dispatch => ({
  deleteJob: (id) => dispatch(deleteJob(id))
});

export default connect(null, mapDispatchToProps)(Cola);