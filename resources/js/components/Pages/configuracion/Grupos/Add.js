import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../components/Menu";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

export default class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            nombre: "",
            opcion: "Grupos",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axios
            .get("api/eventos", {
                headers: {
                    Authorization: this.state.api_token
                }
            })
            .then(res => {
                console.log(res);
                this.setState({
                    eventos: res.data.eventos,
                    isLoading: false
                });
            });
    }

    handleChange(event) {
        const target = event.target;
        const value =
            target.type === "checkbox" ? target.checked : target.value;
        console.log(value);
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("nombre", this.state.nombre);
        $("#save-grupo").prepend('<i className="fa fa-spinner fa-spin"></i> ');
        axios
            .post("api/grupos", formData, {
                headers: {
                    Authorization: this.state.api_token
                }
            })
            .then(res => {
                console.log(res);
                $("#save-invitado")
                    .find("i.fa")
                    .remove();

                if (res.data.code === 200) {
                    Swal.fire({
                        text: "Grupo agregado exitosamente",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#343a40",
                        confirmButtonText: "OK",
                        target: document.getElementById("sweet")
                    }).then(result => {
                        if (result.value) {
                            window.scrollTo(0, 0);
                            this.props.history.push("/grupos");
                        }
                    });
                } else if (res.data.code === 500) {
                    sweetalert(
                        "Error al agregar el grupo. Consulte al Administrador.",
                        "error",
                        "sweet"
                    );
                }
            })
            .catch(error => {
                $("button#save-grupo")
                    .find("i.fa")
                    .remove();
                sweetalert(error.response.data, "error", "sweet");
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
                                            &nbsp;
                                            <Link to="/grupos">Grupos </Link>/
                                            Agregar grupo
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
                                onSubmit={this.handleSubmit}
                            >
                                <div
                                    className="tab-content"
                                    id="pills-tabContent"
                                >
                                    <div
                                        className="tab-pane fade show active"
                                        id="pills-datos"
                                        role="tabpanel"
                                        aria-labelledby="pills-datos-tab"
                                    >
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label col-form-label-sm">
                                                Nombre de Grupo
                                            </label>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="nombre"
                                                    name="nombre"
                                                    placeholder="Ingrese el nombre"
                                                    value={this.state.nombre}
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-4">
                                        <button
                                            type="submit"
                                            id="save-grupo"
                                            className="btn btn-sm btn-dark mr-2"
                                        >
                                            Guardar
                                        </button>

                                        <Link to="/grupos">
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
}
