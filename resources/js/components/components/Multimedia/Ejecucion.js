import React from "react";
import { connect } from 'react-redux';
import { deleteJob } from './../../../redux/actions/multimedia';

import "./css/Ejecucion.css";

const Ejecucion = props => {
  
  function deleteJob (id, type) {
    props.deleteJob(id)
      .then(deletedId => props.removeMqttJob(deletedId, type))
      .catch(e => {
        alert('Try again');
        console.log(e);
      });
  }

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
                    {props.envios.map(job => {
                        if (job.status != "ejecucion")
                            return null;

                        if (job.eventId != props.evento)
                            return null;

                        const startTime = new Date(job.startTime);
                        const endTime = new Date(job.endTime);
                        const startTimeString = `${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`;
                        const endTimeString = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`;

                        return (
                            <tr key={job.id} id={job.id}>
                                <td>{job.type}</td>
                                <td>{startTimeString}</td>
                                <td>{endTimeString}</td>
                                <td>Grada, Campo</td>
                                <td>{job.payload}</td>
                                <td>
                                    <i
                                      className="fa fa-trash"
                                      style={{ cursor: "pointer" }}
                                      onClick={e => deleteJob(job.id, job.type)}
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

export default connect(null, mapDispatchToProps)(Ejecucion);
