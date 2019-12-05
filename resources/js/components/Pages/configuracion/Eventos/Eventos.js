import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Biblioteca.css";

export default class Eventos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresas: JSON.parse(localStorage.getItem("empresas")),
            idEmpresa: this.props.match.params.id,
            empresa: "",
            eventosEmpresa: [],
            opcion: "Eventos",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
    }

    componentDidMount() {
        if (this.state.permisoUsuario.nombre == "EVENTO") {
            axios
                .get("api/eventos/one/" + this.state.usuario.Evento_id, {
                    headers: {
                        Authorization: this.state.api_token
                    }
                })
                .then(res => {
                    console.log(res);
                    var eventosArray = [];
                    eventosArray.push(res.data.evento.evento);
                    this.setState({
                        eventosEmpresa: eventosArray,
                        empresa: res.data.evento.empresa,
                        isLoading: false
                    });
                });
        } else {
            axios
                .post(
                    "api/eventos/empresa",
                    {
                        idEmpresa: this.state.idEmpresa,
                        rol: this.state.permisoUsuario.nombre
                    },
                    {
                        headers: {
                            Authorization: this.state.api_token
                        }
                    }
                )
                .then(res => {
                    console.log(res);
                    axios
                        .get("api/eventos/actu", {
                            headers: {
                                Authorization: this.state.api_token
                            }
                        })
                        .then(res => {
                            console.log(res);
                        });
                    this.setState({
                        eventosEmpresa: res.data.eventos,
                        empresa: res.data.empresa,
                        isLoading: false
                    });
                });
        }
    }

    modalDelete(id) {
        Swal.fire({
            text: "¿Está seguro que desea borrar el evento?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#343a40",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            target: document.getElementById("sweet")
        }).then(result => {
            if (result.value) {
                axios
                    .post(
                        "/api/eventos/delete",
                        { id },
                        {
                            headers: {
                                Authorization: this.state.api_token
                            }
                        }
                    )
                    .then(res => {
                        if (res.data.code === 200) {
                            sweetalert(
                                "Item eliminado correctamente",
                                "success",
                                "sweet"
                            );
                            $("#" + id).hide;
                            axios
                                .post(
                                    "api/eventos/empresa",
                                    {
                                        idEmpresa: this.state.idEmpresa,
                                        rol: this.state.permisoUsuario.nombre
                                    },
                                    {
                                        headers: {
                                            Authorization: this.state.api_token
                                        }
                                    }
                                )
                                .then(res => {
                                    this.setState({
                                        eventosEmpresa: res.data.eventos,
                                        isLoading: false
                                    });
                                });
                        } else if (res.data.code === 600) {
                            sweetalert(
                                "Error en el Proceso de Eliminacion. Consulte al Administrador",
                                "error",
                                "sweet"
                            );
                        } else if (res.data.code == 500) {
                            sweetalert(
                                "Error al Eliminar. Consulte al Administrador",
                                "error",
                                "sweet"
                            );
                        }
                    });
            }
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
                                            <i className="fas fa-calendar-week page-header-heading-icon" />
                                            &nbsp;
                                            <Link to="/empresas">
                                                Empresa
                                            </Link>{" "}
                                            / Eventos
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
                    <Header usuario={this.state.user} />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-industry page-header-heading-icon" />
                                            &nbsp;
                                            <Link to="/empresas">
                                                Empresa
                                                {" " +
                                                    "/ " +
                                                    this.state.empresa.Nombre}
                                            </Link>{" "}
                                            / Eventos
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <table
                                className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                                id="dt-eventos"
                            >
                                <thead>
                                    {this.state.permisoUsuario.permisos.evento.includes(
                                        "add"
                                    ) ? (
                                        <tr>
                                            <td>
                                                <Link
                                                    className="btn-sm btn-dark button-add p-2"
                                                    to={
                                                        "/eventos/add/" +
                                                        this.state.idEmpresa
                                                    }
                                                >
                                                    Agregar Evento
                                                </Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        ""
                                    )}
                                    <tr className="fila-head">
                                        <th className="text-center">NOMBRE</th>
                                        <th className="text-center">
                                            ID EVENTO
                                        </th>
                                        <th className="text-center">FECHA</th>
                                        <th className="text-center">PAÍS</th>
                                        <th className="text-center">APP</th>
                                        <th className="text-center">ESTADO</th>
                                        <th className="text-center">
                                            ACCIONES
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.eventosEmpresa.map(
                                        (e, index) => {
                                            console.log(e);
                                            let linkEdit =
                                                "/eventos/edit/" + e._id;
                                            let linkShow =
                                                "/eventos/show/" + e._id;

                                            return (
                                                <tr key={index} id={e._id}>
                                                    <td className="text-center">
                                                        {e.Nombre}
                                                    </td>
                                                    <td className="text-center">
                                                        {e.IDEvento}
                                                    </td>
                                                    <td className="text-center">
                                                        {e.Fecha}
                                                    </td>
                                                    <td className="text-center">
                                                        {e.Pais}
                                                    </td>
                                                    <td className="text-center">
                                                        {e.Activo ? (
                                                            <span className="badge badge-success badge-dt">
                                                                activo
                                                            </span>
                                                        ) : (
                                                            <span className="badge badge-danger badge-dt">
                                                                inactivo
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        {e.App ? (
                                                            <i
                                                                className="fa fa-check fa-lg icono-check"
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <i
                                                                className="fa fa-times fa-lg boton-negado"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                    </td>
                                                    {this.state.permisoUsuario.permisos.evento.includes(
                                                        "show"
                                                    ) ? (
                                                        <td className="columna-icono">
                                                            <div className="text-center">
                                                                <Link
                                                                    className="mr-2"
                                                                    to={
                                                                        linkShow
                                                                    }
                                                                >
                                                                    <i
                                                                        data-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Ver"
                                                                        className="fas fa-eye icono-ver"
                                                                    />
                                                                </Link>
                                                                {this.state.permisoUsuario.permisos.evento.includes(
                                                                    "edit"
                                                                ) ? (
                                                                    <Link
                                                                        className="mr-2"
                                                                        to={
                                                                            linkEdit
                                                                        }
                                                                    >
                                                                        <i
                                                                            data-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Editar"
                                                                            className="fas fa-edit icono-ver"
                                                                        />
                                                                    </Link>
                                                                ) : (
                                                                    ""
                                                                )}
                                                                {this.state.permisoUsuario.permisos.evento.includes(
                                                                    "edit"
                                                                ) ? (
                                                                    <Link
                                                                        className="mr-2"
                                                                        to={{
                                                                            pathname:
                                                                                "/eventos/etapas/" +
                                                                                e._id,
                                                                            state: {
                                                                                link:
                                                                                    "/empresa/eventos/" +
                                                                                    this
                                                                                        .state
                                                                                        .idEmpresa,
                                                                                nombreEmpresa: this
                                                                                    .state
                                                                                    .empresa
                                                                                    .Nombre
                                                                            }
                                                                        }}
                                                                    >
                                                                        <i
                                                                            data-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Etapas"
                                                                            className="fas fa-ticket-alt icono-ver"
                                                                        />
                                                                    </Link>
                                                                ) : (
                                                                    ""
                                                                )}
                                                                {this.state.permisoUsuario.permisos.evento.includes(
                                                                    "edit"
                                                                ) ? (
                                                                    <Link
                                                                        className="mr-2"
                                                                        to={{
                                                                            pathname:
                                                                                "/eventos/planos/" +
                                                                                e._id,
                                                                            state: {
                                                                                link:
                                                                                    "/empresa/eventos/" +
                                                                                    this
                                                                                        .state
                                                                                        .idEmpresa,
                                                                                nombreEmpresa: this
                                                                                    .state
                                                                                    .empresa
                                                                                    .Nombre
                                                                            }
                                                                        }}
                                                                    >
                                                                        <i
                                                                            data-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Planos"
                                                                            className="fas fa-chair icono-ver"
                                                                        />
                                                                    </Link>
                                                                ) : (
                                                                    ""
                                                                )}
                                                                {this.state.permisoUsuario.permisos.evento.includes(
                                                                    "delete"
                                                                ) ? (
                                                                    <Link className="mr-2">
                                                                        <i
                                                                            data-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Eliminar"
                                                                            className="fas fa-trash-alt icono-ver"
                                                                            onClick={ev =>
                                                                                this.modalDelete(
                                                                                    e._id,
                                                                                    ev
                                                                                )
                                                                            }
                                                                        />
                                                                    </Link>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        ""
                                                    )}
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
            );
        }
    }
}
