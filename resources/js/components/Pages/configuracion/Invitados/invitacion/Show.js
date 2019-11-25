import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";

import "./css/invitacion.css";
export default class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            archivos: [],
            idEvento: props.match.params.id,
            empresa: "",
            opcion: "Invitacion",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true,
            isLoadingEmpresa: true,

        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        axios
            .post(
                "api/invitaciones/files",
                {
                    evento: this.state.idEvento
                },
                {
                    headers: { Authorization: this.state.api_token }
                }
            )
            .then(res => {
                console.log(res);
                this.setState({
                    archivos: res.data.data,
                    isLoading: false
                });
            });
    }

    handleDelete(id) {
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
                        "api/invitaciones/file/delete",
                        { id },
                        {
                            headers: { Authorization: this.state.api_token }
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
                    <Header usuario={this.state.user} history={this.props.history} />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <Link to="/invitacion">
                                                Invitación
                                            </Link>{" "}
                                            / Ver Archivos
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
                    <Header usuario={this.state.user} history={this.props.history} />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <Link to="/invitacion">
                                                Invitación
                                            </Link>{" "}
                                            / Ver Archivos
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
                                    {this.state.permisoUsuario.permisos.biblioteca.includes(
                                        "add"
                                    ) ? (
                                            <tr>
                                                <td>
                                                    <Link
                                                        to={{
                                                            pathname:
                                                                "/invitacion/add/",
                                                            state: {
                                                                idEvento: this.state
                                                                    .idEvento
                                                            }
                                                        }}
                                                        className="btn-sm btn-dark button-add p-2"
                                                    >
                                                        Agregar
                                                </Link>
                                                </td>
                                            </tr>
                                        ) : (
                                            ""
                                        )}
                                    <tr className="fila-head">
                                        <th className="text-center">TIPO</th>
                                        <th className="text-center">
                                            TAMAÑO IMAGEN
                                        </th>
                                        <th className="text-center">
                                            TAMAÑO PDF
                                        </th>
                                        <th className="text-center">
                                            ACCIONES
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.archivos.length == 0 ? (
                                        <div
                                            class="alert alert-danger mb-4"
                                            role="alert"
                                        >
                                            <i class="fas fa-info-circle" />
                                            &nbsp;No existen invitaciones.
                                        </div>
                                    ) : (
                                            this.state.archivos.map((e, index) => {
                                                return (
                                                    <tr key={index} id={e._id}>
                                                        <td className="text-center">
                                                            {e.Tipo ? e.Tipo : e.PlantillaNombre}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.SizeImagen}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.SizePdf}
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="text-center">
                                                                {this.state.permisoUsuario.permisos.biblioteca.includes(
                                                                    "delete"
                                                                ) ? (
                                                                        <div class="text-center">
                                                                            <a
                                                                                onClick={() => {
                                                                                    this.handleDelete(
                                                                                        e._id
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <i
                                                                                    data-toggle="tooltip"
                                                                                    data-placement="top"
                                                                                    title="Borrar"
                                                                                    className="fas fa-trash-alt icono-ver"
                                                                                />
                                                                            </a>
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
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
