import React, { Component, Fragment, createRef } from "react";
import { connect } from 'react-redux';
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import FormDinero from './FormDinero'
import FormObjeto from './FormObjeto'
import { Link } from "react-router-dom";
import * as regalosActions from '../../../../../redux/actions/regalos'
import * as eventosActions from '../../../../../redux/actions/eventos'

const {
    handleInputTipoRegalo,
    handleInputTipoRegaloDinero,
    handleInputBanco,
    handleInputCuentaCuil,
    handleInputCbu,
    handleInputPathImg,
    handleInputObjeto,
    handleInputSKU,
    handleInputTiendaSugerida,
    handleInputLink,
    guardarRegalo,
    traerRegalosEventosID,
    limpiarForm,
} = regalosActions
const { traerEventos } = eventosActions


class Guardar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            permisoUsuario: JSON.parse(localStorage.getItem("permisosUsuario")),
            opcion: "Invitacion",
            footer: "Footer",
            url: process.env.MIX_HOST,
            eventoNombre: "",
            valueRegaloObjeto: 'OBJETO',
            valueRegaloDinero: 'DINERO',
            selectTipoRegalo: false,//se activa cuando cambia select tipo de regalo
            // selectTipoRegaloDinero: false,
            inputDisabled: false,
            inputTransferenciaDisabled: false,
            inputEfectivoDisabled: false

        }
        this.refSelectTipoRegalo = createRef();
        this.refSelectTipoRegaloDinero = createRef();
        this.imagenObjeto = createRef();
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleChangeSelectTipoRegalo = this.handleChangeSelectTipoRegalo.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.buttonsFooter = this.buttonsFooter.bind(this);

    }

    async componentDidMount() {

        const { match: { params: { id, regalo } } } = this.props

        if (!this.props.eventos.eventos.length) {
            //si no existen los eventos los traemos del reducer
            await this.props.traerEventos()

            const evento = this.props.eventos.eventos.filter(e => (e._id == id))
            this.setState({
                eventoNombre: evento[0].Evento,
            })
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
            keyEvento: key[0]
        })

        if (regalo) {
            this.setState({
                selectTipoRegalo: true
            })
            let edit = null
            const path = this.props.location.pathname.split('/')[2]


            if (path == 'edit') {
                edit = true
            }

            const keyRegalo = this.props.eventos.eventos[key[0]].regalos_key//sacamos el key regalo del evento

            const regaloEvento = this.props.regalos.regalos[keyRegalo].filter(r => r._id == regalo)//seleccionamos el regalo activo

            !edit && this.setState({
                inputDisabled: true// si es solo para ver colocamos los input en disabled
            })
            if (regaloEvento) {

                if (regaloEvento[0].OpcionDinero == 'TRANSFERENCIA') {

                    edit ?
                        this.setState({
                            inputTransferenciaChecked: true,

                        })
                        :
                        this.setState({
                            inputTransferenciaDisabled: true,
                            inputTransferenciaChecked: true,

                        })
                } else if(regaloEvento[0].OpcionDinero == 'EFECTIVO') {
                    edit ?
                        this.setState({
                            inputEfectivoChecked: true

                        })
                        :
                        this.setState({
                            inputEfectivoDisabled: true,
                            inputEfectivoChecked: true

                        })
                }else{
                    this.setState({
                        inputEfectivoDisabled: "",
                        inputEfectivoChecked: ""

                    })
                }

                this.handlInputProps(regaloEvento)

            }
        }
    }
    componentWillUnmount() {
        this.props.limpiarForm()
        this.setState({
            inputEfectivoDisabled: "",
            inputEfectivoChecked: "",
            inputTransferenciaDisabled: "",
            inputTransferenciaChecked: "",
        })
    }
    handlInputProps(regaloArray) {
        regaloArray.map(r => {

            if (('TipoRegalo') in r) {

                this.props.handleInputTipoRegalo(r.TipoRegalo)
            }
            if (('OpcionDinero') in r) {
                this.props.handleInputTipoRegaloDinero(r.OpcionDinero)
            }
            if (('Banco') in r) {
                this.props.handleInputBanco(r.Banco)
            }
            if (('CUIL') in r) {
                this.props.handleInputCuentaCuil(r.CUIL)
            }
            if (('CBU') in r) {
                this.props.handleInputCbu(r.CBU)

            }
            if (('PathImg') in r) {
                this.props.handleInputPathImg(r.PathImg)

            }
            if (('Objeto') in r) {
                this.props.handleInputObjeto(r.Objeto)

            }
            if (('SKU') in r) {
                this.props.handleInputSKU(r.SKU)

            }
            if (('TiendaSugerida') in r) {
                this.props.handleInputTiendaSugerida(r.TiendaSugerida)

            }
            if (('Link') in r) {
                this.props.handleInputLink(r.Link)

            }
        })
    }
    handleChangeInput(event) {

        const target = event.target
        const id = target.id
        const value = target.value


        if (id == "tipoRegalo") {
            this.props.handleInputTipoRegalo(value);
            this.setState({ selectTipoRegalo: true })
        }

        if (id == "tipo-efectivo") {
            this.props.handleInputTipoRegaloDinero(value);
            this.setState({ inputEfectivoChecked: true, inputTransferenciaChecked: false })
        }
        if (id == "tipo-transfrencia") {
            this.props.handleInputTipoRegaloDinero(value);
            this.setState({ inputTransferenciaChecked: true, inputEfectivoChecked: false })
        }
        if (id == "Banco") {
            this.props.handleInputBanco(value)
        }
        if (id == "CUIL") {
            this.props.handleInputCuentaCuil(value)
        }
        if (id == "CBU") {
            this.props.handleInputCbu(value)
        }
        if (id == "fotoObjeto") {
            const imgObjeto = this.imagenObjeto.current
            const tagImg = document.querySelector("#fotoTagImg")
            const ext = imgObjeto.files[0].type.split("/")[1]
            if (ext == 'jpg' || ext == 'png' || ext == 'jpeg') {
                // const img = URL.createObjectURL(imgObjeto.files[0])
                const reader = new FileReader();
                reader.onloadend = function () {
                    tagImg.src = reader.result;
                }
                if (imgObjeto.files[0]) {
                    reader.readAsDataURL(imgObjeto.files[0]);
                } else {
                    tagImg.src = "";
                }
                this.props.handleInputPathImg(imgObjeto.files[0])
            } else {
                sweetalert(
                    "Archivo no soportado debe se run archivo JPG | PNG | JPEG",
                    "error",
                    "sweet"
                );
                return false;
            }
        }
        if (id == "Objeto") {
            this.props.handleInputObjeto(value)
        }
        if (id == "SKU") {
            this.props.handleInputSKU(value)
        }
        if (id == "TiendaSugerida") {
            this.props.handleInputTiendaSugerida(value)
        }
        if (id == "Link") {
            this.props.handleInputLink(value)
        }

    }
    buttonsFooter(id) {
        if (!this.state.inputDisabled && this.state.permisoUsuario.permisos.evento.includes("edit")) {
            return (
                <Fragment>
                    <Link to={`/regalos/show/${id}`}><button type="button" className="btn btn-sm btn-dark mr-2">Volver</button></Link>
                    <button type="submit" id="guardar" className="btn btn-sm btn-dark mr-2">Guardar {this.props.regalos.cargando_guardar && <i className="fa fa-spinner fa-spin" />}</button>
                </Fragment>
            )

        } else {
            return (
                <Fragment>
                    <Link to={`/regalos/show/${id}`}><button type="button" className="btn btn-sm btn-dark mr-2">Volver</button></Link>
                </Fragment>
            )
        }

    }
    handleChangeSelectTipoRegalo() {

        let value = null;

        value = this.props.regalos.tipoRegalo;

        if (value == 0) return;

        if (value == this.state.valueRegaloDinero) {
            const inputTransferencia = {
                Banco: this.props.regalos.Banco,
                CUIL: this.props.regalos.CUIL,
                CBU: this.props.regalos.CBU
            }
            const inputChecked = {
                inputTransferenciaDisabled: this.state.inputTransferenciaDisabled,
                inputTransferenciaChecked: this.state.inputTransferenciaChecked,
                inputEfectivoDisabled: this.state.inputEfectivoDisabled,
                inputEfectivoChecked: this.state.inputEfectivoChecked
            }
            return <FormDinero inputChecked={inputChecked} disabled={this.state.inputDisabled} inputstransferencia={inputTransferencia} OpcionDinero={this.props.regalos.OpcionDinero} changeFn={this.handleChangeInput} />
        }

        if (value == this.state.valueRegaloObjeto) {
            const inputObjeto = {
                PathImg: this.props.regalos.PathImg,
                Objeto: this.props.regalos.Objeto,
                SKU: this.props.regalos.SKU,
                TiendaSugerida: this.props.regalos.TiendaSugerida,
                Link: this.props.regalos.Link,
                url: this.state.url,
                refImg: this.imagenObjeto
            }
            return <FormObjeto disabled={this.state.inputDisabled} inputsObjeto={inputObjeto} changeFn={this.handleChangeInput} />
        }

    }

    handleFormSubmit(event) {
        event.preventDefault()
        const { match: { params: { id, regalo } } } = this.props
        const path = this.props.location.pathname.split('/')[2]


        let edit = null
        if (path == 'edit') {
            edit = true
        }

        const keyItem = this.props.location.state.keyItem


        const {
            tipoRegalo,
            OpcionDinero,
            Banco,
            CUIL,
            CBU,
            PathImg,
            Objeto,
            SKU,
            TiendaSugerida,
            Link
        } = this.props.regalos

        //key de los regalos que identifica el array dentro del reducer de regalos
        const keyRegalo = this.props.eventos.eventos[this.state.keyEvento].regalos_key

        if (this.props.regalos.tipoRegalo == this.state.valueRegaloDinero) {
            if (this.props.regalos.OpcionDinero == 'TRANSFERENCIA') {
                if (!Banco) {
                    sweetalert(
                        "Debe colocar un nombre de Banco",
                        "error",
                        "sweet"
                    );
                    return false
                }
                if (Banco.length > 35) {
                    sweetalert(
                        "El límite de caracteres en el banco son 35",
                        "error",
                        "sweet"
                    );
                    return false
                }
                if (!CUIL) {
                    sweetalert(
                        "Debe colocar un CUIL",
                        "error",
                        "sweet"
                    );
                    return false
                }
                if (CUIL.length > 11 || isNaN(CUIL)) {
                    sweetalert(
                        "El CUIL debe ser númerico y máximo 11 caracteres",
                        "error",
                        "sweet"
                    );
                    return false
                }

                if (!CBU) {
                    sweetalert(
                        "Debe colocar un CBU",
                        "error",
                        "sweet"
                    );
                    return false
                }
                if (CBU.length > 22 || isNaN(CBU)) {
                    sweetalert(
                        "El CBU debe ser númerico y máximo 22 caracteres",
                        "error",
                        "sweet"
                    );
                    return false
                }
                const nuevo_regalo = {
                    TipoRegalo: tipoRegalo,
                    OpcionDinero,
                    Banco,
                    CUIL,
                    CBU
                }
                this.props.guardarRegalo(nuevo_regalo, id, regalo, keyRegalo, edit, keyItem, this.state.keyEvento)
            } else {
                const tagRegaloTipoDinero = document.querySelector('#tipo-efectivo');
                const checked = tagRegaloTipoDinero.checked
                if (checked) {
                    const nuevo_regalo = {
                        TipoRegalo: this.props.regalos.tipoRegalo,
                        OpcionDinero: this.props.regalos.OpcionDinero,

                    }
                    this.props.guardarRegalo(nuevo_regalo, id, regalo, keyRegalo, edit, keyItem, this.state.keyEvento)
                }

            }
        }

        if (this.props.regalos.tipoRegalo == this.state.valueRegaloObjeto) {
            if (!PathImg) {
                sweetalert(
                    "Seleccione una imagen",
                    "error",
                    "sweet"
                );
                return false;
            }
            if (!Objeto) {
                sweetalert(
                    "Debe ingresar un nombre ",
                    "error",
                    "sweet"
                );
                return false;
            }
            let formData = new FormData()
            formData.append('TipoRegalo', this.props.regalos.tipoRegalo)
            formData.append('PathImg',  this.props.regalos.PathImg)
            formData.append('Objeto',  this.props.regalos.Objeto)
            formData.append('SKU',  this.props.regalos.SKU)
            formData.append('TiendaSugerida',  this.props.regalos.TiendaSugerida)
            formData.append('Link',  this.props.regalos.Link)

            this.props.guardarRegalo(formData, id, regalo, keyRegalo, edit, keyItem)
        }
    }
    render() {

        const { match: { params: { id } } } = this.props

        // console.log('this.props',this.props);

        if (this.props.regalos.error) {
            sweetalert(`${this.props.regalos.error}.`, 'error', 'sweet')

        }
        if (this.props.regalos.regresar) {
            sweetalert(`Se ha guardado exitosamente.`, 'success', 'sweet')
            setTimeout(() => {
                window.scrollTo(0, 0);
                this.props.history.push(`/regalos/show/${id}`);
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
                                <div className="col-sm-6 col-md-12">
                                    <h1 className="page-header-heading">
                                        <Link to={`/regalos`}>
                                            <i className="fas fa-gift sidebar-nav-link-logo" />
                                            Agregar Regalo
                                        </Link>{" "}
                                        / <Link to={`/regalos/show/${id}`}>
                                            {this.state.eventoNombre} &nbsp;
                                        </Link>
                                        / Agregar Regalo
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div id="sweet" className="container-fluid">
                        <div className="row p-3">
                            <div className="col-sm-6 col-md-3 col-form-label col-form-label-sm">
                                <span>Seleccionar tipo de Regalo</span>
                            </div>
                            <div className="col-sm-6 col-md-3 ">
                                <select ref={this.refSelectTipoRegalo} id="tipoRegalo" onChange={this.handleChangeInput} className="input form-control form-control-sm" disabled={this.state.inputDisabled}>
                                    <option value="0">
                                        Seleccionar
                                    </option>
                                    <option value={this.state.valueRegaloDinero}>
                                        Dinero
                                    </option>
                                    <option value={this.state.valueRegaloObjeto}>
                                        Regalo objeto / Servicio
                                    </option>
                                </select>
                            </div>
                        </div>
                        <br /><br />

                        <form onSubmit={this.handleFormSubmit} >
                            {this.state.selectTipoRegalo ? this.handleChangeSelectTipoRegalo() : ''}
                            <div className="form-group row">
                                <div className="col-sm-4 p-3">
                                    {this.buttonsFooter(id)}
                                </div>
                            </div>
                        </form>
                        <footer className="content-wrapper-footer">
                            {/* <span>{this.state.footer}</span> */}
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
    handleInputTipoRegalo,
    handleInputTipoRegaloDinero,
    handleInputBanco,
    handleInputCuentaCuil,
    handleInputCbu,
    handleInputPathImg,
    handleInputObjeto,
    handleInputSKU,
    handleInputTiendaSugerida,
    handleInputLink,
    guardarRegalo,
    traerRegalosEventosID,
    traerEventos,
    limpiarForm
}
export default connect(mapStateToProps, mapDispatchToProps)(Guardar)
