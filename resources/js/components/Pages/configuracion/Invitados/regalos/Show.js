import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import CargandoSpinner from '../../../../atoms/CargandoSpinner'
import AlertMessage from '../../../../atoms/AlertMessage'
import { Link } from "react-router-dom";
import * as regalosActions from '../../../../../redux/actions/regalos'
import * as eventosActions from '../../../../../redux/actions/eventos'

const { traerRegalosEventosID, borrarRegalo } = regalosActions
const { traerEventos } = eventosActions
class Show extends Component {

    constructor(props) {
        super(props);
        this.state = {
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            opcion: "Invitacion",
            footer: "Footer",
            eventoNombre: "",

        };

        this.mostratTabla = this.mostratTabla.bind(this);
        this.modalDelete = this.modalDelete.bind(this);
    }

    async componentDidMount() {
        const { match: { params: { id } } } = this.props
        const { eventos } = this.props.eventos

        console.log('eventos', !this.props.eventos.eventos.length);
        
        if (!this.props.eventos.eventos.length) {
            await this.props.traerEventos()
        
            await this.props.traerRegalosEventosID(id)
            
            const evento = this.props.eventos.eventos.filter(e => (e._id == id))
            this.setState({
                eventoNombre: evento[0].Evento,
                regalos_key: evento[0].regalos_key
            })
        } else{
            const evento = this.props.eventos.eventos.filter(e => (e._id == id))
            this.setState({
                eventoNombre: evento[0].Evento,
                regalos_key: evento[0].regalos_key
            })
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
                            <Link className="btn-sm btn-dark button-add p-2" to={`/regalos/guardar/${id}`}>Agregar</Link>
                        </td>
                    </tr>
                    <tr className="fila-head">
                        <th className="text-center">TIPO DE REGALO</th>
                        <th className="text-center">REGALO</th>
                        <th className="text-center">ADQUIRIDO</th>
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

    async  modalDelete(id, evento) {
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
            await this.props.borrarRegalo(id)
            await this.props.traerRegalosEventosID(evento)

            this.setState({
                regalosXevento: await this.props.regalos.regalos
            })


        }
    }
    mostrarContenidoTabla() {
        const { match: { params: { id } } } = this.props
        const { regalos } = this.props.regalos
        const { eventos } = this.props.eventos
        const evento = eventos.filter(e => (e._id == id))

        if (this.props.regalos.cargando) {
            return <CargandoSpinner />
        }

        if (this.props.regalos.error) {
            return <AlertMessage message={this.props.regalos.error} type={"warning"} />
        }


    }
    mostrarRegalos(e, index, idEvento) {
        const styleX = {
            color: '#d9534f'
        }
        console.log(e.TipoRegalo);
        
        return (
            <tr key={index} id={e._id}>
                <td className="text-center">
                    {e.TipoRegalo}

                </td>
                <td className="text-center">
                    {e.Objeto ? e.Objeto : e.OpcionDinero}
                </td>
                <td className="text-center">
                    {e.Adquirido ?
                        <i
                            className="fa fa-check fa-lg icono-check"
                            aria-hidden="true"
                        />
                        :
                        <i
                            style={styleX}
                            className="fa fa-times fa-lg"
                            aria-hidden="true"
                        />
                    }
                </td>
                <td className="text-center">
                    <div className="text-center">
                        <Link
                            to={
                                `/regalos/show/regalo/${idEvento}/${e._id}`}
                        >
                            <i
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Ver"
                                className="fas fa-eye icono-ver p-2"
                            />
                        </Link>
                        <Link
                            to={
                                `/regalos/edit/regalo/${idEvento}/${e._id}`}
                        >
                            <i
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Ver"
                                className="fas fa-edit icono-ver p-2"
                            />
                        </Link>

                        <i
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Eliminar"
                            className="fas fa-trash icono-ver p-2"
                            onClick={() =>
                                this.modalDelete(
                                    e._id,
                                    e.Evento_id
                                )
                            }
                        />
                    </div>

                </td>
            </tr>
        )
    }
    render() {

        console.log('props', this.props);

        if (this.props.regalos.error) {
            sweetalert(`${this.props.regalos.error}.`, 'error', 'sweet')

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
                                    <h1 className="page-header-heading">
                                        <Link to="/regalos">
                                            <i className="fas fa-gift sidebar-nav-link-logo" />
                                            &nbsp; Eventos Regalos
                                            </Link>{" "}
                                        / {this.state.eventoNombre}&nbsp;
                                        / Regalos
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div id="sweet" className="container-fluid">
                        {this.mostratTabla()}
                        <footer className="content-wrapper-footer">
                            <span>{this.state.footer}</span>
                        </footer>
                    </div>
                </div>
            </Fragment>
        )
    }

}

const mapStateToProps = ({ regalos, eventos }) => {
    return {
        regalos,
        eventos
    }
}
const mapDispatchToProps = {
    traerRegalosEventosID,
    traerEventos,
    borrarRegalo
};

export default connect(mapStateToProps, mapDispatchToProps)(Show)