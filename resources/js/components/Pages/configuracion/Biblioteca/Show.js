import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Biblioteca.css";

export default class Show extends React.Component {
    constructor() {
        super();
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            eventos: JSON.parse(localStorage.getItem("eventos")),
            evento: null,
            archivos: [],
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        console.log(this.props.match.params);
        let idEvento = this.props.match.params.id;

        axios
            .get(`api/eventos/${idEvento}`, {
                headers: {
                    Authorization: this.state.api_token
                }
            })
            .then(res => {
                let r = res.data;
                this.setState({
                    evento: r.evento
                });
                axios
                    .post(
                        "api/biblioteca/evento/files",
                        { evento: idEvento },
                        {
                            headers: {
                                Authorization: this.state.api_token
                            }
                        }
                    )
                    .then(res => {
                        console.log("abajo es archivos");
                        console.log(res);
                        if (res.data.code == "200") {
                            this.setState({
                                archivos: res.data.archivos,
                                isLoading: false
                            });
                        } else if (res.data.code == "600") {
                            console.log("entre a 600");
                            this.setState({
                                archivos: [],
                                isLoading: false
                            });
                        }
                    });
            });
    }

    handleDelete(id) {
        console.log("estoy aqui " + id);
        Swal.fire({
            text: "¿Está seguro que desea borrar el archivo?",
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
                        "/api/biblioteca/evento/files/delete",
                        {
                            id
                        },
                        {
                            headers: {
                                Authorization: this.state.api_token
                            }
                        }
                    )
                    .then(res => {
                        console.log(res.data);
                        if (res.data.code === 200) {
                            sweetalert(
                                "Item eliminado correctamente",
                                "success",
                                "sweet"
                            );
                            $("#" + id).remove();
                            for (
                                let i = 0;
                                i < this.state.eventos.length;
                                i++
                            ) {
                                if (this.state.eventos[i]._id == id) {
                                    this.state.eventos[i].Archivos--;
                                    localStorage.setItem(
                                        "eventos",
                                        JSON.stringify(this.state.eventos)
                                    );
                                }
                            }
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
                                            <i className="fas fa-book page-header-heading-icon" />
                                            &nbsp;
                                            <Link to="/biblioteca">
                                                Biblioteca
                                            </Link>
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
            console.log(this.state);
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
                                            &nbsp;
                                            <Link to="/biblioteca">
                                                Biblioteca
                                                {" " +
                                                    "/ " +
                                                    this.state.evento.Nombre}
                                            </Link>{" "}
                                            / Ver Archivos
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            {this.state.evento != null ? (
                                <table
                                    className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                                    id="dt-files"
                                >
                                    <thead>
                                        {console.log(
                                            this.state.permisoUsuario.permisos
                                                .biblioteca
                                        )}
                                        {this.state.permisoUsuario.permisos.biblioteca.includes(
                                            "add"
                                        ) ? (
                                            <tr>
                                                <td>
                                                    <Link
                                                        to={`/biblioteca/evento/add-file/${
                                                            this.props.match
                                                                .params.id
                                                        }`}
                                                        className="btn-sm btn-dark button-add p-2"
                                                    >
                                                        Agregar Archivo
                                                    </Link>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td>
                                                    <Link
                                                        to="/"
                                                        className="btn-sm btn-dark button-add p-2"
                                                        disabled
                                                    >
                                                        Agregar Archivo
                                                    </Link>
                                                </td>
                                            </tr>
                                        )}

                                        <tr className="fila-head">
                                            <th className="text-center">
                                                NOMBRE
                                            </th>
                                            {/*<th className="text-cent">TIPO</th>-*/}
                                            <th className="text-center">
                                                TAMAÑO
                                            </th>
                                            <th className="text-center">
                                                CATEGORIA
                                            </th>
                                            <th className="text-center">
                                                ACCIONES
                                            </th>
                                        </tr>
                                    </thead>
                                    {this.state.archivos.length > 0 ? (
                                        <tbody>
                                            {this.state.archivos.map(
                                                (e, index) => {
                                                    return (
                                                        <tr
                                                            key={index}
                                                            id={e._id}
                                                        >
                                                            <td className="text-center">
                                                                {e.Nombre}
                                                            </td>
                                                            <td className="text-center">
                                                                {e.Size}
                                                            </td>
                                                            <td className="text-center">
                                                                {e.Categoria}
                                                            </td>
                                                            <td className="text-center">
                                                                {this.state.permisoUsuario.permisos.biblioteca.includes(
                                                                    "delete"
                                                                ) ? (
                                                                    <div className="text-center">
                                                                        <a
                                                                            onClick={ev =>
                                                                                this.handleDelete(
                                                                                    e._id,
                                                                                    ev
                                                                                )
                                                                            }
                                                                        >
                                                                            <i
                                                                                data-toggle="tooltip"
                                                                                data-placement="top"
                                                                                title="Borrar"
                                                                                className="fas fa-trash-alt icono-eliminar"
                                                                            />
                                                                        </a>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center">
                                                                        <h3>
                                                                            No
                                                                            tienes
                                                                            permiso
                                                                            sobre
                                                                            este
                                                                            archivo
                                                                        </h3>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td className="text-center" colSpan="4">
                                                    <i className="fas fa-exclamation-triangle" />{" "}
                                                    No hay archivos asociados a
                                                    este evento
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            ) : (
                                <div
                                    className="alert alert-danger mb-4"
                                    role="alert"
                                >
                                    <i className="fas fa-info-circle" />
                                    &nbsp;No existen archivos.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }
}
