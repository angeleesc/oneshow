import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Biblioteca.css";

export default class Biblioteca extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresas: JSON.parse(localStorage.getItem("empresas")),
            opcion: "Biblioteca",
            empresa: "",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            user: this.props.location.state,
            api_token: localStorage.getItem("api_token"),
            isLoading: true,
            isLoadingEmpresa: false
        };
        this.handleFiltro = this.handleFiltro.bind(this);
    }

    /**
     * Traer por api toda la informacion de los eventos para llenar la info de la tabal
     */
    componentDidMount() {
        var rol = this.state.permisoUsuario.nombre;
        var id;
        if (this.state.permisoUsuario.nombre == "ADMINISTRADOR") {
            id = this.state.usuario._id;
        } else if (this.state.permisoUsuario.nombre == "EMPRESA") {
            id = this.state.usuario.Empresa_id;
        } else {
            id = this.state.usuario.Evento_id;
        }
        axios
            .post(
                "api/biblioteca",
                {
                    rol,
                    id
                },
                {
                    headers: {
                        Authorization: this.state.api_token
                    }
                }
            )
            .then(res => {
                console.log(res);
                localStorage.setItem("eventos", JSON.stringify(res.data));
                this.setState({
                    eventos: res.data,
                    eventosCompletos: res.data
                });
                axios
                    .get("api/empresas", {
                        headers: {
                            Authorization: this.state.api_token
                        }
                    })
                    .then(res => {
                        let r = res.data;
                        console.log(r);
                        localStorage.setItem(
                            "empresas",
                            JSON.stringify(r.empresas)
                        );
                        this.setState({
                            empresas: r.empresas,
                            isLoading: false
                        });
                    });
            });
    }

    handleFiltro(event) {
        const target = event.target;
        const value =
            target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
            isLoadingEmpresa: true
        });
        if (value == "todas") {
            this.setState({
                isLoadingEmpresa: false,
                eventos: this.state.eventosCompletos
            });
        } else {
            console.log(this.state.eventosCompletos);
            console.log(value);
            var eventos = [];
            for (var j = 0; j < this.state.eventosCompletos.length; j++) {
                if (this.state.eventosCompletos[j].Empresa_id == value) {
                    eventos.push(this.state.eventosCompletos[j]);
                }
            }
            this.setState({
                eventos,
                isLoadingEmpresa: false
            });
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Menu usuario={this.state.user} />
                    <Header
                        usuario={this.state.user}
                        history={this.props.history}
                    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-book page-header-heading-icon" />
                                            {this.state.opcion}
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
                    <Header
                        usuario={this.state.user}
                        history={this.props.history}
                    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-tachometer-alt page-header-heading-icon" />
                                            {this.state.opcion}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <div className="form-inline mb-3">
                                <label className="my-1 mr-2 form-control-sm">
                                    <strong>Empresa</strong>
                                </label>
                                {this.state.permisoUsuario.nombre ==
                                "ADMINISTRADOR" ? (
                                    <select
                                        className="form-control form-control-sm my-1 mr-sm-2 col-2"
                                        id="pro-find-empresa"
                                        name="empresa"
                                        onChange={this.handleFiltro}
                                        value={this.state.empresa}
                                    >
                                        <option value="todas">Todas</option>
                                        {this.state.empresas.map((e, index) => {
                                            return (
                                                <option
                                                    value={e._id}
                                                    key={index}
                                                >
                                                    {e.Nombre}
                                                </option>
                                            );
                                        })}
                                    </select>
                                ) : (
                                    <select
                                        className="form-control form-control-sm my-1 mr-sm-2 col-2"
                                        id="pro-find-empresa"
                                        name="empresa"
                                        onChange={this.handleFiltro}
                                        value={this.state.usuario.Empresa_id}
                                        disabled
                                    >
                                        <option value="todas">Todas</option>
                                        {this.state.empresas.map((e, index) => {
                                            return (
                                                <option
                                                    value={e._id}
                                                    key={index}
                                                >
                                                    {e.Nombre}
                                                </option>
                                            );
                                        })}
                                    </select>
                                )}

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
                                            ARCHIVOS
                                        </th>
                                        <th className="text-center">
                                            ACCIONES
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.isLoadingEmpresa ? (
                                        <h3>
                                            <i className="fa fa-spinner fa-spin" />{" "}
                                            Cargando
                                        </h3>
                                    ) : (
                                        this.state.eventos.map((e, index) => {
                                            console.log(e);
                                            let link =
                                                "/biblioteca/evento/" + e._id;
                                            return (
                                                <tr key={index}>
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
                                                    {this.state.permisoUsuario.permisos.biblioteca.includes(
                                                        "show"
                                                    ) ? (
                                                        <td className="columna-icono">
                                                            <Link to={link}>
                                                                <i
                                                                    data-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Ver"
                                                                    className="fas fa-eye icono-ver"
                                                                />
                                                            </Link>
                                                        </td>
                                                    ) : (
                                                        ""
                                                    )}
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/**esto de abajo es de php, es el texto que cambia con el menu */}
                        <footer className="content-wrapper-footer">
                            <span>{this.state.footer}</span>
                        </footer>
                    </div>
                </div>
            );
        }
    }
}
