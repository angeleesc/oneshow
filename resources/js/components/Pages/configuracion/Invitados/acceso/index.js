import React, { Component, Fragment, createRef } from "react";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import CargandoSpinner from "../../../../atoms/CargandoSpinner";
import AlertMessage from "../../../../atoms/AlertMessage";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as empresasActions from "../../../../../redux/actions/empresas";
import * as eventosActions from "../../../../../redux/actions/eventos";
import * as invitadosActions from "../../../../../redux/actions/invitados";
import "./style.css";
const { traerEmpresas } = empresasActions;
const { traerEventos } = eventosActions;
const {
    traerInvitados,
    checkIn,
    orderApellido,
    orderNombre
} = invitadosActions;
class Acceso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            opcion: "Invitacion",
            footer: "Footer",
            selectE: false,
            orderApellido: false,
            orderNombre: false
        };
        this.changeEmpresa = createRef();
        this.changeEvento = createRef();
        this.handleChange = this.handleChange.bind(this);
        this.selectDeEmpresas = this.selectDeEmpresas.bind(this);
        this.mostrarTabla = this.mostrarTabla.bind(this);
        this.mostrarContenidoTabla = this.mostrarContenidoTabla.bind(this);
        this.mostrarInvitado = this.mostrarInvitado.bind(this);
        this.handleCheckIn = this.handleCheckIn.bind(this);
        this.handleCheckOut = this.handleCheckOut.bind(this);
        this.handleApellidoOrder = this.handleApellidoOrder.bind(this);
        this.handleNombreOrder = this.handleNombreOrder.bind(this);
    }

    async componentDidMount() {
        if (!this.props.empresas.empresas.length) {
            this.props.traerEmpresas();
        }
        if (!this.props.eventos.eventos.length) {
            await this.props.traerEventos();
        }

        if (!this.props.invitados.invitados.length) {
            await this.props.traerInvitados();
        }
    }

    handleChange() {
        const { invitados } = this.props.invitados; //seleccionamos los invitados
        const id =
            this.changeEmpresa.current != null
                ? this.changeEmpresa.current.value //seleccionamos el id de la empresa
                : 0;
        let invitadosEmpresa = null;
        const idEvento = this.changeEvento.current.value;

        if (idEvento != 0) {
            //si el evento esta seleccionado buscamos por evento
            invitadosEmpresa = invitados[0].filter(
                i => i.Evento_id == idEvento
            );
        } else {
            //si no por la empresa
            invitadosEmpresa = invitados[0].filter(
                i => i.Empresa_id.$oid == id
            );
        }

        if (id == 0 && idEvento == 0) {
            return invitados[0].map((i, index) =>
                this.mostrarInvitado(i, index)
            );
        } else {
            return invitadosEmpresa.map((i, index) =>
                this.mostrarInvitado(i, index)
            );
        }
    }
    handleChangeOption() {
        const { eventos } = this.props.eventos;
        const id =
            this.changeEmpresa.current != null
                ? this.changeEmpresa.current.value
                : 0;
        const eventosEmpresa = eventos.filter(e => e.Empresa_id == id);

        if (id == 0) {
            // si el el valor de la empresa en 0 colocamos todos los eventos
            return eventos.map((e, index) => (
                <option value={e._id} key={index}>
                    {e.Evento}
                </option>
            ));
        } else {
            // solo colocamos los evento de la empresa seleccionada
            return eventosEmpresa.map((e, index) => (
                <option value={e._id} key={index}>
                    {e.Evento}
                </option>
            ));
        }
    }

    handleApellidoOrder() {
        this.props.orderApellido(this.state.orderApellido);

        this.setState({
            orderApellido: !this.state.orderApellido
        });
    }

    handleNombreOrder() {
        this.props.orderNombre(this.state.orderNombre);

        this.setState({
            orderNombre: !this.state.orderNombre
        });
    }

    async handleCheckIn(event) {
        const element = event.target;

        const id = element.dataset.id;
        const idEvento = element.dataset.idevento;
        await this.props.checkIn(id, idEvento);
    }

    async handleCheckOut() {
        const element = event.target;

        const id = element.dataset.id;
        const idEvento = element.dataset.idevento;

        await this.props.checkIn(id, idEvento, true);
    }

    selectDeEmpresas() {
        if (this.props.empresas.cargando) {
            return <CargandoSpinner />;
        }
        if (this.props.empresas.error) {
            return (
                <AlertMessage
                    message={this.props.empresas.error}
                    type={"warning"}
                />
            );
        }
        return (
            <div className="row mb-4">
                <div className="col-3">
                    <label className="my-1 mr-2 form-control-sm label-invitado">
                        <strong>Empresa</strong>
                    </label>
                    {this.state.permisoUsuario.nombre == "ADMINISTRADOR" ? (
                        <select
                            className="form-control form-control-sm my-1 mr-sm-2 col-12 select-invitado"
                            id="pro-find-empresa"
                            name="pro-find-empresa"
                            ref={this.changeEmpresa}
                            onChange={() => this.setState({ selectE: true })}
                        >
                            <option value="0">Todas</option>
                            {this.props.empresas.empresas.map((e, index) => {
                                return (
                                    <option value={e._id} key={index}>
                                        {e.Nombre}
                                    </option>
                                );
                            })}
                        </select>
                    ) : (
                        <select
                            className="form-control form-control-sm my-1 mr-sm-2 col-12 select-invitado"
                            id="pro-find-empresa"
                            name="pro-find-empresa"
                            disabled
                        >
                            {this.props.empresas.empresas.map((e, index) => {
                                return (
                                    <option value={e._id} key={index}>
                                        {e.Nombre}
                                    </option>
                                );
                            })}
                            )}
                        </select>
                    )}
                </div>
                <div className="col-3">
                    <label className="my-1 mr-2 form-control-sm label-invitado">
                        <strong>Evento</strong>
                    </label>
                    {this.state.permisoUsuario.nombre === "ADMINISTRADOR" ||
                    this.state.permisoUsuario.nombre === "EMPRESA" ? (
                        <select
                            name="evento"
                            id="pro-find-empresa"
                            className="form-control form-control-sm my-1 mr-sm-2 col-12 select-invitado"
                            ref={this.changeEvento}
                            onChange={() => this.setState({ selectE: true })}
                        >
                            <option value="0">Todas</option>
                            {this.state.selectE
                                ? this.handleChangeOption()
                                : this.props.eventos.eventos.map((e, index) => (
                                      <option value={e._id} key={index}>
                                          {e.Evento}
                                      </option>
                                  ))}
                        </select>
                    ) : (
                        <select
                            name="evento"
                            id="pro-find-empresa"
                            className="form-control form-control-sm my-1 mr-sm-2 col-12 select-invitado"
                            // onChange={this.handleFiltroEvento}
                            disabled
                        >
                            {this.state.selectE
                                ? this.handleChangeOption()
                                : this.props.eventos.eventos.map((e, index) => (
                                      <option value={e._id} key={index}>
                                          {e.Evento}
                                      </option>
                                  ))}
                        </select>
                    )}
                </div>
                <div className="col-3 offset-3 align-self-end">
                    <Link to="/qr">
                        <button
                            className="btn btn-default btn-success"
                            id="btn-qr"
                        >
                            Escanear código QR &nbsp;{" "}
                            <i
                                className="fa fa-qrcode icono-check"
                                aria-hidden="true"
                                id="qricon"
                            />
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
    mostrarInvitado(invitado, index) {
        return (
            <tr key={index} id={invitado._id}>
                <td className="text-center td-invitado">{invitado.Nombre}</td>
                <td className="text-center td-invitado">{invitado.Apellido}</td>
                <td className="text-center td-invitado">
                    {invitado.esInvitadoAdicional ? (
                        <span>ADICIONAL</span>
                    ) : (
                        <span>DIRECTO</span>
                    )}
                </td>
                <td className="text-center td-invitado">{invitado.Grupo}</td>
                <td className="text-center td-invitado">{invitado.Evento}</td>
                <td className="text-center td-invitado">
                    <div id="container-btn">
                        {invitado.CheckIn ? (
                            <button
                                className="btn btn-default btn-danger"
                                onClick={this.handleCheckOut}
                                data-id={invitado.Invitado_id}
                                data-idevento={invitado.Evento_id}
                            >
                                <span
                                    data-id={invitado.Invitado_id}
                                    data-idevento={invitado.Evento_id}
                                >
                                    Out
                                </span>{" "}
                                &nbsp;
                                <i
                                    data-id={invitado.Invitado_id}
                                    data-idevento={invitado.Evento_id}
                                    className="fas fa-door-open"
                                ></i>
                            </button>
                        ) : (
                            <button
                                onClick={this.handleCheckIn}
                                className="btn btn-default"
                                data-id={invitado.Invitado_id}
                                data-idevento={invitado.Evento_id}
                            >
                                <span
                                    data-id={invitado.Invitado_id}
                                    data-idevento={invitado.Evento_id}
                                >
                                    Check in{" "}
                                </span>
                                &nbsp;
                                <img
                                    data-id={invitado.Invitado_id}
                                    data-idevento={invitado.Evento_id}
                                    src={"/images/crop_square-24px.svg"}
                                />
                            </button>
                        )}
                    </div>
                </td>
            </tr>
        );
    }
    mostrarContenidoTabla() {
        const { invitados } = this.props.invitados;

        if (this.props.invitados.cargando) {
            return <CargandoSpinner />;
        }

        if (this.props.invitados.invitados.length) {
            return invitados[0].map((invitado, i) =>
                this.mostrarInvitado(invitado, i)
            );
        }
    }

    mostrarTabla() {
        return (
            <table
                className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                id="dt-eventos"
            >
                <thead>
                    <tr className="fila-head">
                        <th className="text-center">
                            NOMBRE &nbsp;
                            <a
                                href="javascript:void(0)"
                                onClick={this.handleNombreOrder}
                            >
                                {" "}
                                <img src="/images/arrow_drop_down-24px.svg" />{" "}
                            </a>
                        </th>
                        <th className="text-center">
                            APELLIDO &nbsp;
                            <a
                                href="javascript:void(0)"
                                onClick={this.handleApellidoOrder}
                            >
                                {" "}
                                <img src="/images/arrow_drop_down-24px.svg" />{" "}
                            </a>
                        </th>
                        <th className="text-center">INVITADO</th>
                        <th className="text-center">GRUPO</th>
                        <th className="text-center">EVENTO</th>
                        <th className="text-center">ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.selectE
                        ? this.handleChange()
                        : this.mostrarContenidoTabla()}
                </tbody>
            </table>
        );
    }

    render() {
        // console.log("props", this.props);

        if (this.props.invitados.error) {
            sweetalert(`${this.props.invitados.error}.`, "error", "sweet");
        }

        return (
            <Fragment>
                <Menu />
                <Header history={this.props.history} />
                <div className="content-wrapper">
                    <header className="page-header">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">
                                    <h1
                                        className="page-header-heading"
                                        id="title-nav"
                                    >
                                        <i className="fas fa-tasks sidebar-nav-link-logo" />
                                        &nbsp; Control de Acceso
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div id="sweet" className="container-fluid">
                        {this.selectDeEmpresas()}
                        {this.mostrarTabla()}
                        <footer className="content-wrapper-footer">
                            {/* <span>{this.state.footer}</span> */}
                        </footer>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ empresas, eventos, invitados }) => {
    return {
        empresas,
        eventos,
        invitados
    };
};
const mapDispatchToProps = {
    traerEmpresas,
    traerEventos,
    traerInvitados,
    checkIn,
    orderApellido,
    orderNombre
};
export default connect(mapStateToProps, mapDispatchToProps)(Acceso);
