import React, { Component } from "react";
//import { SeatsioSeatingChart } from "@seatsio/seatsio-react";
import { SeatsioDesigner } from "@seatsio/seatsio-react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";
import "../Planos/css/planos.css";

export default class Add extends Component {
    constructor(props) {
        console.log(props.location.state);
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            nombre: "",
            idEmpresa: props.location.state.idEmpresa,
            designerKey: props.location.state.designerKey,
            chartKey: "",
            evento: "",
            opcion: "Etapas",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: false
        };
        this.chartKeyGenerate = this.chartKeyGenerate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    chartKeyGenerate(key) {
        this.setState({ chartKey: key });
    }

    handleSubmit(e) {
        e.preventDefault();
        $("#boton-plano").prepend('<i class="fa fa-spinner fa-spin"></i> ');
        axios
            .post(
                "api/planos/add-plano-base",
                {
                    idEmpresa: this.state.idEmpresa,
                    chartKey: this.state.chartKey
                },
                {
                    headers: {
                        Authorization: this.state.api_token
                    }
                }
            )
            .then(res => {
                console.log(res);
                if (res.data.code === 200) {
                    Swal.fire({
                        text: "Plano agregado exitosamente",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#343a40",
                        confirmButtonText: "OK",
                        target: document.getElementById("sweet")
                    }).then(result => {
                        if (result.value) {
                            window.scrollTo(0, 0);
                            this.props.history.push(
                                "/empresas/planos-base/" + this.state.idEmpresa
                            );
                        }
                    });
                } else if (res.data.code === 500) {
                    $("button#save-usuario")
                        .find("i.fa")
                        .remove();
                    sweetalert(res.data.mensaje, "error", "sweet");
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
        }
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
                                        &nbsp;
                                        <Link to="/empresas">empresas /</Link>
                                        <Link
                                            to={
                                                "/empresas/planos-base/" +
                                                this.state.idEmpresa
                                            }
                                        >
                                            Planos base
                                        </Link>
                                        / Agregar Plano Base
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div id="sweet" className="container-fluid">
                        <ul
                            className="nav nav-pills mb-3"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    id="pills-datos-tab"
                                    data-toggle="pill"
                                    href="#pills-datos"
                                    role="tab"
                                    aria-controls="pills-datos"
                                    aria-selected="true"
                                >
                                    Datos
                                </a>
                            </li>
                        </ul>

                        <hr className="line-gray" />

                        <form
                            id="form-add-usuario"
                            className="form-change-password form"
                            encType="multipart/form-data"
                        >
                            <div className="row mb-4">
                                <div className="col-10">
                                    <SeatsioDesigner
                                        designerKey={this.state.designerKey}
                                        language="es"
                                        onChartCreated={this.chartKeyGenerate}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-4">
                                    <button
                                        type="button"
                                        id="boton-plano"
                                        className="btn btn-sm btn-dark "
                                        onClick={this.handleSubmit}
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>

                            <div className="form-group row">
                                <div className="col-sm-4">
                                    <Link
                                        to={{
                                            pathname:
                                                "/empresas/planos-base/" +
                                                this.state.idEmpresa
                                        }}
                                    >
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-dark"
                                        >
                                            Volver
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
