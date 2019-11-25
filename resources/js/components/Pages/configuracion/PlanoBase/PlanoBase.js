import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

export default class PlanoBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            idEmpresa: props.match.params.id,
            empresa: "",
            etapas: [],
            planos: [],
            opcion: "Etapas",
            footer: "Footer",
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
    }

    componentDidMount() {
        axios
            .get(`api/empresas/${this.state.idEmpresa}`, {
                headers: {
                    Authorization: this.state.api_token
                }
            })
            .then(res => {
                console.log(res);
                let r = res.data;
                this.setState(() => ({
                    empresa: r.data.empresa
                }));
                axios
                    .post(
                        "api/planos/empresa",
                        { secretKey: this.state.empresa.secretKey },
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
                                            &nbsp; Planos
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
                                            <i className="fas fa-ticket-alt page-header-heading-icon" />
                                            <Link to="/empresas">
                                                Empresas /
                                            </Link>
                                            &nbsp; Planos base
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>
                        {console.log(this.state.empresa._id)}

                        <div id="sweet" className="container-fluid">
                            <div className="row mb-4">
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
                                                        to={{
                                                            pathname:
                                                                "/empresa/planos-base/add/",
                                                            state: {
                                                                designerKey: this
                                                                    .state
                                                                    .empresa
                                                                    .designerKey,
                                                                idEmpresa: this
                                                                    .state
                                                                    .empresa._id
                                                            }
                                                        }}
                                                    >
                                                        Agregar plano base
                                                    </Link>
                                                </td>
                                            </tr>
                                        ) : (
                                            ""
                                        )}
                                        <tr className="fila-head">
                                            <th className="text-center">
                                                Plano
                                            </th>
                                            <th className="text-center">
                                                PREVIEW
                                            </th>
                                            <th className="text-center">
                                                ACCIONES
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.planos.map((e, index) => {
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
                                                                            "/empresa/planos-base/edit/" +
                                                                            e.key,
                                                                        state: {
                                                                            empresa: this
                                                                                .state
                                                                                .empresa
                                                                        }
                                                                    }}
                                                                >
                                                                    {console.log(
                                                                        this
                                                                            .state
                                                                    )}
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
