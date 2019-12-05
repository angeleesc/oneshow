import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";

export default class SeleccionPlanos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            idEvento: props.location.state.idEvento,
            evento: "",
            idInvitado: props.location.state.idInvitado,
            empresa: "",
            evento: "",
            planos: [],
            reservas: [],
            opcion: "Etapas",
            footer: "Footer",
            api_token: localStorage.getItem("api_token"),
            isLoading: true
        };
        this.esReservado = this.esReservado.bind(this);
    }

    componentDidMount() {
        axios
            .get("api/etapas/evento/" + this.state.idEvento, {
                headers: { Authorization: this.state.api_token }
            })
            .then(res => {
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
                        this.setState({
                            planos: res.data.data
                        });
                        axios
                            .post(
                                "api/planos/evento-reservas",
                                {
                                    idEvento: this.state.evento._id,
                                    idInvitado: this.state.idInvitado
                                },
                                {
                                    headers: {
                                        Authorization: this.state.api_token
                                    }
                                }
                            )
                            .then(res => {
                                console.log(res);
                                this.setState({
                                    isLoading: false,
                                    reservas: res.data.reservas
                                });
                            });
                    });
            });
    }

    esReservado(id) {
        console.log(id);
        var retorno = false;
        this.state.reservas.forEach(reserva => {
            console.log(reserva.eventKey);
            if (reserva.eventKey == id) {
                retorno = true;
            }
        });
        return retorno;
    }

    getAsiento(id) {
        console.log(id);
        var retorno = "----";
        this.state.reservas.forEach(reserva => {
            console.log(reserva.eventKey);
            if (reserva.eventKey == id) {
                retorno = reserva.asiento;
            }
        });
        return retorno;
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
                                            &nbsp; Seleccion de Plano
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
                                            <Link to="/invitados/asientos">
                                                Asientos{" "}
                                            </Link>{" "}
                                            &nbsp; / Planos
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
                                        <tr className="fila-head">
                                            <th className="text-center">
                                                PLANO
                                            </th>
                                            <th className="text-center">
                                                PREVIEW
                                            </th>
                                            <th className="text-center">
                                                STATUS
                                            </th>
                                            <th className="text-center">
                                                ASIENTO
                                            </th>
                                            <th className="text-center">
                                                SELECCION
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.planos.map((e, index) => {
                                            console.log(e);
                                            if (
                                                e.status == "PUBLISHED" &&
                                                e.events.length > 0
                                            ) {
                                                return (
                                                    <tr key={index} id={e.key}>
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
                                                        {this.esReservado(
                                                            e.events[0].key
                                                        )
                                                            ? [
                                                                  <td className="text-center">
                                                                      <span className="badge badge-success badge-dt">
                                                                          Reservado
                                                                      </span>
                                                                  </td>,
                                                                  <td className="text-center">
                                                                      <span className="badge badge-primary badge-dt">
                                                                          {this.getAsiento(
                                                                              e
                                                                                  .events[0]
                                                                                  .key
                                                                          )}
                                                                      </span>
                                                                  </td>,
                                                                  <td className="text-center">
                                                                      <div className="text-center">
                                                                          <Link
                                                                              className="mr-2 btn btn-primary"
                                                                              to={{
                                                                                  pathname:
                                                                                      "/planos/edicion-asiento",
                                                                                  state: {
                                                                                      evento: this
                                                                                          .state
                                                                                          .evento,
                                                                                      idInvitado: this
                                                                                          .state
                                                                                          .idInvitado,
                                                                                      eventKey:
                                                                                          e
                                                                                              .events[0]
                                                                                              .key,
                                                                                      asiento: this.getAsiento(
                                                                                          e
                                                                                              .events[0]
                                                                                              .key
                                                                                      )
                                                                                  }
                                                                              }}
                                                                          >
                                                                              Editar
                                                                          </Link>
                                                                      </div>
                                                                  </td>
                                                              ]
                                                            : [
                                                                  <td className="text-center">
                                                                      <span className="badge badge-danger badge-dt">
                                                                          No
                                                                          Reservado
                                                                      </span>
                                                                  </td>,
                                                                  <td className="text-center">
                                                                      <span className="badge badge-warning badge-dt">
                                                                          ----
                                                                      </span>
                                                                  </td>,
                                                                  <td className="text-center">
                                                                      <div className="text-center">
                                                                          <Link
                                                                              className="mr-2 btn btn-primary"
                                                                              to={{
                                                                                  pathname:
                                                                                      "/planos/seleccion-asiento",
                                                                                  state: {
                                                                                      evento: this
                                                                                          .state
                                                                                          .evento,
                                                                                      idInvitado: this
                                                                                          .state
                                                                                          .idInvitado,
                                                                                      eventKey:
                                                                                          e
                                                                                              .events[0]
                                                                                              .key
                                                                                  }
                                                                              }}
                                                                          >
                                                                              Seleccionar
                                                                          </Link>
                                                                      </div>
                                                                  </td>
                                                              ]}
                                                    </tr>
                                                );
                                            }
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
