import React, { Component, Fragment } from "react";
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import * as empresasActions from '../../../../../redux/actions/empresas'
import * as eventosActions from '../../../../../redux/actions/eventos'
import * as etapasActions from '../../../../../redux/actions/etapas'

const { traerEmpresas } = empresasActions;
const { traerEventos } = eventosActions
const {
    handleInputNombreEtapa,
    handleInputHoraEtapa,
    handleInputFechaEtapa,
    traerEtapas,
    guardarEtapa,
    limpiarForm
} = etapasActions
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
        this.mostrarForm = this.mostrarForm.bind(this)
        this.handlInputProps = this.handlInputProps.bind(this)

    }

    async componentDidMount() {
        const { match: { params: { id, etapa } } } = this.props
        if (!this.props.empresas.empresas.length) {
            this.props.traerEmpresas()
        }
        if (!this.props.eventos.eventos.length) {
            await this.props.traerEventos()
        }
        const evento = this.props.eventos.eventos.filter(e => (e._id == id))

        this.setState({
            eventoNombre: evento[0].Evento,
            nombreEmpresa: evento[0].Empresa,
        })

        //seleccionamos las key de los eventos dentro del  del reducer
        const keyEvento = this.props.eventos.eventos.map((e, key) => {
            if (e._id == id) {
                return key
            }
        })
        let key = keyEvento.filter(k => k != undefined)//seleccionamos la key del evento activo/seleccionado

        if (!('etapa_key' in evento[0])) {//verifico si el evento ya tiene la etapa cargada
            await this.props.traerEtapas(id, key[0])
        }
        this.setState({
            keyEvento: key[0]
        })


        if (etapa) {
            const keyEtapa = this.props.eventos.eventos[key[0]].etapa_key//sacamos el key etapa del evento
            const etapaEvento = this.props.etapas.etapas[keyEtapa].filter(r => r._id == etapa)//seleccionamos la etapa activo

            if (etapaEvento) {
                this.handlInputProps(etapaEvento)
            }

        }
    }

    componentWillUnmount() {
        this.props.limpiarForm()
    }
    handlInputProps(etapaArray) {
        etapaArray.map(r => {

            if (('Fecha') in r) {
                this.props.handleInputFechaEtapa(new Date(`${r.Fecha}T00:00:00`))
            }
            if (('Nombre') in r) {
                this.props.handleInputNombreEtapa(r.Nombre)
            }
            if (('Horario') in r) {
                this.props.handleInputHoraEtapa(r.Horario)
            }
        })
    }
    handleSubmit(event) {
        const { match: { params: { id, etapa } } } = this.props
        let keyItem =  null
        event.preventDefault()
        let edit = false

        if (etapa){
            edit = true
            keyItem = this.props.location.state.keyItem 
        }
            //key de la etapa que identifica el array dentro del reducer de etapas
            const keyEtapa = this.props.eventos.eventos[this.state.keyEvento].etapa_key
        if (!this.props.etapas.etapaNombre) {
            sweetalert(
                "Debe colocar un nombre de Etapa",
                "error",
                "sweet"
            );
            return false
        }
        if (!this.props.etapas.etapaHora) {
            sweetalert(
                "Debe colocar una hora a la Etapa",
                "error",
                "sweet"
            );
            return false
        }
        if (!this.props.etapas.etapaFecha) {
            sweetalert(
                "Debe colocar una fecha a la Etapa",
                "error",
                "sweet"
            );
            return false
        }

        const newEtapa = {
            nombre: this.props.etapas.etapaNombre,
            horario: this.props.etapas.etapaHora,
            fecha: this.props.etapas.etapaFecha
        }


        this.props.guardarEtapa(newEtapa, id, keyEtapa, edit, keyItem, etapa)

    }



    handleChangeInput(event) {
        const target = event.target

        if (!target) {
            this.props.handleInputFechaEtapa(event);
            return
        }
        const id = target.id
        const value = target.value


        if (id == "etapaNombre") {
            this.props.handleInputNombreEtapa(value);
        }

        if (id == "etapaHora") {
            this.props.handleInputHoraEtapa(value);
        }


    }
    buttonsForm() {
        const add = this.state.permisoUsuario.permisos.evento.includes("add")
        const edit = this.state.permisoUsuario.permisos.evento.includes("edit")
        if (add || edit) {
            return (
                <Fragment>
                    <button type="submit" id="guardar" className="btn btn-sm btn-dark mr-2">Guardar {this.props.etapas.cargando_guardar && <i className="fa fa-spinner fa-spin" />}</button>
                </Fragment>
            )
        }
    }
    mostrarForm() {
        const { match: { params: { id } } } = this.props
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="row form-group">
                    <div className="col-sm-6 col-md-3">
                        <label>Nombre de la etapa</label>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <input type="text" value={this.props.etapas.etapaNombre} className="form-control form-control-sm" onChange={this.handleChangeInput} id="etapaNombre" name="etapaNombre" placeholder="Ingrese el nombre de la etapa" />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-sm-6 col-md-3">
                        <label>Fecha de la etapa</label>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <DatePicker
                            onChange={this.handleChangeInput}
                            className="form-control form-control-sm"
                            selected={this.props.etapas.etapaFecha}
                            dateFormat="yyyy-dd-MM"
                        />
                    </div>

                </div>
                <div className="row form-group">
                    <div className="col-sm-6 col-md-3">
                        <label>Hora de la etapa</label>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <input type="text" value={this.props.etapas.etapaHora} className="form-control form-control-sm" onChange={this.handleChangeInput} id="etapaHora" name="etapaHora" placeholder="Ingrese la hora ej: 5:00 PM | 17:00" />
                    </div>
                </div>
                <div>
                    <Link to={`/eventos/etapas/${id}`}><button type="button" className="btn btn-sm btn-dark mr-2">Volver</button></Link>
                    {this.buttonsForm()}
                </div>
            </form>
        )
    }

    render() {
        const { match: { params: { id } } } = this.props
        // console.log(this.props);
        if (this.props.etapas.error) {
            sweetalert(`${this.props.etapas.error}.`, 'error', 'sweet')

        }
        if (this.props.etapas.regresar) {
            sweetalert(`Se ha guardado exitosamente.`, 'success', 'sweet')
            setTimeout(() => {
                window.scrollTo(0, 0);
                this.props.history.push(`/eventos/etapas/${id}`);
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
                                    <h1 className="page-header-heading">
                                        <Link to="/empresas">
                                            <i className="fas fa-industry sidebar-nav-link-logo" />
                                            &nbsp; {this.state.nombreEmpresa}&nbsp;
                                        </Link>{" "}
                                        / <Link to={`/eventos/etapas/${id}`}>
                                            {this.state.eventoNombre}&nbsp;
                                        </Link>{" "}
                                        / Agregar Etapa
                                </h1>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div id="sweet" className="container-fluid">
                        {this.mostrarForm()}
                        <footer className="content-wrapper-footer">
                            <span>{this.state.footer}</span>
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
    handleInputNombreEtapa,
    handleInputHoraEtapa,
    handleInputFechaEtapa,
    traerEtapas,
    guardarEtapa,
    limpiarForm
};
export default connect(mapStateToProps, mapDispatchToProps)(Guardar)