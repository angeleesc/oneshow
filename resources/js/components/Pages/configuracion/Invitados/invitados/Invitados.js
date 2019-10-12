import React, { Component } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";

import "./css/invitados.css";
export default class Invitados extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            invitados: [],
            opcion: "Invitacion",
            footer: "Footer",
            empresa: "",
            empresas: [],
            eventos: [],
            grupos: [],
            evento: "",
            grupo: "",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true,
            isLoadingEmpresa: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.modalDelete = this.modalDelete.bind(this);
        this.handleMail = this.handleMail.bind(this);
        this.handleFiltroEvento = this.handleFiltroEvento.bind(this);
        this.handleFiltroEmpresa = this.handleFiltroEmpresa.bind(this);
        this.handleFiltroGrupo = this.handleFiltroGrupo.bind(this);
    }

    componentDidMount() {
        var rol = this.state.permisoUsuario.nombre;
        var id;
        if (this.state.permisoUsuario.nombre == "ADMINISTRADOR") {
            id = this.state.usuario._id;
        } else if (this.state.permisoUsuario.nombre == "EMPRESA") {
            id = this.state.usuario.Empresa_id;
        } else {
            id = this.state.usuario.Evento_id;
        }
        axios
            .post(
                "api/invitados/all",
                {
                    id,
                    rol
                },
                {
                    headers: { Authorization: this.state.api_token }
                }
            )
            .then(res => {
                console.log(res);
                this.setState({
                    invitados: res.data.invitados,
                    invitadosCompletos: res.data.invitados,
                    empresas: res.data.empresas,
                    eventos: res.data.eventos,
                    grupos: res.data.grupos,
                    isLoading: false
                });
                console.log(this.state);
            });
    }

    handleFiltroEmpresa(event) {
        const target = event.target;
        const value =
            target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
            isLoadingEmpresa: true
        });
        if (value == "todas") {
            this.setState({
                isLoadingEmpresa: false,
                invitados: this.state.invitadosCompletos
            });
        } else {
            console.log(this.state.invitadosCompletos);
            console.log(value);
            var invitados = [];
            for (var j = 0; j < this.state.invitadosCompletos.length; j++) {
                console.log(this.state.invitadosCompletos[j].Empresa_id.$oid);
                console.log(value);
                if (this.state.invitadosCompletos[j].Empresa_id.$oid == value) {
                    invitados.push(this.state.invitadosCompletos[j]);
                }
            }
            this.setState({
                invitados
            });
        }
    }

    handleFiltroEvento(event) {
        const target = event.target;
        const value =
            target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
            isLoadingEmpresa: true
        });
        if (value == "todas") {
            this.setState({
                isLoadingEmpresa: false,
                invitados: this.state.invitadosCompletos
            });
        } else {
            var invitados = [];
            for (var j = 0; j < this.state.invitadosCompletos.length; j++) {
                console.log(this.state.invitadosCompletos[j].Evento_id);
                console.log(value);
                if (this.state.invitadosCompletos[j].Evento_id == value) {
                    invitados.push(this.state.invitadosCompletos[j]);
                }
            }
            this.setState({
                invitados
            });
        }
    }

    handleFiltroGrupo(event) {
        const target = event.target;
        const value = target.value;
        console.log(value);
        console.log(name);
        const name = target.name;
        this.setState({
            [name]: value,
            isLoadingEmpresa: true
        });

        if (value == "todas") {
            this.setState({
                isLoadingEmpresa: false,
                invitados: this.state.invitadosCompletos
            });
        } else {
            var invitados = [];
            for (var j = 0; j < this.state.invitadosCompletos.length; j++) {
                console.log(this.state.invitadosCompletos[j].Grupo_id);
                console.log(value);
                if (this.state.invitadosCompletos[j].Grupo_id == value) {
                    invitados.push(this.state.invitadosCompletos[j]);
                }
            }
            this.setState({
                invitados
            });
        }
    }

    handleChange(event) {
        this.setState({ isLoadingEmpresa: true });
        const target = event.target;
        const value = target.value;
        this.setState({
            empresa: value
        });
        axios
            .post(
                "api/invitaciones/get-info",
                {
                    empresa: value,
                    rol: this.state.permisoUsuario.nombre,
                    id: this.state.usuario._id
                },
                {
                    headers: { Authorization: this.state.api_token }
                }
            )
            .then(res => {
                console.log(res);
                this.setState({
                    infoEmpresas: res.data.data,
                    isLoadingEmpresa: false
                });
            });
    }

    handleMail(link) {
        var index = link[1];
        link = link[0];
        Swal.fire({
            text: "¿Deseas enviar el correo de confirmacion de asistencia?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#343a40",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            target: document.getElementById("sweet")
        }).then(result => {
            if (result.value) {
                Swal.showLoading();
                let formMail = new FormData();
                formMail.append("link", link);
                axios
                    .post("api/mail/confirmacion-invitacion", formMail, {
                        headers: {
                            Authorization: this.state.api_token
                        }
                    })
                    .then(res => {
                        console.log(res);
                        Swal.close();
                        if (res.data.code === 200) {
                            for (
                                var i = 0;
                                i < this.state.invitados.length;
                                i++
                            ) {
                                if (this.state.invitados[i]._id == index) {
                                    this.state.invitados[i].Enviado = true;
                                    break;
                                }
                            }
                            for (
                                var i = 0;
                                i < this.state.invitadosCompletos.length;
                                i++
                            ) {
                                if (
                                    this.state.invitadosCompletos[i]._id ==
                                    index
                                ) {
                                    this.state.invitadosCompletos[
                                        i
                                    ].Enviado = true;
                                    break;
                                }
                            }
                            this.setState({ ...this.state });

                            sweetalert(
                                "correo enviado correctamente",
                                "success",
                                "sweet"
                            );
                        } else if (res.data.code === 600) {
                            sweetalert(
                                "Error al enviar el correo. Consulte al Administrador",
                                "error",
                                "sweet"
                            );
                        } else if (res.data.code == 500) {
                            sweetalert(
                                "Error al enviar el correo. Consulte al Administrador",
                                "error",
                                "sweet"
                            );
                        }
                    });
            }
        });
    }

    modalDelete(id) {
        Swal.fire({
            text: "¿Está seguro que desea borrar el grupo?",
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
                        "/api/invitados/delete",
                        { id },
                        {
                            headers: {
                                Authorization: this.state.api_token
                            }
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
                                            <i className="fas fa-user-friends page-header-heading-icon" />
                                            &nbsp; Invitados
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
                                            <i className="fas fa-user-friends page-header-heading-icon" />
                                            &nbsp; Invitados
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div id="sweet" className="container-fluid">
                            <div className="row mb-4">
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label>
                                      <strong>Empresa</strong>
                                  </label>
                                  {this.state.permisoUsuario.nombre == "ADMINISTRADOR" ? (
                                    <select
                                      name="empresa"
                                      id="pro-find-empresa"
                                      value={this.state.empresa}
                                      onChange={this.handleFiltroEmpresa}
                                      className="form-control form-control-sm"
                                    >
                                      <option value="todas">Todas</option>
                                      {this.state.empresas.map((e, index) => (
                                        <option value={e._id} key={index}>
                                          {e.Nombre}
                                        </option>
                                      ))}
                                    </select>
                                    ) : (
                                      <select
                                        className="form-control form-control-sm"
                                        id="pro-find-empresa"
                                        name="empresa"
                                        onChange={this.handleFiltroEmpresa}
                                        value={this.state.usuario.Empresa_id}
                                        disabled
                                      >
                                        <option value="todas">Todas</option>
                                        {this.state.empresas.map((e, index) => (
                                          <option value={e._id} key={index}>
                                            {e.Nombre}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                </div>
                              </div>
                                {/* <label className="my-1 mr-2 form-control-sm">
                                    <strong>Empresa</strong>
                                </label>
                                <div className="col-3">
                                    {this.state.permisoUsuario.nombre ==
                                    "ADMINISTRADOR" ? (
                                        <select
                                            className="form-control form-control-sm my-1 mr-sm-2 col-10"
                                            id="pro-find-empresa"
                                            name="empresa"
                                            onChange={this.handleFiltroEmpresa}
                                            value={this.state.empresa}
                                        >
                                            <option value="todas">Todas</option>
                                            {this.state.empresas.map(
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
                                            className="form-control form-control-sm my-1 mr-sm-2 col-10"
                                            id="pro-find-empresa"
                                            name="empresa"
                                            onChange={this.handleFiltroEmpresa}
                                            value={
                                                this.state.usuario.Empresa_id
                                            }
                                            disabled
                                        >
                                            <option value="todas">Todas</option>
                                            {this.state.empresas.map(
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
                                    )}
                                </div> */}
                                <div className="col-md-3">
                                  <div className="form-group">
                                    <label>
                                        <strong>Evento</strong>
                                    </label>
                                    {this.state.permisoUsuario.nombre === "ADMINISTRADOR" ? (
                                      <select
                                        name="evento"
                                        id="pro-find-empresa"
                                        className="form-control form-control-sm"
                                        value={this.state.evento}
                                        onChange={this.handleFiltroEvento}
                                      >
                                          <option value="todas">Todas</option>
                                          {this.state.eventos.map((e, index) => (
                                            <option value={e._id} key={index}>
                                              {e.Nombre}
                                            </option>
                                          ))}
                                      </select>
                                    ) : (
                                      <select
                                        name="evento"
                                        id="pro-find-empresa"
                                        className="form-control form-control-sm"
                                        onChange={this.handleFiltroEvento}
                                        value={this.state.usuario.Empresa_id}
                                        disabled
                                      >
                                        <option value="todas">Todas</option>
                                        {this.state.eventos.map((e, index) => (
                                          <option value={e._id} key={index}>
                                            {e.Nombre}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                </div>
                                {/* <label className="my-1 mr-2 form-control-sm">
                                    <strong>Evento</strong>
                                </label>
                                <div className="col-3">
                                    {this.state.permisoUsuario.nombre ==
                                    "ADMINISTRADOR" ? (
                                        <select
                                            className="form-control form-control-sm my-1 mr-sm-2 col-10"
                                            id="pro-find-empresa"
                                            name="evento"
                                            onChange={this.handleFiltroEvento}
                                            value={this.state.evento}
                                        >
                                            <option value="todas">Todas</option>
                                            {this.state.eventos.map(
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
                                            className="form-control form-control-sm my-1 mr-sm-2 col-10"
                                            id="pro-find-empresa"
                                            name="evento"
                                            onChange={this.handleFiltroEvento}
                                            value={
                                                this.state.usuario.Empresa_id
                                            }
                                            disabled
                                        >
                                            <option value="todas">Todas</option>
                                            {this.state.eventos.map(
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
                                    )}
                                </div> */}
                                <div className="col-md-3">
                                  <label>
                                    <strong>Grupo</strong>
                                  </label>
                                  <select
                                    name="grupo"
                                    id="pro-find-empresa"
                                    value={this.state.grupo}
                                    onChange={this.handleFiltroGrupo}
                                    className="form-control form-control-sm"
                                  >
                                    <option value="todas">Todas</option>
                                    {this.state.grupos.map((e, index) => (
                                      <option value={e._id} key={index}>
                                        {e.Nombre}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {this.state.permisoUsuario.permisos.evento.includes('add') &&
                                  <div className="col-md-3" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Link to="/invitados/add/" className="btn-sm btn-block btn-dark button-add p-2">
                                      Agregar Invitado
                                    </Link>
                                  </div>
                                }
                                <table
                                    className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                                    id="dt-eventos"
                                >
                                    <thead>
                                        <tr className="fila-head">
                                            <th className="text-center">
                                                NOMBRE
                                            </th>
                                            <th className="text-center">
                                                APELLIDO
                                            </th>
                                            <th className="text-center">
                                                INVITADO
                                            </th>
                                            <th className="text-center">
                                                GRUPO
                                            </th>
                                            <th className="text-center">
                                                ETAPAS
                                            </th>
                                            <th className="text-center">
                                                EVENTO
                                            </th>
                                            <th className="text-center">
                                                MAIL
                                            </th>
                                            <th className="text-center">
                                                CONFIRMACIÓN
                                            </th>
                                            <th className="text-center">
                                                ACCIONES
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.invitados.map(
                                            (e, index) => {
                                                return (
                                                    <tr key={index} id={e._id}>
                                                        <td className="text-center">
                                                            {e.Nombre}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.Apellido}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.esInvitadoAdicional ? (
                                                                <span>
                                                                    ADICIONAL
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    DIRECTO
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.Grupo}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.Etapas}
                                                        </td>
                                                        <td>{e.Evento}</td>
                                                        <td className="text-center">
                                                            {e.Correo}
                                                        </td>
                                                        <td className="text-center">
                                                            {e.Confirmado ? (
                                                                <div>
                                                                    <i
                                                                        className="fa fa-check fa-lg icono-check mr-1"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <i
                                                                        className="fa fa-check fa-lg icono-check"
                                                                        aria-hidden="true"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    {e.Enviado ? (
                                                                        <i
                                                                            aria-hidden="true"
                                                                            className="fas fa-envelope icono-ver"
                                                                        />
                                                                    ) : (
                                                                        <i
                                                                            className="fa fa-times fa-lg boton-negado"
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="text-center">
                                                                <Link
                                                                    to={{
                                                                        pathname:
                                                                            "/invitados/show/",
                                                                        state: {
                                                                            evento_id:
                                                                                e.Evento_id,
                                                                            invitado_id:
                                                                                e.Invitado_id
                                                                        }
                                                                    }}
                                                                    className="mr-2"
                                                                >
                                                                    <i
                                                                        data-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Ver"
                                                                        className="fas fa-eye icono-ver"
                                                                    />
                                                                </Link>
                                                                {this.state.permisoUsuario.permisos.evento.includes(
                                                                    "edit"
                                                                ) ? (
                                                                    <Link
                                                                        className="mr-2"
                                                                        to={{
                                                                            pathname:
                                                                                "/invitados/edit/",
                                                                            state: {
                                                                                evento_id:
                                                                                    e.Evento_id,
                                                                                invitado_id:
                                                                                    e.Invitado_id
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
                                                                {this.state.permisoUsuario.permisos.evento.includes(
                                                                    "edit"
                                                                ) ? (
                                                                    <a
                                                                        className="mr-2"
                                                                        onClick={ev =>
                                                                            this.handleMail(
                                                                                [
                                                                                    e.Link,
                                                                                    e._id
                                                                                ],

                                                                                ev
                                                                            )
                                                                        }
                                                                    >
                                                                        <i
                                                                            data-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title="Enviar Mail"
                                                                            className="fas fa-envelope icono-ver"
                                                                        />
                                                                    </a>
                                                                ) : (
                                                                    ""
                                                                )}
                                                                {this.state.permisoUsuario.permisos.evento.includes(
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
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
                </div>
            );
        }
    }
}
