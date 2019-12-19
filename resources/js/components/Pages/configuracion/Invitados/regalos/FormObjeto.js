
import React, { Fragment } from 'react'

import './index.css'

export default function FormObjeto(props) {

    const  {
        PathImg,
        Objeto,
        SKU,
        TiendaSugerida,
        Link,
        url,
        refImg
    } = props.inputsObjeto

    const { disabled } = props
    return (
        <Fragment>
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-5 text-center" id="contenedor_imagen_objeto">
                    <img src={PathImg ? `${url}/storage/${PathImg}` : `${url}/images/example.png`} className="mr-4" id="fotoTagImg" alt="foto objeto" />
                    <input type="file" ref={refImg} id="fotoObjeto" disabled={disabled} name="fotoObjeto" onChange={props.changeFn} />
                </div>

                <div className="col-sm-12 col-md-12 col-lg-7 p-3">
                    <div className="form-group">
                        <label htmlFor="objeto">Nombre del objeto / Nombre del servicio</label>
                        <input type="text" value={Objeto && Objeto} disabled={disabled}  className="form-control"  onChange={props.changeFn} id="Objeto" aria-describedby="objetoHelp" placeholder="Ingrese nombre del regalo o servicio" />
                        {/* <small id="objetoHelp" className="form-text text-muted">Nombre descriptivo del objeto</small> */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="objeto">SKU</label>
                        <input type="text" value={SKU && SKU} className="form-control" disabled={disabled}  onChange={props.changeFn} id="SKU" aria-describedby="" placeholder="Ingrese código SKU" />
                        {/* <small id="objetoHelp" className="form-text text-muted">Nombre descriptivo del objeto</small> */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="tienda">Tienda sugerida</label>
                        <input type="text" value={TiendaSugerida && TiendaSugerida} disabled={disabled}  className="form-control" onChange={props.changeFn} id="TiendaSugerida" aria-describedby="" placeholder="Ingrese una tienda de sugerencia" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="link">Link de sugerencia tienda online</label>
                        <input type="text" value={Link && Link} className="form-control" disabled={disabled}  onChange={props.changeFn} id="Link" aria-describedby="" placeholder="Ingrese una link de sugerencia" />
                    </div>
                </div>
            </div>
        </Fragment>
    )

}
