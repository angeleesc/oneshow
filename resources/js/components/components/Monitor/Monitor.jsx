import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class Monitor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                general: {},
                interfaces: [],
                services: {},
                tasks: []
            }
        };

        this.getData = this.getData.bind(this);
        this.actionService = this.actionService.bind(this);
    }

    getData() {

        axios.get('/ajax-monitor')
            .then(res => {

                const data = res.data.data;

                this.setState({
                    data: {
                        general: data.general,
                        interfaces: data.interfaces,
                        services: data.services,
                        tasks: data.tasks
                    }
                });

                setTimeout(this.getData, 2000);

            });

    };

    actionService(service, action) {

        const data = {
            servicio: service,
            accion: action
        };

        axios.post('/ajax-monitor-action', data)
            .then(response => {

                let code = response.data.code;
                let datos = response.data.data.peticion;
                let msj  = response.data.msj;
                let act  = datos.accion;

                let textAction = {
                    'start' : 'iniciado',
                    'stop'  : 'detenido',
                    'restart': 'reiniciado'
                };

                if(code == 200){

                    if(datos.status == true){
                        sweetalert('Servicio '+ textAction[act] +' exitosamente', 'success', 'sweet');
                    }else{

                        if(datos.service == 'Laravel Echo'){
                            sweetalert('Servicio '+ textAction[act] +' exitosamente', 'success', 'sweet');
                        }else{
                            sweetalert('Proceso fallido', 'error', 'sweet');
                        }

                    }

                }else if(code == 600){
                    sweetalert(msj, 'error', 'sweet');
                }

            })
            .catch(error => {

                sweetalert('Error al procesar peticion. Consulte al administrador.', 'error', 'sweet');

            });

    }

    componentDidMount() {
        this.getData();
    }


    render() {

        let general, hdd, memory, services, interfaces, tasks;

        if (this.state.data.general.length) {
            general = this.state.data.general[0];
            hdd = (general.hdd);
            memory = [general.memory];
        }

        if (this.state.data.services.length) services = this.state.data.services;
        if (this.state.data.interfaces.length) interfaces = [this.state.data.interfaces];
        if (this.state.data.tasks.length) tasks = this.state.data.tasks;

        return (

                <div className="col-lg-12">

                    <div className="widget widget-default">

                        <div className="widget-body">


                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">

                                <li className="nav-item">
                                    <a className="nav-link active" id="pills-servidor-tab" data-toggle="pill" href="#pills-servidor" role="tab" aria-controls="pills-servidor" aria-selected="true">Servidor</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="pills-servicios-tab" data-toggle="pill" href="#pills-servicios" role="tab" aria-controls="pills-servicios" aria-selected="false">Servicios</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="pills-interfaces-tab" data-toggle="pill" href="#pills-interfaces" role="tab" aria-controls="pills-interfaces" aria-selected="false">Interfaces</a>
                                </li>

                            </ul>

                            <hr className="line-gray"/>


                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-servidor" role="tabpanel" aria-labelledby="pills-servidor-tab">


                                        <h5 className = "mt-4 mb-3 " > Disco Duro </h5>

                                        <table className="table table-dark-theme table-bordered table-sm table-hover">
                                            <thead className="bg-dark text-white text-center">
                                            <tr>
                                                <th scope="col">Sistema Archivos</th>
                                                <th scope="col">Tamaño</th>
                                                <th scope="col">Usado</th>
                                                <th scope="col">Disponible</th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-center">

                                            { hdd ?

                                                hdd.map(function (item) {
                                                    return (<tr><td>{item.Filesystem}</td><td>{item.Size}</td><td>{item.Used}</td><td>{item.Avail}</td></tr>)
                                                })

                                                : <tr><td colSpan="4"></td></tr>
                                            }

                                            </tbody>
                                        </table>

                                        <h5 className="mt-4 mb-3">Memoria Ram</h5>

                                        <table className="table table-dark-theme table-bordered table-sm table-hover">
                                            <thead className="bg-dark text-white text-center">
                                            <tr>
                                                <th scope="col">Tamaño Memoria</th>
                                                <th scope="col">Memoria Usada</th>
                                                <th scope="col">Memoria Libre</th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-center">

                                            { memory ?

                                                memory.map(function (item) {
                                                    return (<tr><td>{item.Size}</td><td>{item.Used}</td><td>{item.Free}</td></tr>)
                                                })

                                                : <tr><td colSpan="3"></td></tr>
                                            }

                                            </tbody>
                                        </table>


                                    </div>


                                    <div className="tab-pane fade" id="pills-servicios" role="tabpanel" aria-labelledby="pills-servicios-tab">


                                        <h5 className="mt-4 mb-3">Servicios</h5>

                                        <table className="table table-sm table-dark-theme table-bordered">
                                            <thead className="bg-dark text-white text-center">
                                            <tr>
                                                <th scope="col">Tipo</th>
                                                <th scope="col">Servicio</th>
                                                <th scope="col">Puerto</th>
                                                <th scope="col">Estado </th>
                                                <th scope="col">Última Actualización</th>
                                                <th scope="col">Acciones </th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-center">

                                            { services ?

                                                services.map(function (item) {
                                                    return (<tr><td>{item.Tipo}</td><td>{item.Servicio}</td><td>{item.Puerto}</td><td>{item.Estado == 'OK' ? <i style={{color: '#449d44'}} className="fa fa-check fa-lg" aria-hidden="true"></i> : <i style={{color: '#d9534f'}} className="fa fa-times fa-lg" aria-hidden="true"></i> }</td><td>{item.fecha}</td>
                                                        <td>
                                                            <a onClick={ () => this.actionService(item.Servicio, 'restart') }><i className="fa-lg fa-sync fas" style={ styles.cursor } aria-hidden="true"></i></a>
                                                        </td></tr>)
                                                }, this)

                                                : <tr><td colSpan="6"></td></tr>
                                            }

                                            </tbody>
                                        </table>


                                    </div>

                                    <div className="tab-pane fade" id="pills-interfaces" role="tabpanel" aria-labelledby="pills-interfaces-tab">

                                        <table className="table mt-5 table-sm table-dark-theme table-bordered table-hover" >
                                            <thead className="bg-dark text-white text-center" >
                                            <tr>
                                                <th scope="col">Interfaz</th>
                                                <th scope="col">IPV4</th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-center">
                                            { interfaces ?

                                                interfaces.map(function (item, key) {
                                                    return (<tr><td>{item[key]["Interfaz"]}</td><td>{item[key]["IPV4"]}</td></tr>)
                                                })

                                                : <tr><td colSpan="2"></td></tr>
                                            }
                                            </tbody>
                                        </table>

                                    </div>

                                </div>
                    </div>

                </div>


            </div>
        );
    }
}

const styles = {
    cursor: {
        cursor: 'pointer'
    }
};


if (document.getElementById('component-monitor')) {
    ReactDOM.render(<Monitor />, document.getElementById('component-monitor'));
}
