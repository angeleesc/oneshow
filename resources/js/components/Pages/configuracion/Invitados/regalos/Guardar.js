import React, { Component, Fragment, createRef } from "react";
import { connect } from 'react-redux';
import Menu from "../../../../components/Menu";
import Header from "../../../../components/Header";
import { Link } from "react-router-dom";
import * as regalosActions from '../../../../../redux/actions/regalos'
import * as eventosActions from '../../../../../redux/actions/eventos'
import './index.css'
const {
    traerRegalosEventosID,
    handleInputBanco,
    handleInputCuentaCuil,
    handleInputCbu,
    handleInputPathImg,
    handleInputObjeto,
    handleInputSKU,
    handleInputTiendaSugerida,
    handleInputLink,
    handleInputTipoRegalo,
    handleInputTipoRegaloDinero,
    guardarRegalo,
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
            url: "http://localhost:8001",
            eventoNombre: "",
            valueRegaloObjeto: 'OBJETO',
            valueRegaloDinero: 'DINERO',
            selectTipoRegalo: false,
            selectTipoRegaloDinero: false,
            inputDisabled: false,
            inputTransferenciaDisabled: false,
            inputEfectivoDisabled: false

        }
        this.refSelectTipoRegalo = createRef();
        this.refSelectTipoRegaloDinero = createRef();
        this.imagenObjeto = createRef();
        this.handleChangeSelectTipoRegalo = this.handleChangeSelectTipoRegalo.bind(this);
        this.mostrarFormDinero = this.mostrarFormDinero.bind(this);
        this.mostrarFormObjeto = this.mostrarFormObjeto.bind(this);
        this.handleSelectTipoDinero = this.handleSelectTipoDinero.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handlInputProps = this.handlInputProps.bind(this);
        this.buttonsFooter = this.buttonsFooter.bind(this);

    }

    async componentDidMount() {

        const { match: { params: { id, regalo, editRegalo } } } = this.props
        const { eventos } = this.props.eventos
        const { regalos } = this.props.regalos

        if (!eventos.length) {
            await this.props.traerEventos()
            const nombre = this.props.eventos.eventos.filter(e => (e._id == id))
            this.setState({
                eventoNombre: nombre[0].Evento
            })
        } else {
            const nombre = eventos.filter(e => (e._id == id))
            this.setState({
                eventoNombre: nombre[0].Evento
            })
        }

        if (!regalos.length) {
            await this.props.traerRegalosEventosID(id)
        }

        if (editRegalo) {
            this.setState({
                selectTipoRegalo: true
            })

            const regaloEvento = this.props.regalos.regalos.filter(r => r._id == editRegalo)
            if (regaloEvento) {

                if (regaloEvento[0].OpcionDinero == 'TRANSFERENCIA') {
                    this.setState({
                        inputTransferenciaChecked: true
                    })
                } else {
                    this.setState({
                        inputEfectivoChecked: true
                    })
                }
                this.handlInputProps(regaloEvento)
            }
        }
        if (regalo) {
            this.setState({
                selectTipoRegalo: true
            })

            const regaloEvento = this.props.regalos.regalos.filter(r => r._id == regalo)


            const path = this.props.location.pathname.split('/')[3]
            if (path == 'regalo') {
                this.setState({
                    inputDisabled: true
                })
            }

            if (regaloEvento) {

                if (regaloEvento[0].OpcionDinero == 'TRANSFERENCIA') {
                    this.setState({
                        inputTransferenciaDisabled: true,
                        inputTransferenciaChecked: true,
                    })
                } else {
                    this.setState({
                        inputEfectivoDisabled: true,
                        inputEfectivoChecked: true
                    })
                }

                this.handlInputProps(regaloEvento)

            }
        }
    }
    componentWillUnmount() {
        this.props.limpiarForm()
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
            const tagImg = document.querySelector("#fotoTagImg")
            const imgObjeto = this.imagenObjeto.current
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

        if (id == "tipoRegalo") {
            this.props.handleInputTipoRegalo(value);
            this.setState({ selectTipoRegalo: true })
        }
        if (id == "tipo-efectivo") {
            this.props.handleInputTipoRegaloDinero(value);
            this.setState({ selectTipoRegaloDinero: false, inputEfectivoChecked: true, inputTransferenciaChecked: false })
        }

        if (id == "tipo-transfrencia") {
            this.props.handleInputTipoRegaloDinero(value);
            this.setState({ selectTipoRegaloDinero: true, inputTransferenciaChecked: true, inputEfectivoChecked: false })
            
        }
    }
    buttonsFooter() {
        if (!this.state.inputDisabled) {
            return <button type="submit" id="guardar" className="btn btn-sm btn-dark mr-2">Guardar</button>
        }

    }
    handleFormSubmit(event) {
        event.preventDefault()
        const { match: { params: { id,editRegalo } } } = this.props
      
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
                this.props.guardarRegalo(nuevo_regalo, id, editRegalo)
            } else {
                const tagRegaloTipoDinero = document.querySelector('#tipo-efectivo');
                const checked = tagRegaloTipoDinero.checked
                if (checked) {
                    const nuevo_regalo = {
                        TipoRegalo: this.props.regalos.tipoRegalo,
                        OpcionDinero: this.props.regalos.OpcionDinero,

                    } 
                    this.props.guardarRegalo(nuevo_regalo, id, editRegalo)
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
            formData.append('PathImg', PathImg)
            formData.append('Objeto', Objeto)
            formData.append('SKU', SKU)
            formData.append('TiendaSugerida', TiendaSugerida)
            formData.append('Link', Link)

            this.props.guardarRegalo(formData, id)
        }
    }

    handleSelectTipoDinero() {

        if (this.props.regalos.OpcionDinero == 'TRANSFERENCIA') {
            return (
                <div>
                    <div className="row form-group">
                        <div className="col-sm-6 col-md-3 offset-md-6">
                            <label>Nombre Banco</label>
                        </div>
                        <div className="col-sm-6 col-md-3 offset-md-6">
                            <input type="text" className="form-control form-control-sm" value={this.props.regalos.Banco && this.props.regalos.Banco} disabled={this.state.inputDisabled} onChange={this.handleChangeInput} id="Banco" name="Banco" placeholder="Ingrese el nombre del Banco" />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-sm-6 col-md-3 offset-md-6">
                            <label>CUIL</label>
                        </div>
                        <div className="col-sm-6 col-md-3 offset-md-6">
                            <input type="text" className="form-control form-control-sm" value={this.props.regalos.CUIL && this.props.regalos.CUIL} disabled={this.state.inputDisabled} id="CUIL" onChange={this.handleChangeInput} name="CUIL" placeholder="Ingrese código CUIL" />
                        </div>
                    </div>
                    <div className="row form-group ">
                        <div className="col-sm-6 col-md-3 offset-md-6">
                            <label>CBU</label>
                        </div>
                        <div className="col-sm-6 col-md-3 offset-md-6">
                            <input type="text" className="form-control form-control-sm" value={this.props.regalos.CBU && this.props.regalos.CBU} disabled={this.state.inputDisabled} id="CBU" onChange={this.handleChangeInput} name="CBU" placeholder="Ingrese código CBU" />
                        </div>
                    </div>
                </div>
            )
        }
    }




    mostrarFormDinero() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-xs-3 p-3 col-md-3 text-center">
                        <input type="radio" id="tipo-efectivo" checked={this.state.inputEfectivoChecked} ref={this.refSelectTipoRegaloDinero} disabled={this.state.inputTransferenciaDisabled} onChange={this.handleChangeInput} value="EFECTIVO" name="tipo-dinero" className="custom-control-input" />
                        <label className="custom-control-label" htmlFor="tipo-efectivo" > Efectivo</label>
                    </div>
                    <div className="col-xs-3 p-3 col-md-3 text-center">
                        <input type="radio" id="tipo-transfrencia" checked={this.state.inputTransferenciaChecked} disabled={this.state.inputEfectivoDisabled} ref={this.refSelectTipoRegaloDinero} onChange={this.handleChangeInput} value="TRANSFERENCIA" name="tipo-dinero" className="custom-control-input" />
                        <label className="custom-control-label" htmlFor="tipo-transfrencia" > Transfrencia</label>
                    </div>
                </div>
                {this.handleSelectTipoDinero()}
            </Fragment>
        )
    }
    mostrarFormObjeto() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-5 text-center" id="contenedor_imagen_objeto">
                        <img src={this.props.regalos.PathImg ? this.props.regalos.PathImg : `${this.state.url}/images/example.png`} className="mr-4" id="fotoTagImg" alt="foto objeto" />
                        <input type="file" ref={this.imagenObjeto} id="fotoObjeto" disabled={this.state.inputDisabled} name="fotoObjeto" onChange={this.handleChangeInput} />
                    </div>

                    <div className="col-sm-12 col-md-12 col-lg-7 p-3">
                        <div className="form-group">
                            <label htmlFor="objeto">Nombre del objeto / Nombre del servicio</label>
                            <input type="text" value={this.props.regalos.Objeto && this.props.regalos.Objeto} className="form-control" disabled={this.state.inputDisabled} onChange={this.handleChangeInput} id="Objeto" aria-describedby="objetoHelp" placeholder="Ingrese nombre del regalo o servicio" />
                            {/* <small id="objetoHelp" className="form-text text-muted">Nombre descriptivo del objeto</small> */}
                        </div>
                        <div className="form-group">
                            <label htmlFor="objeto">SKU</label>
                            <input type="text" value={this.props.regalos.SKU && this.props.regalos.SKU} className="form-control" disabled={this.state.inputDisabled} onChange={this.handleChangeInput} id="SKU" aria-describedby="" placeholder="Ingrese código SKU" />
                            {/* <small id="objetoHelp" className="form-text text-muted">Nombre descriptivo del objeto</small> */}
                        </div>
                        <div className="form-group">
                            <label htmlFor="tienda">Tienda sugerida</label>
                            <input type="text" value={this.props.regalos.TiendaSugerida && this.props.regalos.TiendaSugerida} className="form-control" disabled={this.state.inputDisabled} onChange={this.handleChangeInput} id="TiendaSugerida" aria-describedby="" placeholder="Ingrese una tienda de sugerencia" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="link">Link de sugerencia tienda online</label>
                            <input type="text" value={this.props.regalos.Link && this.props.regalos.Link} className="form-control" disabled={this.state.inputDisabled} onChange={this.handleChangeInput} id="Link" aria-describedby="" placeholder="Ingrese una link de sugerencia" />
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
    handleChangeSelectTipoRegalo() {

        let value = null;

        value = this.props.regalos.tipoRegalo;

        if (value == 0) return;

        if (value == this.state.valueRegaloDinero) {
            return this.mostrarFormDinero()
        }

        if (value == this.state.valueRegaloObjeto) {
            return this.mostrarFormObjeto()
        }

    }


    render() {

        const { match: { params: { id } } } = this.props

        console.log(this.props);

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
                                    {this.buttonsFooter()}
                                    <Link to={`/regalos/show/${id}`}><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
                                </div>
                            </div>
                        </form>
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
    handleInputBanco,
    handleInputCuentaCuil,
    handleInputCbu,
    handleInputPathImg,
    handleInputObjeto,
    handleInputSKU,
    handleInputTiendaSugerida,
    handleInputLink,
    handleInputTipoRegalo,
    handleInputTipoRegaloDinero,
    guardarRegalo,
    limpiarForm
}
export default connect(mapStateToProps, mapDispatchToProps)(Guardar)