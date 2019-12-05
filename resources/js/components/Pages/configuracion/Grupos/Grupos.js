import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "./css/grupos.css";
export default class Grupos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            grupos: [],
            opcion: "Grupos",
            footer: "Footer",
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
    }

    componentDidMount() {
        axios
            .get("api/grupos", {
                headers: { Authorization: this.state.api_token }
            })
            .then(res => {
                console.log(res);
                this.setState({
                    grupos: res.data.grupos,
                    isLoading: false
                });
            });
    }

    modalDelete(id) {
        Swal.fire({
            text: "¿Está seguro que desea borrar el grupo?",
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
                        "/api/grupos/delete",
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
                            $("#" + id).hide();
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
                                            <i className="fas fa-users page-header-heading-icon" />
                                            &nbsp; Grupos
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
            console.log(this.state.permisoUsuario.permisos);
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
                                            <i className="fas fa-users page-header-heading-icon" />
                                            &nbsp; Grupos
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <div className="row mb-4">
                                <table
                                    className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                                    id="dt-eventos"
                                >
                                    <thead>
                                        {this.state.permisoUsuario.nombre ==
                                        "ADMINISTRADOR" ? (
                                            <tr>
                                                <td>
                                                    <Link
                                                        className="btn-sm btn-dark button-add p-2"
                                                        to={"/grupos/add/"}
                                                    >
                                                        Agregar Grupo
                                                    </Link>
                                                </td>
                                            </tr>
                                        ) : (
                                            ""
                                        )}
                                        <tr className="fila-head">
                                            <th className="text-center">
                                                GRUPOS
                                            </th>
                                            <th className="text-center">
                                                ACCIONES
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.grupos.map((e, index) => {
                                            return (
                                                <tr key={index} id={e._id}>
                                                    <td className="text-center">
                                                        {e.Nombre}
                                                    </td>

                                                    <td className="text-center">
                                                        <div className="text-center">
                                                            {this.state.permisoUsuario.permisos.evento.includes(
                                                                "edit"
                                                            ) ? (
                                                                <Link
                                                                    className="mr-2"
                                                                    to={
                                                                        "/grupos/edit/" +
                                                                        e._id
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
                </div>
            );
        }
    }
}
