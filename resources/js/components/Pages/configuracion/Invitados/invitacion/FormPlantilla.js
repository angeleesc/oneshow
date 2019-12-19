
import React, { Fragment } from 'react'
import { Link } from "react-router-dom";
export default function FormPlantilla(props) {
    const {
        idEvento,
        listarP,
        evento,
        selectRef,
        url,
        handleSubmit,
        hanldeInput,
        pdfPlantillaRef
    } = props
    const frame = {
        with: '100%',
        border: 'solid #466a7b 1px',
        height: '100vh',
        padding: '0px'
    }

    async function handlChaneSelectTemplate() {

        const id = selectRef.current.value
        const $contenedorPlantillas = document.querySelector("#contenedor-plantilla");
        if (id !== "0") {
            
            const template = await fetch(`${url}plantillas/${id}/index.html`, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            })
            const result = await template.text();
            
            $contenedorPlantillas.innerHTML = result

            const nombreEvento = document.querySelector('#nombre');
            const anfrition1 = document.querySelector('#anfrition1');
            const fechaMes = document.querySelector('#fecha #fecha-mes');
            const fechaDia = document.querySelector('#fecha #fecha-dia');
            const fechaAnio = document.querySelector('#fecha #fecha-anio');
            const hora = document.querySelector('#hora');
            const dir1 = document.querySelector('#dir1');
            const dir2 = document.querySelector('#dir2');
            const vestimenta = document.querySelector('#vestimenta');
            const fotoAnfitrion1 = document.querySelector('#fotoAnfitrion1');
            const fotoAnfitrion2 = document.querySelector('#fotoAnfitrion2');
            const fotoAnfitrion3 = document.querySelector('#fotoAnfitrion3');

            if (nombreEvento && evento.Evento) {
                nombreEvento.innerHTML = evento.Evento
            }
            if (anfrition1 && evento.Anfitrion1) {
                anfrition1.innerHTML = evento.Anfitrion1
            }
            if (fechaMes && fechaMes && fechaDia && evento.Fecha) {
                fechaMes.innerHTML = evento.Fecha.split(" ")[0].split("/")[0]
                fechaDia.innerHTML = evento.Fecha.split(" ")[0].split("/")[1]
                fechaAnio.innerHTML = evento.Fecha.split(" ")[0].split("/")[2]
            }
            if (hora && evento.Fecha) {
                hora.innerHTML = `${evento.Fecha.split(" ")[1]} ${evento.Fecha.split(" ")[2]}`
            }
            if (dir1 && evento.Dir1 && evento.Dir1 != "null") {
                dir1.innerHTML = evento.Dir1
            }

            if (dir2 && evento.Dir2 && evento.Dir2 != "null") {
                dir2.innerHTML = evento.Dir2
            }
            if (vestimenta && evento.Vestimenta && evento.Vestimenta != "null") {
                vestimenta.innerHTML = ""
            }
            if (fotoAnfitrion1 && evento.FotoAnfitrion1) {
                fotoAnfitrion1.src = evento.FotoAnfitrion1
            }
            if (fotoAnfitrion2 && evento.fotoAnfitrion2) {
                fotoAnfitrion2.src = evento.FotoAnfitrion2
            }
            if (fotoAnfitrion3 && evento.FotoAnfitrion3) {
                fotoAnfitrion3.src = evento.FotoAnfitrion3
            }

        }
    }
    return (
        <Fragment>
            <div className="form-group row  justify-content-md-center">

                <div className="col-md-6">
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label col-form-label-sm">Seleccionar Plantilla</label>
                        <div className="col-sm-5">
                            <select className="form-control form-control-sm" ref={selectRef} onChange={handlChaneSelectTemplate} id="template" name="template">
                                <option value="0">Seleccione</option>
                                {listarP()}
                            </select>

                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label col-form-label-sm">Invitación (PDF)</label>
                        <div className="col-sm-5">
                            <input
                                type="file"
                                className="form-control-file"
                                id="archivoplantillapdf"
                                name="archivoplantillapdf"
                                ref={pdfPlantillaRef}
                                onChange={hanldeInput}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4">
                            <button type="submit" onClick={handleSubmit} id="save-template" className="btn btn-sm btn-dark mr-2">Guardar</button>
                            <Link to={`/invitacion/show/${idEvento}`}><button type="button" className="btn btn-sm btn-dark">Volver</button></Link>
                        </div>
                    </div>

                </div>
                <div className="col-md-4" id="contenedor-plantilla" style={frame}>

                </div>
            </div>
            {/* 
            <div className="row justify-content-md-center">

            </div> */}
        </Fragment >
    )

}

