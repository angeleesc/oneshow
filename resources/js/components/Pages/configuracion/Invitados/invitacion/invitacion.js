import React, { Component, Fragment, createRef } from "react";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import CargandoSpinner from '../../../../atoms/CargandoSpinner'
import AlertMessage from '../../../../atoms/AlertMessage'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import * as empresasActions from '../../../../../redux/actions/empresas'
import * as eventosActions from '../../../../../redux/actions/eventos'
const { traerEmpresas } = empresasActions;
const { traerEventos, traerEventosInvitaciones } = eventosActions

import "./css/invitacion.css";
class Invitacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            opcion: "Invitacion",
            footer: "Footer",
            selectE: false
        };
        this.changeEmpresa = createRef();
        this.changeEvento = createRef();
        this.handleChange = this.handleChange.bind(this);
        this.selectDeEmpresas = this.selectDeEmpresas.bind(this);
        this.mostrarTabla = this.mostrarTabla.bind(this);
        this.mostrarContenidoTabla = this.mostrarContenidoTabla.bind(this);
    }

    async componentDidMount() {
        if (!this.props.empresas.empresas.length) {
            this.props.traerEmpresas()
        }
        if (!this.props.eventos.eventos.length) {
            await this.props.traerEventos()
            // await this.props.traerEventosInvitaciones()
        }

        this.props.eventos.eventos.map(async e => {
            if (('ArchivosInvitacion') in e) {
            } else {
                await this.props.traerEventosInvitaciones()
            }
        })

    }

    handleChange() {
        const { eventos } = this.props.eventos
        const id =
            this.changeEmpresa.current != null
                ? this.changeEmpresa.current.value //seleccionamos el id de la empresa
                : 0;
        let idEvento = this.changeEvento.current.value;
        let eventosEmpresa = null;

        if (idEvento != 0) {
            //si el evento esta seleccionado buscamos por evento
            eventosEmpresa = eventos.filter(
                e => e._id == idEvento
            );
        } else {
            //si no por la empresa
            eventosEmpresa = eventos.filter(
                e => e.Empresa_id == id
            );
        }

        if (id == 0 && idEvento == 0) {
            return eventos.map((e, i) => (
                this.mostrarInvitaciones(e, i)
            ))
        } else {
            return eventosEmpresa.map((e, i) => (
                this.mostrarInvitaciones(e, i)
            ))
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
    selectDeEmpresas() {
        if (this.props.empresas.cargando) {
            return <CargandoSpinner />

        }
        if (this.props.empresas.error) {
            return <AlertMessage message={this.props.empresas.error} type={"warning"} />

        }
        return (
            <div className="row mb-4">
                <div className="col-3">
                    <label className="my-1 mr-2 form-control-sm">
                        <strong>Empresa</strong>
                    </label>
                    {this.state.permisoUsuario.nombre ==
                        "ADMINISTRADOR" ? (
                            <select
                                className="form-control form-control-sm my-1 mr-sm-2 col-12"
                                id="pro-find-empresa"
                                name="pro-find-empresa"
                                ref={this.changeEmpresa}
                                onChange={() => this.setState({ selectE: true })}
                            >
                                <option value="0">Todas</option>
                                {this.props.empresas.empresas.map(
                                    (e, index) => {
                                        return (
                                            <option
                                                value={e._id}
                                                key={index}
                                            >
                                                {e.Nombre}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        ) : (
                            <select
                                className="form-control form-control-sm my-1 mr-sm-2 col-12"
                                id="pro-find-empresa"
                                name="pro-find-empresa"
                                disabled
                            >
                                {this.props.empresas.empresas.map(
                                    (e, index) => {
                                        return (
                                            <option
                                                value={e._id}
                                                key={index}
                                            >
                                                {e.Nombre}
                                            </option>
                                        );
                                    }
                                )}
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
            </div>
        )

    }
    mostrarTabla() {

        return (
            <table
                className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                id="dt-eventos"
            >
                <thead>
                    <tr className="fila-head">
                        <th className="text-center">EMPRESA</th>
                        <th className="text-center">EVENTO</th>
                        <th className="text-center">FECHA</th>
                        <th className="text-center">APP</th>
                        <th className="text-center">
                            INVITACIONES
                        </th>
                        <th className="text-center">
                            ACCIONES
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.selectE ? this.handleChange() : this.mostrarContenidoTabla()}
                </tbody>
            </table >
        )

    }
    mostrarInvitaciones(e, index) {
        return (
            <tr key={index} id={e._id}>
                <td className="text-center">
                    {e.Empresa}
                </td>
                <td className="text-center">
                    {e.Evento}
                </td>
                <td className="text-center">
                    {e.Fecha}
                </td>
                <td className="text-center">
                    {e.App ? (
                        <i
                            className="fa fa-check fa-lg icono-check"
                            aria-hidden="true"
                        />
                    ) : (
                            <i
                                style={{color: '#d9534f'}}
                                className="fa fa-times fa-lg"
                                aria-hidden="true"
                            />
                        )}
                </td>
                <td className="text-center">
                    {e.ArchivosInvitacion}
                </td>
                <td className="text-center">
                    <div className="text-center">
                        <Link
                            to={
                                `/invitacion/show/` +
                                e._id
                            }
                        >
                            <i
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Ver"
                                className="fas fa-eye icono-ver"
                            />
                        </Link>
                    </div>
                </td>
            </tr>
        );
    }
    mostrarContenidoTabla() {
        const { eventos } = this.props.eventos

        if (this.props.eventos.cargando) {
            return <CargandoSpinner />
        }
        if (this.props.eventos.error) {
            return <AlertMessage message={this.props.eventos.error} type={"warning"} />
        }

        return eventos.map((e, i) => (
            this.mostrarInvitaciones(e, i)
        ))
    }
    render() {
        // console.log('props', this.props);

        return (
            <Fragment>
                <Menu />
                <Header history={this.props.history} />
                <div className="content-wrapper">
                    <header className="page-header">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">
                                    <h1 className="page-header-heading">
                                        <i className="fas fa-gift sidebar-nav-link-logo" />
                                        &nbsp; Invitaciones
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
        )
    }
}
const mapStateToProps = ({ empresas, eventos }) => {
    return {
        empresas,
        eventos

    }
}
const mapDispatchToProps = {
    traerEmpresas,
    traerEventos,
    traerEventosInvitaciones

};

export default connect(mapStateToProps, mapDispatchToProps)(Invitacion)