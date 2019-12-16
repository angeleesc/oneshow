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
import * as menuEtapasActions from '../../../../../redux/actions/menuEtapas'

const { traerEmpresas } = empresasActions;
const { traerEventos } = eventosActions
const { traerEtapas } = etapasActions
const { traerMenuEtapas, borrarMenuEtapa } = menuEtapasActions
class Show extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            nombreEmpresa: "",
            eventoNombre: "",
            etapaObject: "",
            opcion: "Etapas",
            footer: "Footer",
            menuEtapaKey: false
        };

    }

    async componentDidMount() {
        const { match: { params: { etapa } } } = this.props
        const idEvento = this.props.location.state.evento
        const keyItemEtapa = this.props.location.state.keyItem // key de la etapa seleccionada dentro del reducer de etapas
        if (!this.props.empresas.empresas.length) {
            this.props.traerEmpresas()
        }
        if (!this.props.eventos.eventos.length) {
            await this.props.traerEventos()

        }
        const evento = this.props.eventos.eventos.filter(e => (e._id == idEvento))
        //seleccionamos las key de los eventos dentro del  del reducer
        const keyEvento = this.props.eventos.eventos.map((e, key) => {
            if (e._id == idEvento) {
                return key
            }
        })
        let key = keyEvento.filter(k => k != undefined)//seleccionamos la key del evento activo

        if (!('etapa_key' in evento[0])) {//verifico si el evento ya tiene la etapa cargada
            await this.props.traerEtapas(idEvento, key[0])

        }

        const keyEtapa = this.props.eventos.eventos[key[0]].etapa_key//key de la etapa dentro de los eventos
        const etapaSelected = this.props.etapas.etapas[keyEtapa][keyItemEtapa]//etapa seleccionada

        if (!('menuEtapa_key' in etapaSelected)) {
            await this.props.traerMenuEtapas(etapa, keyEtapa, keyItemEtapa)
        }

        this.setState({
            menuEtapaKey: true,//ya sabremos que se cargaron las etapas
            keyEvento: key[0],
            keyMenuEtapa: this.props.etapas.etapas[keyEtapa][keyItemEtapa].menuEtapa_key
        })
        this.setState({
            eventoNombre: evento[0].Evento,
            nombreEmpresa: evento[0].Empresa,
            idEmpresa: evento[0].Empresa_id,
            etapaObject: etapaSelected
        })

    }
    async  modalDelete(idMenu, keyItem) {//keyItem para saber cual menu de etapa borrar

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

            await this.props.borrarMenuEtapa(idMenu, this.state.keyMenuEtapa, keyItem)

        }
    }
    mostrarEtapas(menuEtapa, idEtapa) {
        const idEvento = this.props.location.state.evento
        const keyItemEtapa = this.props.location.state.keyItem
        return (

            menuEtapa.map((e, index) => (
                <li>
                    <strong>
                        {e.Titulo}
                    </strong>
                    <p>
                        {e.Descripcion}
                    </p>
                </li>
            ))
        )
    }
    mostrarContenido() {
        const { match: { params: { etapa } } } = this.props
        const { menuEtapas } = this.props.menuEtapas
        const keyItemEtapa = this.props.location.state.keyItem
        const idEvento = this.props.location.state.evento

        if (this.props.menuEtapas.cargando) {
            return <CargandoSpinner />
        }

        if (this.state.menuEtapaKey) {
            const keyEvento = this.props.eventos.eventos.map((e, key) => {
                if (e._id == idEvento) {
                    return key
                }
            })

            let key = keyEvento.filter(k => k != undefined)//key del evento seleccionado
            const keyEtapa = this.props.eventos.eventos[key[0]].etapa_key//key de la etapa dentro de los eventos
            const etapaSelected = this.props.etapas.etapas[keyEtapa][keyItemEtapa]//etapa seleccionada


            if (('menuEtapa_key' in etapaSelected)) {
                //una vez tenga el key de etapa verifico si tiene items o no
                if (!this.props.menuEtapas.menuEtapas[etapaSelected.menuEtapa_key].length) {

                    return <p> No existe menú</p>
                }

                return this.mostrarEtapas(menuEtapas[etapaSelected.menuEtapa_key], etapa)
            }
        }
    }


    render() {
        const idEvento = this.props.location.state.evento
        // console.log('props', this.props);
        // if (this.props.etapas.error) {
        //     sweetalert(`${this.props.etapas.error}.`, 'error', 'sweet')

        // }
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
                                        / <Link to={`/eventos/etapas/${idEvento}`}>
                                            Etapas
                                        </Link>{" "}
                                        / {this.state.etapaObject.Nombre}&nbsp;
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div id="sweet" className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12 col-md-6 offset-md-3 text">
                                <h2 className="">
                                    {this.state.etapaObject.Nombre}
                                </h2>

                                <h3 className="p-2"><u>Menú</u></h3>
                                <div>
                                    {this.mostrarContenido()}
                                </div>
                            </div>
                        </div>
                       
                        <footer className="content-wrapper-footer">
                            <span>{this.state.footer}</span>
                        </footer>
                    </div>
                </div>
            </Fragment>
        )
    }
}


const mapStateToProps = ({ empresas, eventos, etapas, menuEtapas }) => {
    return {
        empresas,
        eventos,
        etapas,
        menuEtapas
    }
}
const mapDispatchToProps = {
    traerEmpresas,
    traerEventos,
    traerEtapas,
    traerMenuEtapas,
    borrarMenuEtapa
};
export default connect(mapStateToProps, mapDispatchToProps)(Show)