import {
    TRAER_INVITACIONES,
    CARGANDO,
    CARGANDO_GUARDAR,
    ERROR,
    VALUE_PDF_INVITACION,
    VALUE_IMG_INVITACION,
    VALUE_TIPO_INVITACION,
    VALUE_PLANTILLA_PDF_INVITACION,
    GAURDAR_IMVITACION,
    LIMPIAR_FORM
} from './types'
import { TRAER_EVENTOS } from '../eventos/types'

import axios from "axios";

export const traerInvitacionesEventoID = (idEvento, key) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { invitaciones } = getState().invitaciones;
    const { eventos } = getState().eventos;
    dispatch({
        type: CARGANDO
    })

    try {
        const data = await axios.get(`api/invitaciones/files/${idEvento}`,
            {
                headers: { Authorization: apiToken }
            }
        );

        const resp = data.data.data;


        const nuevasInvitaciones = resp.map((invitacion) => ({
            ...invitacion
        }))

        //lo coloco junto un array con la invitaciones que estaba en el reducer
        const invitacionesAct = [
            ...invitaciones,
            nuevasInvitaciones
        ]

        const invitacion_key = invitacionesAct.length - 1;

        const eventosAct = [...eventos]

        //le pongo el key de la invitacion al evento
        eventosAct[key] = {
            ...eventos[key],
            invitacion_key
        }

        dispatch({
            type: TRAER_INVITACIONES,
            payload: invitacionesAct
        })
        dispatch({
            type: TRAER_EVENTOS,
            payload: eventosAct
        })
    } catch (error) {
        // console.log(error);

        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal al treaer las invitaciones'
        })
    }

}

export const guardarInvitacion = (formData, idEvento, keyEvento, plantillaForm) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { invitaciones } = getState().invitaciones;
    const { eventos } = getState().eventos;
    dispatch({
        type: CARGANDO_GUARDAR
    })
    let url = null
    if (!plantillaForm) {
        url = `api/invitaciones/file/add/${idEvento}`
    } else {
        url = `api/invitaciones/plantilla`
    }
    try {
        const data = await axios.post(url, formData, {
            headers: {
                Authorization: apiToken
            }
        })

        if (data.data.error) {
            dispatch({
                type: ERROR,
                payload: data.data.error
            })

            dispatch({
                type: TRAER_INVITACIONES,
                payload: invitaciones
            })

            return
        }

        let invitacionesAct = []
        const invitacionesOld = [...invitaciones]

        invitacionesAct = [
            ...invitacionesOld
        ]


        invitacionesAct[keyEvento].push(data.data.invitacion)
        dispatch({
            type: GAURDAR_IMVITACION,
        })
        dispatch({
            type: TRAER_INVITACIONES,
            payload: invitacionesAct
        })

    } catch (error) {
        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal'
        })

    }

}

export const handleInputImagenInvitacion = (value) => (dispatch) => {
    dispatch({
        type: VALUE_IMG_INVITACION,
        payload: value
    })
}
export const handleInputPdfInvitacion = (value) => (dispatch) => {
    dispatch({
        type: VALUE_PDF_INVITACION,
        payload: value
    })
}

export const handleInputTipoInvitacion = (value) => (dispatch) => {
    dispatch({
        type: VALUE_TIPO_INVITACION,
        payload: value
    })
}
export const handleInputPlantillaPdfInvitacion = (value) => (dispatch) => {
    dispatch({
        type: VALUE_PLANTILLA_PDF_INVITACION,
        payload: value
    })
}

export const borrarInvitacion = (id, keyEvento) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { invitaciones } = getState().invitaciones;
    try {

        axios.post(`api/invitaciones/file/delete`, { id }, {
            headers: { Authorization: apiToken }
        })


        let invitacionesAct = []
        const invitacionesOld = [...invitaciones]

        invitacionesOld[keyEvento].splice(0, 1)

        invitacionesAct = [
            ...invitacionesOld
        ]

        dispatch({
            type: TRAER_INVITACIONES,
            payload: invitacionesAct
        })

    } catch (error) {
        // console.log(error);
        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal.'
        })
    }
}

export const limpiarForm = () => (dispatch) => {

    dispatch({
        type: LIMPIAR_FORM
    })
}