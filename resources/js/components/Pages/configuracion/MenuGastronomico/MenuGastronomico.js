import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

export default class MenuGastronomico extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            evento: "",
            etapas: [],
            planos: [],
            opcion: "Etapas",
            footer: "Footer",
            api_token: localStorage.getItem("api_token"),
            isLoading: false
        };
    }

    componentDidMount() {
        /*
        axios
            .get("api/etapas/evento/" + this.state.idEvento, {
                headers: { Authorization: this.state.api_token }
            })
            .then(res => {
                console.log(res);
                console.log(this.state.api_token);
                var evento = res.data.evento;
                this.setState({
                    evento: res.data.evento
                });
                axios
                    .post(
                        "api/planos/evento",
                        { idEvento: evento._id },
                        {
                            headers: { Authorization: this.state.api_token }
                        }
                    )
                    .then(res => {
                        console.log(res);
                        this.setState({
                            planos: res.data.data,
                            isLoading: false
                        });
                    });
            });
        */
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
                                            <i className="fas fa-ticket-alt page-header-heading-icon" />
                                            &nbsp; Menu gastronomico etapa
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
                    <Menu usuario={this.state.usuario} />
                    <Header
                        usuario={this.state.usuario}
                        history={this.props.history}
                    />
                    <div className="content-wrapper">
                        <header className="page-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12">
                                        <h1 className="page-header-heading">
                                            <i className="fas fa-ticket-alt page-header-heading-icon" />
                                            Menu gastronomico etapa
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
                                        {/*this.state.permisoUsuario.permisos.evento.includes(
                                            "add"
                                        ) ? (
                                            <tr>
                                                <td>
                                                    <Link
                                                        className="btn-sm btn-dark button-add p-2"
                                                        to={{
                                                            pathname:
                                                                "/eventos/planos/add/" +
                                                                this.state
                                                                    .idEvento,
                                                            state: {
                                                                idEmpresa: this
                                                                    .state
                                                                    .evento
                                                                    .Empresa_id
                                                            }
                                                        }}
                                                    >
                                                        Agregar plano
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        className="btn-sm btn-dark button-add p-2"
                                                        to={{
                                                            pathname:
                                                                "/evento/planos/planos-base-copia/" +
                                                                this.state
                                                                    .idEvento,
                                                            state: {
                                                                evento: this
                                                                    .state
                                                                    .evento,
                                                                idEmpresa: this
                                                                    .state
                                                                    .evento
                                                                    .Empresa_id
                                                            }
                                                        }}
                                                    >
                                                        Agregar Plano a partir
                                                        de uno base
                                                    </Link>
                                                </td>
                                            </tr>
                                        ) : (
                                            ""
                                        )*/}
                                        <tr className="fila-head">
                                            <th className="text-center">
                                                ETAPA
                                            </th>
                                            <th className="text-center">
                                                TÍTULO
                                            </th>
                                            <th className="text-center">
                                                DESCRIPCIÓN
                                            </th>
                                            <th className="text-center">
                                                ESTADO
                                            </th>
                                            <th class="text-center">
                                                ACCIONES
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {/*this.state.planos.map((e, index) => {
                                            return (
                                                <tr key={index} id={e._id}>
                                                    <td className="text-center">
                                                        {e.name}
                                                    </td>
                                                    <td className="text-center">
                                                        <img
                                                            src={
                                                                e.publishedVersionThumbnailUrl
                                                            }
                                                            width="300"
                                                            height="300"
                                                        />
                                                    </td>

                                                    <td className="text-center">
                                                        <div className="text-center">
                                                            {this.state.permisoUsuario.permisos.evento.includes(
                                                                "edit"
                                                            ) ? (
                                                                <Link
                                                                    className="mr-2"
                                                                    to={{
                                                                        pathname:
                                                                            "/eventos/planos/edit/" +
                                                                            e.key,
                                                                        state: {
                                                                            link: this
                                                                                .state
                                                                                .eventoLink,
                                                                            nombreEmpresa: this
                                                                                .state
                                                                                .nombreEmpresa,
                                                                            idEmpresa: this
                                                                                .state
                                                                                .evento
                                                                                .Empresa_id,
                                                                            idEvento: this
                                                                                .state
                                                                                .idEvento,
                                                                            designerKey: this
                                                                                .state
                                                                                .evento
                                                                                .designerKey
                                                                        }
                                                                    }}
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
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })*/}
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
