import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import CargandoSpinner from '../../../../atoms/CargandoSpinner'
import AlertMessage from '../../../../atoms/AlertMessage'
import { Link, Redirect } from "react-router-dom";
import * as regalosActions from '../../../../../redux/actions/regalos'
import * as eventosActions from '../../../../../redux/actions/eventos'

const { traerRegalosEventosID, borrarRegalo } = regalosActions
const { traerEventos } = eventosActions
class Show extends Component {

    constructor(props) {
        super(props);
        this.state = {
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            footer: "Footer",
            eventoNombre: "",
            regaloKey: false

        };

        this.mostratTabla = this.mostratTabla.bind(this);
        this.modalDelete = this.modalDelete.bind(this);
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

        //si el evento no tiene el key del array de los regalos, buscamos los regalos del evento
        if (!('regalos_key' in evento[0])) {
            await this.props.traerRegalosEventosID(id, key[0])
        }
        this.setState({
            regaloKey: true,//ya sabremos que se cargaron los regalos
            keyEvento: key[0]
        })


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
                                <Link className="btn-sm btn-dark button-add p-2" to={{pathname:`/regalos/guardar/${id}`, state: {keyItem: null} }}>Agregar</Link>
                            }
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

    async  modalDelete(id, keyItem) {//keyItem para saber cual regalo borrar
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

            //key de los regalos que identifica el array dentro del reducer de regalos
            const keyRegalo = this.props.eventos.eventos[this.state.keyEvento].regalos_key

            await this.props.borrarRegalo(id, keyRegalo, keyItem, this.state.keyEvento)

        }
    }
    mostrarContenidoTabla() {
        const { match: { params: { id } } } = this.props
        const { regalos } = this.props.regalos
        const { eventos } = this.props.eventos


        if (this.props.regalos.cargando) {
            return <CargandoSpinner />
        }
        const keyEvento = this.props.eventos.eventos.map((e, key) => {
            if (e._id == id) {
                return key
            }
        })

        let key = keyEvento.filter(k => k != undefined)
        if (this.state.regaloKey) {
            if (('regalos_key' in eventos[key[0]])) {
                //una vez tenga el key de regalo verifico si tiene items o no
                if (!regalos[eventos[key[0]].regalos_key].length) {
                    return <AlertMessage message={"No existen regalos"} type={"danger"} />
                }
                return this.mostrarRegalos(regalos[eventos[key[0]].regalos_key], id)
            }
        }

    }
    mostrarRegalos(regalos, idEvento) {
        const styleX = {
            color: '#d9534f'
        }
        return (

            regalos.map((e, index) => (
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
                            {
                                this.state.permisoUsuario.permisos.evento.includes("edit")
                                &&
                                <Link
                                    to={{
                                        pathname:`/regalos/edit/regalo/${idEvento}/${e._id}`,
                                        state: {keyItem: index}
                                    }}
                                >
                                    <i
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Editar"
                                        className="fas fa-edit icono-ver p-2"
                                    />
                                </Link>
                            }

                            {
                                this.state.permisoUsuario.permisos.evento.includes(
                                    "delete"
                                ) &&
                                <i
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Eliminar"
                                    className="fas fa-trash icono-ver p-2"
                                    onClick={() =>
                                        this.modalDelete(
                                            e._id,
                                            index
                                        )
                                    }
                                />
                            }
                        </div>
                    </td>
                </tr>
            ))
        )


    }

    render() {
        // console.log('props',this.props);

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