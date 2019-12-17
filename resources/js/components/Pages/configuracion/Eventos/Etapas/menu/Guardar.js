import React, { Component, Fragment } from "react";
import Menu from "../../../../../components/Menu";
import Header from "../../../../../components/Header";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import * as empresasActions from '../../../../../../redux/actions/empresas'
import * as eventosActions from '../../../../../../redux/actions/eventos'
import * as etapasActions from '../../../../../../redux/actions/etapas'
import * as menuEtapasActions from '../../../../../../redux/actions/menuEtapas'

const { traerEmpresas } = empresasActions;
const { traerEventos } = eventosActions
const { traerEtapas } = etapasActions
const {
    handleInputTituloMenuEtapa,
    handleInputDescripcionMenuEtapa,
    guardarMenuEtapa,
    traerMenuEtapas,
    limpiarForm
} = menuEtapasActions
class Guardar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            opcion: "Etapas",
            footer: "Footer",
        };

        this.handleChangeInput = this.handleChangeInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        // this.handlInputProps = this.handlInputProps.bind(this)
        this.mostrarForm = this.mostrarForm.bind(this)
    }

    async componentDidMount() {
        const { match: { params: { etapa, menu } } } = this.props
        const idEvento = this.props.location.state.evento
        const keyItemEtapa = this.props.location.state.keyItem// key de la etapa seleccionada dentro del reducer de etapas
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
            etapaKey: true,//ya sabremos que se cargaron las etapas
            keyEvento: key[0],
            keyMenuEtapa: this.props.etapas.etapas[keyEtapa][keyItemEtapa].menuEtapa_key
        })
        this.setState({
            eventoNombre: evento[0].Evento,
            nombreEmpresa: evento[0].Empresa,
            idEmpresa: evento[0].Empresa_id,
            etapaObject: etapaSelected
        })


        if (menu) {

            const menuEtapaEvento = this.props.menuEtapas.menuEtapas[this.props.etapas.etapas[keyEtapa][keyItemEtapa].menuEtapa_key].filter(m => m._id == menu)

            if (menuEtapaEvento) {
                this.handlInputProps(menuEtapaEvento)
            }

        }
    }

    componentWillUnmount() {
        this.props.limpiarForm()
    }
    handlInputProps(menuEtapaEvento) {
        menuEtapaEvento.map(m => {

            if (('Titulo') in m) {
                this.props.handleInputTituloMenuEtapa(m.Titulo)
            }
            if (('Descripcion') in m) {
                this.props.handleInputDescripcionMenuEtapa(m.Descripcion)
            }
        })
    }
    handleSubmit(event) {
        const { match: { params: { etapa, menu } } } = this.props
        const keyItemIndex = this.props.location.state.keyItemIndex
        const keyMenuEtapa = this.state.keyMenuEtapa
        
        event.preventDefault()
        let edit = false

        if (menu) {
            edit = true
        }
        //key de la etapa que identifica el array dentro del reducer de etapas
        // const keyEtapa = this.props.eventos.eventos[this.state.keyEvento].etapa_key
        if (!this.props.menuEtapas.titulo) {
            sweetalert(
                "Debe colocar un título al menú",
                "error",
                "sweet"
            );
            return false
        }

        const newMenuEtapa = {
            titulo: this.props.menuEtapas.titulo,
            descripcion: this.props.menuEtapas.descripcion,
        }


        this.props.guardarMenuEtapa(newMenuEtapa, etapa, keyMenuEtapa, keyItemIndex, edit, menu)

    }



    handleChangeInput(event) {
        const target = event.target
        const id = target.id
        const value = target.value

        if (id == "tituloMenu") {
            this.props.handleInputTituloMenuEtapa(value);
        }

        if (id == "descripcionMenu") {
            this.props.handleInputDescripcionMenuEtapa(value);
        }
    }
    buttonsForm() {
        const add = this.state.permisoUsuario.permisos.evento.includes("add")
        const edit = this.state.permisoUsuario.permisos.evento.includes("edit")
        if (add || edit) {
            return (
                <Fragment>
                    <button type="submit" id="guardar" className="btn btn-sm btn-dark mr-2">Guardar {this.props.menuEtapas.cargando_guardar && <i className="fa fa-spinner fa-spin" />}</button>
                </Fragment>
            )
        }
    }
    mostrarForm(etapa, idEvento, keyItemEtapa) {
        // const { match: { params: { id } } } = this.props
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="row form-group">
                    <div className="col-sm-6 col-md-3">
                        <label>Título del menú</label>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <input type="text" value={this.props.menuEtapas.titulo} onChange={this.handleChangeInput} className="form-control form-control-sm" id="tituloMenu" name="tituloMenu" placeholder="Ingrese el titulo del menu" />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-sm-6 col-md-3">
                        <label>Descripción del menú</label>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <textarea type="text" value={this.props.menuEtapas.descripcion} onChange={this.handleChangeInput} className="form-control form-control-sm" id="descripcionMenu" name="descripcionMenu" placeholder="Ingrese el descripción del menú" />
                    </div>
                </div>
                <div>
                    <Link to={{
                        pathname: `/eventos/etapas/menu/${etapa}`,
                        state: { evento: idEvento, keyItem: keyItemEtapa }
                    }}><button type="button" className="btn btn-sm btn-dark mr-2">Volver</button></Link>
                    {this.buttonsForm()}
                </div>
            </form >
        )
    }

    render() {
        const idEvento = this.props.location.state.evento
        const keyItemEtapa = this.props.location.state.keyItem
        const { match: { params: { etapa } } } = this.props

        // console.log(this.props);
        if (this.props.menuEtapas.error) {
            sweetalert(`${this.props.menuEtapas.error}.`, 'error', 'sweet')

        }
        if (this.props.menuEtapas.regresar) {
            sweetalert(`Se ha guardado exitosamente.`, 'success', 'sweet')
            setTimeout(() => {
                window.scrollTo(0, 0);
                this.props.history.push(
                    {
                        pathname: `/eventos/etapas/menu/${etapa}`
                        , state: { evento: idEvento, keyItem: keyItemEtapa }
                    });
            }, 2000);
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
                                    / <Link to={{
                                        pathname: `/eventos/etapas/menu/${etapa}`,
                                        state: { evento: idEvento, keyItem: keyItemEtapa }
                                    }}>
                                        {this.state.etapaObject && this.state.etapaObject.Nombre}&nbsp;
                                        </Link>{" "}
                                    / Agregar Menú
                                </div>
                            </div>
                        </div>
                    </header>
                    <div id="sweet" className="container-fluid">
                        {this.mostrarForm(etapa, idEvento, keyItemEtapa)}
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
    handleInputTituloMenuEtapa,
    handleInputDescripcionMenuEtapa,
    guardarMenuEtapa,
    traerMenuEtapas,
    limpiarForm
};
export default connect(mapStateToProps, mapDispatchToProps)(Guardar)