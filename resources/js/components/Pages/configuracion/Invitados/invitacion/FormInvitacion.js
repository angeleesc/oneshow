
import React, { Fragment } from 'react'
import { Link } from "react-router-dom";
export default function FormInvitacion(props) {
    const { 
        idEvento,
        tipo,
        handleSubmitFormJPGPDFFormJPGPDF,
        imagenRef,
        pdfRef,
        hanldeInput,
        cargandoGuardar
     } = props

    return (
        <form onSubmit={handleSubmitFormJPGPDFFormJPGPDF}>

            <div className="alert alert-primary mb-4" role="alert">
                <i className="fas fa-info-circle"></i>&nbsp;
                    La imagén de la invitación a subir debe tener una resolución de
                <strong>1200x800</strong>, en formato
                <strong>.jpg</strong>o
                <strong>.png</strong>y un peso aproximado entre
                <strong>10KB</strong>y <strong>10MB</strong>.
                <br></br><i className="fas fa-info-circle"></i>&nbsp;&nbsp;El Pdf  debe estar en formato <strong>.pdf</strong> y un peso aproximado entre <strong>10KB</strong> y <strong>10MB</strong>.
            </div>

            <div className="form-group row">
                <label className="col-sm-2 col-form-label col-form-label-sm">Posición Invitación</label>
                <div className="col-sm-5">
                    <select className="form-control form-control-sm" id="tipo" name="tipo" required onChange={hanldeInput}>
                        <option value="">Seleccione</option>
                        <option value="h" >Horizontal</option>
                        <option value="v" >Vertical</option>
                    </select>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label col-form-label-sm">Invitación (Imagen)</label>
                <div className="col-sm-5">
                    <input
                        type="file"
                        id="archivoimg"
                        name="archivoimg"
                        className="form-control-file"
                        ref={imagenRef}
                        onChange={hanldeInput}
                        required
                    />
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label col-form-label-sm">Invitación (PDF)</label>
                <div className="col-sm-5">
                    <input
                        type="file"
                        className="form-control-file"
                        id="archivopdf"
                        name="archivopdf"
                        ref={pdfRef}
                        onChange={hanldeInput}
                    />
                </div>
            </div>
            <div className="form-group row">
                <div className="col-sm-4">
                    <button type="submit" id="save-file" className="btn btn-sm btn-dark mr-2">Guardar {cargandoGuardar && <i className="fa fa-spinner fa-spin" />}</button>
                    <Link to={`/invitacion/show/${idEvento}`}><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
                </div>
            </div>
        </form>
    )

}

