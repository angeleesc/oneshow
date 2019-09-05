import React, { Component } from "react";
import { SeatsioSeatingChart } from "@seatsio/seatsio-react";
//import { SeatsioDesigner } from "@seatsio/seatsio-react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";

export default class SeleccionAsientos extends Component {
    constructor(props) {
        super(props);
        console.log(props.location.state.idInvitado)
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            nombre: "",
            idEvento: props.location.state.idEvento,
            eventKey: props.location.state.eventKey,
            evento: "",
            asientos: 1,
            idInvitado: props.location.state.idInvitado,
            opcion: "Etapas",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axios
            .get("api/eventos/one/" + this.state.idEvento, {
                headers: {
                    Authorization: this.state.api_token
                }
            })
            .then(res => {
                console.log(res);
                var evento = res.data.evento.evento;
                this.setState({
                    evento,
                    isLoading: false
                });
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        var elements = document.getElementById("prueba").elements;
        var seat = elements.item(0).value;
        $("#boton-asiento").prepend('<i class="fa fa-spinner fa-spin"></i> ');
        axios
            .post(
                "api/planos/reservar",
                {
                    seat,
                    secretKey: this.state.evento.secretKey,
                    eventKey: this.state.eventKey,
                    idInvitado: this.state.idInvitado,
                    idEvento: this.state.idEvento
                },
                {
                    headers: { Authorization: this.state.api_token }
                }
            )
            .then(res => {
                console.log(res);
                if (res.data.code == 200) {
                    Swal.fire({
                        text: "Asiento reservado exitosamente",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#343a40",
                        confirmButtonText: "OK",
                        target: document.getElementById("sweet")
                    }).then(result => {
                        if (result.value) {
                            window.scrollTo(0, 0);

                            this.props.history.push("/invitados/asientos");
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
        console.log(this.state.eventKey);
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
                                        Cagargando
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
                                        &nbsp; Seleccionar Asiento
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div id="sweet" className="container-fluid">
                        <hr className="line-gray" />

                        <form
                            id="form-add-usuario"
                            className="form-change-password form"
                            encType="multipart/form-data"
                        >
                            <div className="row mb-4">
                                <div className="col-10">
                                    <form
                                        id="prueba"
                                        onSubmit={this.handleSubmit}
                                    >
                                        <SeatsioSeatingChart
                                            publicKey={
                                                this.state.evento.publicKey
                                            }
                                            event={this.state.eventKey}
                                            numberOfPlacesToSelect={
                                                this.state.asientos
                                            }
                                            selectedObjectsInputName="selectedSeats"
                                        />
                                        <button
                                            type="submit"
                                            id="boton-asiento"
                                            className="btn btn-sm btn-dark "
                                        >
                                            Guardar
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="form-group row">
                                <div className="col-sm-4">
                                    <Link to={"/invitados"}>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-dark"
                                        >
                                            volver
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
