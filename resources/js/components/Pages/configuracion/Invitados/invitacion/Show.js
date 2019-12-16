import React, { Component, Fragment } from "react";
import axios from "axios";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import CargandoSpinner from '../../../../atoms/CargandoSpinner'
import AlertMessage from '../../../../atoms/AlertMessage'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import "./css/invitacion.css";
import * as invitacionesActions from '../../../../../redux/actions/invitaciones'
import * as eventosActions from '../../../../../redux/actions/eventos'
const { traerInvitacionesEventoID, borrarInvitacion } = invitacionesActions;
const { traerEventos } = eventosActions
class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: JSON.parse(localStorage.getItem("usuario")),
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            archivos: [],
            empresa: "",
            eventoNombre: "",
            opcion: "Invitacion",
            footer: "Footer",
            eventos: JSON.parse(localStorage.getItem("eventos")),
            api_token: localStorage.getItem("api_token"),
            isLoading: true,
            isLoadingEmpresa: true,

        };
        this.handleDelete = this.handleDelete.bind(this);
        this.mostratTabla = this.mostratTabla.bind(this);
    }

    async componentDidMount() {
        const { match: { params: { id } } } = this.props

        if (!this.props.eventos.eventos.length) {
            //si no existen los eventos los traemos del reducer
            await this.props.traerEventos()
        }

        const evento = this.props.eventos.eventos.filter(e => (e._id == id))
        this.setState({
            eventoNombre: evento[0].Evento,
        })
        //seleccionamos las key de los eventos dentro del  del reducer
        const keyEvento = this.props.eventos.eventos.map((e, key) => {
            if (e._id == id) {
                return key
            }
        })
        let key = keyEvento.filter(k => k != undefined)//seleccionamos la key del evento activo

        //si el evento no tiene el key del array de las invitaciones, buscamos las invitaciones del evento
        if (!('invitacion_key' in evento[0])) {
            await this.props.traerInvitacionesEventoID(id, key[0])
        }
        this.setState({
            invitacionKey: true,//ya sabremos que se cargaron las invitaciones
            keyEvento: this.props.eventos.eventos[key[0]].invitacion_key,
        })
    }

    async  handleDelete(id) { //keyEvento
        const result = await Swal.fire({
            text: "¿Está seguro que desea borrar el regalo?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#343a40",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            target: document.getElementById("sweet")
        })

        if (result.value) {

            await this.props.borrarInvitacion(id, this.state.keyEvento)

        }
    }


    mostrarInvitacion(invitacion, idEvento) {

        return (
            invitacion.map((i, index) => (
                <tr key={index} id={i._id}>
                    <td className="text-center">
                        {i.Modo ? i.Modo : `Plantilla Modelo ${i.Plantilla_id}`}
                    </td>
                    <td className="text-center">
                        {i.SizeImg ? i.SizeImg : '-'}
                    </td>
                    <td className="text-center">
                        {i.SizePdf ? i.SizePdf : '-'}
                    </td>
                    <td className="text-center">
                        <div className="text-center">
                            {this.state.permisoUsuario.permisos.evento.includes(
                                "delete"
                            ) &&

                                <div class="text-center">
                                    <a
                                        onClick={() => {
                                            this.handleDelete(
                                                i._id,
                                                index
                                            );
                                        }}
                                    >
                                        <i
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Borrar"
                                            className="fas fa-trash-alt icono-ver"
                                        />
                                    </a>
                                </div>
                            }
                        </div>
                    </td>
                </tr>
            ))
        )
    }

    mostrarContenidoTabla() {
        const { match: { params: { id } } } = this.props
        const { invitaciones } = this.props.invitaciones
        const { eventos } = this.props.eventos
        if (this.props.invitaciones.cargando) {
            return <CargandoSpinner />
        }
        const keyEvento = this.props.eventos.eventos.map((e, key) => {
            if (e._id == id) {
                return key
            }
        })

        let key = keyEvento.filter(k => k != undefined)

        if (this.state.invitacionKey) {
            if (('invitacion_key' in eventos[key[0]])) {
                let evento = this.props.eventos.eventos.filter(e => (e._id == id))
                //una vez tenga el key de la invitacion verifico si tiene items o no

                if (!invitaciones[evento[0].invitacion_key].length) {

                    return <AlertMessage message={"No existe invitación"} type={"danger"} />
                }
                return this.mostrarInvitacion(invitaciones[evento[0].invitacion_key], id)
            }
        }
    }
    mostratTabla() {
        const { match: { params: { id } } } = this.props
        return (
            <table
                className="table table-hover table-condensed table-dark-theme table-responsive-sm"
                id="dt-eventos"
            >
                <thead>
                    <tr>
                        <td>
                            {
                                this.state.permisoUsuario.permisos.evento.includes("add")
                                &&
                                <Link className="btn-sm btn-dark button-add p-2" to={{ pathname: `/invitacion/add/${id}` }}>Agregar</Link>
                            }
                        </td>
                    </tr>
                    <tr className="fila-head">
                        <th className="text-center">TIPO</th>
                        <th className="text-center">TAMAÑO IMAGEN</th>
                        <th className="text-center">TAMAÑO PDF</th>
                        <th className="text-center">
                            ACCIONES
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {this.mostrarContenidoTabla()}
                </tbody>
            </table>
        )

    }
    render() {

        // console.log("props", this.props);

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
                                        <Link to="/invitacion">
                                            <i className="fas fa-envelope-open-text sidebar-nav-link-logo" />
                                            &nbsp; Invitación
                                    </Link>{" "}
                                        / {this.state.eventoNombre}&nbsp;
                                        / Ver Archivos
                            </h1>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div id="sweet" className="container-fluid">
                        {this.mostratTabla()}
                        <footer className="content-wrapper-footer">
                            {/* <span>{this.state.footer}</span> */}
                        </footer>
                    </div>
                </div>
            </Fragment>
        )
    }
}
const mapStateToProps = ({ invitaciones, eventos }) => {
    return {
        invitaciones,
        eventos

    }
}
const mapDispatchToProps = {
    traerInvitacionesEventoID,
    borrarInvitacion,
    traerEventos,
};

export default connect(mapStateToProps, mapDispatchToProps)(Show)