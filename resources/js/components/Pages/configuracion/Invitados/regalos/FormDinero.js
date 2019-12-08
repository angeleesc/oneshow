import React, { Fragment } from 'react'

function formTransferencia(props) {
    const {Banco,CUIL,CBU } = props.inputstransferencia
    const { disabled } = props

    if (props.OpcionDinero == 'TRANSFERENCIA') {

        return (
            <div>
                <div className="row form-group">
                    <div className="col-sm-6 col-md-3 offset-md-6">
                        <label>Nombre Banco</label>
                    </div>
                    <div className="col-sm-6 col-md-3 offset-md-6">
                        <input type="text" className="form-control form-control-sm" value={Banco && Banco}  onChange={props.changeFn} id="Banco" name="Banco" disabled={disabled} placeholder="Ingrese el nombre del Banco" />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-sm-6 col-md-3 offset-md-6">
                        <label>CUIL</label>
                    </div>
                    <div className="col-sm-6 col-md-3 offset-md-6">
                        <input type="text" className="form-control form-control-sm" value={CUIL && CUIL} id="CUIL" onChange={props.changeFn} name="CUIL" disabled={disabled} placeholder="Ingrese código CUIL" />
                    </div>
                </div>
                <div className="row form-group ">
                    <div className="col-sm-6 col-md-3 offset-md-6">
                        <label>CBU</label>
                    </div>
                    <div className="col-sm-6 col-md-3 offset-md-6">
                        <input type="text" className="form-control form-control-sm" value={CBU && CBU} id="CBU" onChange={props.changeFn} name="CBU" disabled={disabled} placeholder="Ingrese código CBU" />
                    </div>
                </div>
            </div>
        )
    }
}

export default function FormDinero(props) {
    const {
        inputTransferenciaDisabled,
        inputTransferenciaChecked,
        inputEfectivoDisabled,
        inputEfectivoChecked
    } = props.inputChecked
    return (
        <Fragment>
            <div className="row">
                <div className="col-xs-3 p-3 col-md-3 text-center">
                    <input type="radio" id="tipo-efectivo" disabled={inputTransferenciaDisabled} checked={inputEfectivoChecked}  onChange={props.changeFn} value="EFECTIVO" name="tipo-dinero" className="custom-control-input" />
                    <label className="custom-control-label" htmlFor="tipo-efectivo" > Efectivo</label>
                </div>
                <div className="col-xs-3 p-3 col-md-3 text-center">
                    <input type="radio" id="tipo-transfrencia" disabled={inputEfectivoDisabled}  checked={inputTransferenciaChecked} onChange={props.changeFn} value="TRANSFERENCIA" name="tipo-dinero" className="custom-control-input" />
                    <label className="custom-control-label" htmlFor="tipo-transfrencia" > Transfrencia</label>
                </div>
            </div>
            {formTransferencia(props)}
        </Fragment>
    )
}
