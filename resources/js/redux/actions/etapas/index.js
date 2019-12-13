import {
    TRAER_ETAPAS,
    GUARDAR_ETAPA,
    VALUE_ETAPA_NOMBRE,
    VALUE_ETAPA_HORA,
    VALUE_ETAPA_FECHA,
    ERROR,
    CARGANDO,
    CARGANDO_GUARDAR,
    LIMPIAR_FORM
} from './types'
import { TRAER_EVENTOS } from '../eventos/types'
import axios from "axios";

export const traerEtapas = (idEvento, key) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { etapas } = getState().etapas;
    const { eventos } = getState().eventos;

    dispatch({
        type: CARGANDO
    })
    try {
        const data = await axios.get(`api/etapas/evento/${idEvento}`,
            {
                headers: { Authorization: apiToken }
            }
        );
        if (data.data.error) {
            dispatch({
                type: ERROR,
                payload: data.data.error
            })
        }
        const resp = data.data.etapas
        const nuevasEtapas = resp.map((etapa) => ({
            ...etapa
        }))

        const etapacAct = [
            ...etapas,
            nuevasEtapas

        ]

        const etapa_key = etapacAct.length - 1;

        const eventosAct = [...eventos]

        //le pongo el key de la etapa al evento
        eventosAct[key] = {
            ...eventos[key],
            etapa_key
        }
        dispatch({
            type: TRAER_ETAPAS,
            payload: etapacAct
        })
        dispatch({
            type: TRAER_EVENTOS,
            payload: eventosAct
        })

    } catch (error) {
        dispatch({
            type: ERROR,
            payload: error
        })
    }
}
export const guardarEtapa = (etapa, idEvento, keyEtapa, edit, keyItem, idEtapa) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { etapas } = getState().etapas;

    let url = null

    if (!edit) {
        url = `api/etapas/add/${idEvento}`
    } else {
        url = `api/etapas/edit/${idEtapa}`
    }

    dispatch({
        type: CARGANDO_GUARDAR
    })
    try {
        const data = await axios.post(url, etapa,
            {
                headers: { Authorization: apiToken }
            }
        );

        const resp = data.data.etapa

        if (data.data.error) {
            dispatch({
                type: ERROR,
                payload: data.data.error
            })
        }
        let etapasAct = []
        if (!edit) {


            const etapasOld = [...etapas]

            etapasAct = [
                ...etapasOld
            ]
            etapasAct[keyEtapa].push(resp)

        } else {
            const etapasOld = [...etapas]

            etapasOld[keyEtapa].splice(keyItem, 1)

            etapasAct = [
                ...etapasOld,
            ]
            etapasAct[keyEtapa].push(resp)//hacemos push a la etapa del evento que corresponde
        }

        dispatch({
            type: GUARDAR_ETAPA
        })

        dispatch({
            type: TRAER_ETAPAS,
            payload: etapasAct
        })
    } catch (error) {
        dispatch({
            type: ERROR,
            payload: error
        })
    }
}

export const handleInputNombreEtapa = (value) => (dispatch) => {
    dispatch({
        type: VALUE_ETAPA_NOMBRE,
        payload: value
    })
}
export const handleInputHoraEtapa = (value) => (dispatch) => {
    dispatch({
        type: VALUE_ETAPA_HORA,
        payload: value
    })
}
export const handleInputFechaEtapa = (value) => (dispatch) => {
    dispatch({
        type: VALUE_ETAPA_FECHA,
        payload: value
    })
}
export const borrarEtapa = (id, key, keyItem) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { etapas } = getState().etapas;
    try {
        axios.delete(`api/etapas/delete/${id}`, {
            headers: { Authorization: apiToken }
        })

        const etapasAct = [...etapas]

        etapasAct[key].splice(keyItem, 1)


        dispatch({
            type: TRAER_ETAPAS,
            payload: etapasAct
        })

    } catch (error) {
        // console.log(error);
        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal.'
        })
    }
}

export const etapasMenu = (idEtapa, keyEtapaEvento, keyEtapaItem) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { etapas } = getState().etapas;

    try {
        const data = await axios.get(`api/menu/${idEtapa}`,
            {
                headers: { Authorization: apiToken }
            }
        );
        const resp = data.data.menu
        if (data.data.error) {
            dispatch({
                type: ERROR,
                payload: data.data.error
            })
        }

        let etapasAct = [...etapas]

        etapasAct[keyEtapaEvento][keyEtapaItem] = {
            ...etapasAct[keyEtapaEvento][keyEtapaItem],
            menu: [...resp]
        }

        dispatch({
            type: TRAER_ETAPAS,
            payload: etapasAct
        })
    } catch (error) {
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
