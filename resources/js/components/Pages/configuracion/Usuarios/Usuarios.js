import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Biblioteca.css";

export default class Usuarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresas: JSON.parse(localStorage.getItem("empresas")),
            usuarios: [],
            opcion: "Eventos",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
    }

    componentDidMount() {
        axios
            .get("api/usuarios", {
                headers: {
                    Authorization: this.state.api_token
                }
            })
            .then(res => {
                this.setState({
                    usuarios: res.data.data,
                    isLoading: false
                });
            });
    }

    modalDelete(id) {
        Swal.fire({
            text: "¿Está seguro que desea borrar el usuario?",
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
                        "/api/usuarios/delete",
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
                                "usuario eliminado correctamente",
                                "success",
                                "sweet"
                            );
                            axios
                                .get("api/usuarios", {
                                    headers: {
                                        Authorization: this.state.api_token
                                    }
                                })
                                .then(res => {
                                    this.setState({
                                        usuarios: res.data.data,
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
                                            <i className="fas fa-user-cog page-header-heading-icon" />
                                            &nbsp; Usuarios
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
                                            <i className="fas fa-user-cog page-header-heading-icon" />
                                            &nbsp; Usuarios
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            {this.state.permisoUsuario.permisos.usuario.includes(
                                "add"
                            ) ? (
                                <div className="mb-4">
                                    <Link
                                        className="btn-sm btn-dark button-add p-2"
                                        to={"/usuarios/add/"}
                                    >
                                        Agregar Usuario
                                    </Link>
                                </div>
                            ) : (
                                ""
                            )}
                            <table
                                className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                                id="dt-eventos"
                            >
                                <thead>
                                    <tr className="fila-head">
                                        <th className="text-center">NOMBRE</th>
                                        <th className="text-center">
                                            APELLIDO
                                        </th>
                                        <th className="text-center">CORREO</th>
                                        <th className="text-center">EMPRESA</th>
                                        <th className="text-center">EVENTO</th>
                                        <th className="text-center">ROL</th>
                                        <th className="text-center">ESTADO</th>
                                        <th className="text-center">
                                            ACCIONES
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.usuarios.map((e, index) => {
                                        let linkEdit =
                                            "/usuarios/edit/" + e._id;
                                        let linkShow =
                                            "/usuarios/show/" + e._id;

                                        return (
                                            <tr key={index} id={e._id}>
                                                <td className="text-center">
                                                    {e.Nombre}
                                                </td>
                                                <td className="text-center">
                                                    {e.Apellido}
                                                </td>
                                                <td className="text-center">
                                                    {e.Correo}
                                                </td>
                                                <td className="text-center">
                                                    {e.Empresa}
                                                </td>
                                                <td className="text-center">
                                                    {e.Evento}
                                                </td>
                                                <td className="text-center">
                                                    {e.Rol}
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
                                                {this.state.permisoUsuario.permisos.usuario.includes(
                                                    "show"
                                                ) ? (
                                                    <td className="columna-icono">
                                                        <div className="text-center">
                                                            <Link
                                                                className="mr-2"
                                                                to={linkShow}
                                                            >
                                                                <i
                                                                    data-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Ver"
                                                                    className="fas fa-eye icono-ver"
                                                                />
                                                            </Link>
                                                            {this.state.permisoUsuario.permisos.usuario.includes(
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
                                                            {this.state.permisoUsuario.permisos.usuario.includes(
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
                                    })}
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
