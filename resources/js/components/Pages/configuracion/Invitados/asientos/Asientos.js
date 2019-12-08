import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";
export default class Asientos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            invitados: [],
            opcion: "Invitacion",
            footer: "Footer",
            empresa: "",
            empresas: [],
            eventos: [],
            grupos: [],
            evento: "",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true,
            isLoadingEmpresa: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFiltroEvento = this.handleFiltroEvento.bind(this);
        this.handleFiltroEmpresa = this.handleFiltroEmpresa.bind(this);
        this.handleFiltroGrupo = this.handleFiltroGrupo.bind(this);
    }

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
                "api/invitados/all",
                {
                    id,
                    rol
                },
                {
                    headers: { Authorization: this.state.api_token }
                }
            )
            .then(res => {
                console.log(res);
                this.setState({
                    invitados: res.data.invitados,
                    invitadosCompletos: res.data.invitados,
                    empresas: res.data.empresas,
                    eventos: res.data.eventos,
                    grupos: res.data.grupos,
                    isLoading: false
                });
                console.log(this.state);
            });
    }

    handleFiltroEmpresa(event) {
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
                invitados: this.state.invitadosCompletos
            });
        } else {
            console.log(this.state.invitadosCompletos);
            console.log(value);
            var invitados = [];
            for (var j = 0; j < this.state.invitadosCompletos.length; j++) {
                console.log(this.state.invitadosCompletos[j].Empresa_id.$oid);
                console.log(value);
                if (this.state.invitadosCompletos[j].Empresa_id.$oid == value) {
                    invitados.push(this.state.invitadosCompletos[j]);
                }
            }
            this.setState({
                invitados
            });
        }
    }

    handleFiltroEvento(event) {
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
                invitados: this.state.invitadosCompletos
            });
        } else {
            var invitados = [];
            for (var j = 0; j < this.state.invitadosCompletos.length; j++) {
                console.log(this.state.invitadosCompletos[j].Evento_id);
                console.log(value);
                if (this.state.invitadosCompletos[j].Evento_id == value) {
                    invitados.push(this.state.invitadosCompletos[j]);
                }
            }
            this.setState({
                invitados
            });
        }
    }

    handleFiltroGrupo(event) {
        const target = event.target;
        const value = target.value;
        console.log(value);
        console.log(name);
        const name = target.name;
        this.setState({
            [name]: value,
            isLoadingEmpresa: true
        });

        if (value == "todas") {
            this.setState({
                isLoadingEmpresa: false,
                invitados: this.state.invitadosCompletos
            });
        } else {
            var invitados = [];
            for (var j = 0; j < this.state.invitadosCompletos.length; j++) {
                console.log(this.state.invitadosCompletos[j].Grupo_id);
                console.log(value);
                if (this.state.invitadosCompletos[j].Grupo_id == value) {
                    invitados.push(this.state.invitadosCompletos[j]);
                }
            }
            this.setState({
                invitados
            });
        }
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
                                            <i className="fas fa-user-friends page-header-heading-icon" />
                                            &nbsp; Asientos
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
                                            <i className="fas fa-user-friends page-header-heading-icon" />
                                            &nbsp; Asientos
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <div className="row mb-4">
                                <label className="my-1 mr-2 form-control-sm">
                                    <strong>Empresa</strong>
                                </label>
                                <div className="col-3">
                                    {this.state.permisoUsuario.nombre ==
                                    "ADMINISTRADOR" ? (
                                        <select
                                            className="form-control form-control-sm my-1 mr-sm-2 col-10"
                                            id="pro-find-empresa"
                                            name="empresa"
                                            onChange={this.handleFiltroEmpresa}
                                            value={this.state.empresa}
                                        >
                                            <option value="todas">Todas</option>
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
                                            className="form-control form-control-sm my-1 mr-sm-2 col-10"
                                            id="pro-find-empresa"
                                            name="empresa"
                                            onChange={this.handleFiltroEmpresa}
                                            value={
                                                this.state.usuario.Empresa_id
                                            }
                                            disabled
                                        >
                                            <option value="todas">Todas</option>
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
                                    )}
                                </div>
                                <label className="my-1 mr-2 form-control-sm">
                                    <strong>Evento</strong>
                                </label>
                                <div className="col-3">
                                    {this.state.permisoUsuario.nombre ==
                                    "ADMINISTRADOR" ? (
                                        <select
                                            className="form-control form-control-sm my-1 mr-sm-2 col-10"
                                            id="pro-find-empresa"
                                            name="evento"
                                            onChange={this.handleFiltroEvento}
                                            value={this.state.evento}
                                        >
                                            <option value="todas">Todas</option>
                                            {this.state.eventos.map(
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
                                            className="form-control form-control-sm my-1 mr-sm-2 col-10"
                                            id="pro-find-empresa"
                                            name="evento"
                                            onChange={this.handleFiltroEvento}
                                            value={
                                                this.state.usuario.Empresa_id
                                            }
                                            disabled
                                        >
                                            <option value="todas">Todas</option>
                                            {this.state.eventos.map(
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
                                    )}
                                </div>
                                <label className="mt-1 mr-2 form-control-sm">
                                    <strong>Grupo</strong>
                                </label>
                                <div className="col-3">
                                    <select
                                        className="form-control form-control-sm my-1 mr-sm-2 col-10"
                                        id="pro-find-empresa"
                                        name="grupo"
                                        onChange={this.handleFiltroGrupo}
                                        value={this.state.grupo}
                                    >
                                        <option value="todas">Todas</option>
                                        {this.state.grupos.map((e, index) => {
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
                                </div>

                                <table
                                    className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                                    id="dt-eventos"
                                >
                                    <thead>
                                        <tr className="fila-head">
                                            <th className="text-center">
                                                NOMBRE
                                            </th>
                                            <th className="text-center">
                                                GRUPO
                                            </th>
                                            <th className="text-center">
                                                ACCIONES
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.invitados.map(
                                            (e, index) => {
                                                return (
                                                    <tr key={index} id={e._id}>
                                                        <td className="text-center">
                                                            {e.Nombre +
                                                                " " +
                                                                e.Apellido}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.Grupo}
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="text-center">
                                                                <Link
                                                                    to={{
                                                                        pathname:
                                                                            "/asientos/planos",
                                                                        state: {
                                                                            idEvento:
                                                                                e.Evento_id,
                                                                            idInvitado:
                                                                                e.Invitado_id
                                                                        }
                                                                    }}
                                                                    className="mr-2"
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
                </div>
            );
        }
    }
}
