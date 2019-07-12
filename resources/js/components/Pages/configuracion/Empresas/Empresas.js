import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

import "../../css/configuracion/Empresas.css";

export default class Empresas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            empresasTabla: JSON.parse(localStorage.getItem("empresasTabla")),
            opcion: "Empresas",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            user: this.props.location.state,
            isLoading: true
        };
        this.modalDelete = this.modalDelete.bind(this);
    }

    getEmpresasTabla() {
        axios
            .post("api/empresas/tabla/", {
                rol: this.state.permisoUsuario.nombre,
                id: this.state.usuario._id
            })
            .then(res => {
                console.log("esta es la respuesta");
                console.log(res);
                localStorage.setItem("empresasTabla", JSON.stringify(res.data));
                this.setState({
                    empresasTabla: res.data,
                    isLoading: false
                });
            });
    }

    modalDelete(id) {
        console.log("el id de la funcion a eliminar fue este " + id);
        Swal.fire({
            text:
                "¿Está seguro que desea borrar la empresa? Al decir que si, se eliminará todo lo relacionado con la misma (eventos).",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#343a40",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            target: document.getElementById("sweet")
        }).then(result => {
            if (result.value) {
                axios.post("/api/empresas/delete/", { id: id }).then(res => {
                    console.log(res);
                    let r = res.data;
                    if (r.code === 200) {
                        sweetalert(
                            "Item eliminado correctamente",
                            "success",
                            "sweet"
                        );
                        console.log("voy a eliminar este id" + id);
                        $("#" + id)
                            .closest("tr")
                            .remove();
                        axios
                            .post("api/empresas/tabla/", {
                                rol: this.state.permisoUsuario.nombre,
                                id: this.state.usuario._id
                            })
                            .then(res => {
                                localStorage.setItem(
                                    "empresasTabla",
                                    JSON.stringify(res.data)
                                );
                                this.props.history.push("/empresas");
                            });
                    } else if (r.code === 600) {
                        sweetalert(
                            "Error en el Proceso de Eliminacion. Consulte al Administrador",
                            "error",
                            "sweet"
                        );
                    } else if (r.code == 500) {
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
        if (!JSON.parse(localStorage.getItem("empresasTabla"))) {
            console.log("no esta en local storage");
            this.getEmpresasTabla();
        } else {
            console.log("esta en local storage");
            this.state.isLoading = false;
        }
        console.log(this.state.empresasTabla);
        if (this.state.isLoading) {
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
                                            <i className="fas fa-tachometer-alt page-header-heading-icon" />
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
                                        Cagargando
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            console.log(this.state.permisoUsuario);
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
                                            <i className="fas fa-tachometer-alt page-header-heading-icon" />
                                            {this.state.opcion}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="sweet" className="container-fluid">
                            <table
                                className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                                id="dt-empresas"
                            >
                                <thead>
                                    {this.state.permisoUsuario.permisos.empresa.includes(
                                        "add"
                                    ) ? (
                                        <tr>
                                            <td>
                                                <Link
                                                    to="/empresas/add/"
                                                    className="btn-sm btn-dark button-add p-2"
                                                >
                                                    Agregar Archivo
                                                </Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        ""
                                    )}
                                    <tr className="fila-head">
                                        <th className="text-center">NOMBRE</th>
                                        <th className="text-center">CORREO</th>
                                        <th className="text-center">
                                            TELÉFONO
                                        </th>
                                        <th className="text-center">PAÍS</th>
                                        <th className="text-center">ESTADO</th>
                                        <th className="text-center">
                                            ACCIONES
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.empresasTabla.map(
                                        (e, index) => {
                                            let linkEdit =
                                                "/empresas/edit/" + e._id;
                                            let linkShow =
                                                "/empresas/show/" + e._id;
                                            let linkEvento = "/empresa/eventos";
                                            console.log(
                                                "el id del siguiente es este " +
                                                    e._id
                                            );
                                            return (
                                                <tr key={index} id={e._id}>
                                                    <td className="text-center">
                                                        {e.Nombre}
                                                    </td>
                                                    <td className="text-center">
                                                        {e.Correo}
                                                    </td>
                                                    <td className="text-center">
                                                        {e.Telefono}
                                                    </td>
                                                    <td className="text-center">
                                                        {e.Pais}
                                                    </td>
                                                    <td className="text-center">
                                                        {" "}
                                                    </td>
                                                    {this.state.permisoUsuario.permisos.empresa.includes(
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
                                                                {this.state.permisoUsuario.permisos.empresa.includes(
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
                                                                {this.state.permisoUsuario.permisos.empresa.includes(
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
                                                                {this.state.permisoUsuario.permisos.empresa.includes(
                                                                    "evento"
                                                                ) ? (
                                                                    <Link
                                                                        className="mr-2"
                                                                        to={{
                                                                            pathname:
                                                                                linkEvento +
                                                                                "/" +
                                                                                e._id,
                                                                            state: {
                                                                                empresaId:
                                                                                    e._id
                                                                            }
                                                                        }}
                                                                    >
                                                                        <i
                                                                            data-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Evento"
                                                                            className="fas fa-calendar-week icono-ver"
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
