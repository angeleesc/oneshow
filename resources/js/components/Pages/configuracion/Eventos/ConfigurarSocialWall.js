import axios from 'axios';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Checkbox from "../../../molecules/Checkbox";

const ConfigurarSocialWall = forwardRef((props, ref) => {

    const [cargandoIframe, setCargandoIframe] = useState(true);
    const [urlIframe , setUrlIframe] = useState(window.location.protocol + "//" + window.location.hostname + "/Lib");
    const [moderarContenido , setModerarContenido] = useState(true);

    /**
     * Colocar url en atributo src de iframe
     * 
     * @return {void}
     */
    useEffect(() => {
        document.getElementById('iFrameSocialWall').setAttribute("src", obtenerUrlConParametros());
    })

    /**
     * Obtener URL de la libreria con los datos de configuracion
     * 
     * @return {string}
     */
    function obtenerUrlConParametros() {
        return urlIframe + "?hashtagsInstagram=" + encodeURIComponent(
            JSON.stringify(
                ['violin']
            )
        ) +
        "&eventoId=" + props.eventoId +
        "&cantidadDeResultados=1" +
        "&tema=" + document.getElementsByName('tema')[0].value +
        "&presentacion=" + document.getElementsByName('presentacion')[0].value;
    }

    /**
     * Consultar configuraciones del Social Wall
     * 
     * @return {void}
     */
    useEffect(() => {
        consultarConfiguraciones();
    }, [props.eventoId])

    /**
     * Consultar configuraciones
     * 
     * @return {void}
     */
    function consultarConfiguraciones() {
        axios.get('api/eventos/social-wall/configuracion/' + props.eventoId, {
            headers: {
                Authorization: localStorage.getItem("api_token")
            }
        })
        .then((respuesta) => {
            if (respuesta.data.ver) {
                document.getElementsByName('tema')[0].value = respuesta.data.preferencias.tema;
                document.getElementsByName('presentacion')[0].value = respuesta.data.preferencias.presentacion;
                setModerarContenido(respuesta.data.preferencias.moderarContenido);
            }
        });
    }

    useImperativeHandle(ref, () => ({
        enviarConfiguracion: () => {
            let datosDelFormulario = new FormData();
            datosDelFormulario.append("eventoId", props.eventoId);
            datosDelFormulario.append("preferencias",  {
                tema: document.getElementsByName('tema')[0].value,
                presentacion: document.getElementsByName('presentacion')[0].value,
                moderarContenido
            });
    
            axios.post('api/eventos/social-wall/configuracion', datosDelFormulario, {
                headers: {
                    Authorization: localStorage.getItem("api_token")
                }
            });
        }
    }));

    return (
        <div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group row">
                        <label className="col-sm-4 col-form-label col-form-label-sm">Tema</label>
                        <div className="col-sm-6">
                            <select name="tema" className="form-control form-control-sm">
                                <option value="sb-default-light">Default light</option>
                                <option value="sb-modern-light">Modern Light</option>
                                <option value="sb-modern2-light">Modern Light 2</option>
                                <option value="sb-metro-dark">Metro Dark</option>
                                <option value="sb-flat-light">Flat Light</option>
                                <option value="sb-modern-dark">Modern Dark</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-4 col-form-label col-form-label-sm">Presentación</label>
                        <div className="col-sm-6">
                            <select name="presentacion" className="form-control form-control-sm">
                                <option value="wall">Muro</option>
                                <option value="timeline">Linea de tiempo</option>
                                <option value="feed">Carrusel</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-4 col-form-label col-form-label-sm">Moderar contenido</label>
                        <div className="col-sm-6">
                            <input type="hidden" name="moderarContenido" value="false" />
                            <Checkbox valor={moderarContenido} onChange={() => setModerarContenido(!moderarContenido) }/>
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col-sm-4">
                            <button 
                                type="button"
                                disabled={cargandoIframe}
                                className="btn btn-sm btn-dark"
                                onClick={() => setCargandoIframe(true)}>
                                Probar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="row">
                        { cargandoIframe &&
                            <div className="row">
                                <h4>Cargando vista previa</h4>
                            </div>
                        }
                        <div className="row">
                            <iframe 
                                id="iFrameSocialWall"
                                onLoad={() => setCargandoIframe(false)}
                                style={{ 
                                    width: "inherit", 
                                    border: "none",
                                    visibility: (cargandoIframe) ? 'hidden' : 'visible'
                                }}></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ConfigurarSocialWall;