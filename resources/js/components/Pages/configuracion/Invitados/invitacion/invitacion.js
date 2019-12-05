import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";

import "./css/invitacion.css";
export default class Invitacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresas: [],
            infoEmpresas: [],
            empresa: "",
            opcion: "Invitacion",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true,
            isLoadingEmpresa: true
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        axios
            .get("api/empresas", {
                headers: { Authorization: this.state.api_token }
            })
            .then(res => {
                console.log(res);
                this.setState({
                    empresas: res.data.empresas,
                    isLoading: false
                });
                axios
                    .post(
                        "api/invitaciones/get-info",
                        {
                            empresa: "",
                            rol: this.state.permisoUsuario.nombre,
                            id: this.state.usuario._id
                        },
                        {
                            headers: { Authorization: this.state.api_token }
                        }
                    )
                    .then(res => {
                        console.log(res);
                        this.setState({
                            infoEmpresas: res.data.data,
                            isLoadingEmpresa: false
                        });
                    });
            });
    }

    handleChange(event) {
        this.setState({ isLoadingEmpresa: true });
        const target = event.target;
        const value = target.value;
        this.setState({
            empresa: value
        });
        axios
            .post(
                "api/invitaciones/get-info",
                {
                    empresa: value,
                    rol: this.state.permisoUsuario.nombre,
                    id: this.state.usuario._id
                },
                {
                    headers: { Authorization: this.state.api_token }
                }
            )
            .then(res => {
                console.log(res);
                this.setState({
                    infoEmpresas: res.data.data,
                    isLoadingEmpresa: false
                });
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Menu usuario={this.state.user} />
                    <Header  usuario={this.state.user} history={this.props.history}    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-calendar-week page-header-heading-icon" />
                                            &nbsp; Invitaciones
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div id="sweet" className="container-fluid">
                            <div className="row">
                                <div className="offset-6">
                                    <h3>
                                        <i className="fa fa-spinner fa-spin" />{" "}
                                        Cargando
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Menu usuario={this.state.user} />
                    <Header  usuario={this.state.user} history={this.props.history}    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-calendar-week page-header-heading-icon" />
                                            &nbsp; Invitacion
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <div className="row mb-4">
                                <div className="col-3">
                                    <label className="my-1 mr-2 form-control-sm">
                                        <strong>Empresa</strong>
                                    </label>
                                    {this.state.permisoUsuario.nombre ==
                                    "ADMINISTRADOR" ? (
                                        <select
                                            className="form-control form-control-sm my-1 mr-sm-2 col-12"
                                            id="pro-find-empresa"
                                            name="pro-find-empresa"
                                            onChange={this.handleChange}
                                            value={this.state.empresa}
                                        >
                                            <option value="">Todas</option>
                                            {this.state.empresas.map(
                                                (e, index) => {
                                                    return (
                                                        <option
                                                            value={e._id}
                                                            key={index}
                                                        >
                                                            {e.Nombre}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    ) : (
                                        <select
                                            className="form-control form-control-sm my-1 mr-sm-2 col-12"
                                            id="pro-find-empresa"
                                            name="pro-find-empresa"
                                            disabled
                                        >
                                            {this.state.empresas.map(
                                                (e, index) => {
                                                    return (
                                                        <option
                                                            value={e._id}
                                                            key={index}
                                                        >
                                                            {e.Nombre}
                                                        </option>
                                                    );
                                                }
                                            )}
                                            )}
                                        </select>
                                    )}
                                </div>

                                <div className="col-1 botones-tabla">
                                    <button
                                        id="p-buscar"
                                        className="btn btn-dark btn-sm mr-1"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Buscar"
                                    >
                                        <i
                                            className="fa fa-search"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                <div className="col-1 botones-tabla">
                                    <button
                                        id="p-limpiar"
                                        className="btn btn-dark btn-sm mr-1"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Limpiar Busqueda"
                                    >
                                        <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </div>

                            <table
                                className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                                id="dt-eventos"
                            >
                                <thead>
                                    <tr className="fila-head">
                                        <th className="text-center">EMPRESA</th>
                                        <th className="text-center">EVENTO</th>
                                        <th className="text-center">FECHA</th>
                                        <th className="text-center">APP</th>
                                        <th className="text-center">
                                            INVITACIONES
                                        </th>
                                        <th className="text-center">
                                            ACCIONES
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.isLoadingEmpresa ? (
                                        <div className="text-center">
                                            <h3>
                                                <i className="fa fa-spinner fa-spin" />{" "}
                                                Cargando
                                            </h3>
                                        </div>
                                    ) : (
                                        this.state.infoEmpresas.map(
                                            (e, index) => {
                                                return (
                                                    <tr key={index} id={e._id}>
                                                        <td className="text-center">
                                                            {e.Empresa}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.Evento}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.Fecha}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.App ? (
                                                                <i
                                                                    className="fa fa-check fa-lg icono-check"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <i
                                                                    style="color: #d9534f"
                                                                    className="fa fa-times fa-lg"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.Archivos}
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="text-center">
                                                                <Link
                                                                    to={
                                                                        `/invitacion/show/` +
                                                                        e._id
                                                                    }
                                                                >
                                                                    <i
                                                                        data-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Ver"
                                                                        className="fas fa-eye icono-ver"
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    )}
                                </tbody>
                            </table>

                            {/**esto de abajo es de php, es el texto que cambia con el menu */}
                            <footer className="content-wrapper-footer">
                                <span>{this.state.footer}</span>
                            </footer>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
