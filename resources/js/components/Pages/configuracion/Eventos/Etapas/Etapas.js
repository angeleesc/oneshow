import React, { Component, Fragment } from "react";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import CargandoSpinner from '../../../../atoms/CargandoSpinner'
import AlertMessage from '../../../../atoms/AlertMessage'
import * as empresasActions from '../../../../../redux/actions/empresas'
import * as eventosActions from '../../../../../redux/actions/eventos'
import * as etapasActions from '../../../../../redux/actions/etapas'
const { traerEmpresas } = empresasActions;
const { traerEventos } = eventosActions
const { traerEtapas, borrarEtapa } = etapasActions
class Etapas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            nombreEmpresa: "",
            eventoNombre: "",
            opcion: "Etapas",
            footer: "Footer",
            etapaKey: false
        };

    }

    async componentDidMount() {
        const { match: { params: { id } } } = this.props
        if (!this.props.empresas.empresas.length) {
            this.props.traerEmpresas()
        }
        if (!this.props.eventos.eventos.length) {
            await this.props.traerEventos()
        }
        const evento = this.props.eventos.eventos.filter(e => (e._id == id))
        //seleccionamos las key de los eventos dentro del  del reducer
        const keyEvento = this.props.eventos.eventos.map((e, key) => {
            if (e._id == id) {
                return key
            }
        })
        let key = keyEvento.filter(k => k != undefined)//seleccionamos la key del evento activo

        if (!('etapa_key' in evento[0])) {//verifico si el evento ya tiene la etapa cargada
            await this.props.traerEtapas(id, key[0])
        }
        this.setState({
            etapaKey: true,//ya sabremos que se cargaron las etapas
            keyEvento: key[0]
        })
        this.setState({
            eventoNombre: evento[0].Evento,
            nombreEmpresa: evento[0].Empresa,
            idEmpresa: evento[0].Empresa_id
        })

    }
    async  modalDelete(id, keyItem) {//keyItem para saber cual etapa borrar
        const result = await Swal.fire({
            text: "¿Está seguro que desea borrar la etapa?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#343a40",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            target: document.getElementById("sweet")
        })

        if (result.value) {

            //key de las etapas que identifica el array dentro del reducer de etapas
            const keyEtapa = this.props.eventos.eventos[this.state.keyEvento].etapa_key

            await this.props.borrarEtapa(id, keyEtapa, keyItem)

        }
    }
    mostrarEtapas(etapas, idEvento) {
        return (

            etapas.map((e, index) => (
                <tr key={index} id={e._id}>
                    <td className="text-center">
                        {e.Nombre}

                    </td>
                    <td className="text-center">
                        {e.Fecha}

                    </td>
                    <td className="text-center">
                        {e.Horario}

                    </td>
                    <td className="text-center">
                        <div className="text-center">
                            <Link
                                to={{
                                    pathname: `/eventos/etapas/menu/show/${e._id}`,
                                    state: { evento: idEvento, keyItem: index }
                                }}
                            >
                                <i
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Ver"
                                    className="fas fa-eye icono-ver p-2"
                                />
                            </Link>
                            <Link
                                to={{
                                    pathname: `/eventos/etapas/menu/${e._id}`,
                                    state: { evento: idEvento, keyItem: index }
                                }}
                            >
                                <i
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Menu"
                                    className="fas fa-utensils icono-ver p-2"
                                />
                            </Link>
                            {

                                this.state.permisoUsuario.permisos.evento.includes("edit")
                                &&
                                <Link
                                    to={{
                                        pathname: `/eventos/etapas/edit/${idEvento}/${e._id}`,
                                        state: { keyItem: index }
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
    mostrarContenido() {
        const { match: { params: { id } } } = this.props
        const { etapas } = this.props.etapas
        const { eventos } = this.props.eventos


        if (this.props.etapas.cargando) {
            return <CargandoSpinner />
        }
        const keyEvento = this.props.eventos.eventos.map((e, key) => {
            if (e._id == id) {
                return key
            }
        })

        let key = keyEvento.filter(k => k != undefined)

        if (this.state.etapaKey) {
            if (('etapa_key' in eventos[key[0]])) {
                //una vez tenga el key de etapa verifico si tiene items o no
                if (!etapas[eventos[key[0]].etapa_key].length) {
                    return <AlertMessage message={"No existen etapas"} type={"danger"} />
                }
                return this.mostrarEtapas(etapas[eventos[key[0]].etapa_key], id)
            }
        }
    }
    mostrarTabla() {
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
                                <Link className="btn-sm btn-dark button-add p-2" to={{ pathname: `/eventos/etapas/add/${id}` }}>Agregar</Link>
                            }
                        </td>
                    </tr>
                    <tr className="fila-head">
                        <th className="text-center">ETAPA</th>
                        <th className="text-center">FECHA</th>
                        <th className="text-center">HORA</th>
                        <th className="text-center">
                            ACCIONES
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.mostrarContenido()}
                </tbody>
            </table>
        )

    }


    render() {
        // console.log('props', this.props);
        if (this.props.etapas.error) {
            sweetalert(`${this.props.etapas.error}.`, 'error', 'sweet')

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
                                        <Link to="/empresas">
                                            <i className="fas fa-industry sidebar-nav-link-logo" />
                                            &nbsp; {this.state.nombreEmpresa}&nbsp;
                                            </Link>{" "}
                                        / <Link to={`/empresa/eventos/${this.state.idEmpresa}`}>
                                            {this.state.eventoNombre}&nbsp;
                                            </Link>{" "}
                                        / Etapas
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div id="sweet" className="container-fluid">
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
const mapStateToProps = ({ empresas, eventos, etapas }) => {
    return {
        empresas,
        eventos,
        etapas

    }
}
const mapDispatchToProps = {
    traerEmpresas,
    traerEventos,
    traerEtapas,
    borrarEtapa
};
export default connect(mapStateToProps, mapDispatchToProps)(Etapas)