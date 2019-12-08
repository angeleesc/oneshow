
import {
    TRAER_REGALOS,
    AGREGAR_REGALOS_EVENTO,
    VALUE_BANCO,
    VALUE_CUIL,
    VALUE_CBU,
    VALUE_PATH_IMG,
    VALUE_OBJETO,
    VALUE_SKU,
    VALUE_TIENDA,
    VALUE_LINK,
    VALUE_TIPO_DINERO_REGALO,
    TIPO_REGALO,
    CARGANDO,
    CARGANDO_GUARDAR,
    ERROR,
    LIMPIAR_FORM
} from './types'

import { TRAER_EVENTOS } from '../eventos/types'
import axios from "axios";


export const traerRegalosEventosID = (idEvento, key) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { regalos } = getState().regalos;
    const { eventos } = getState().eventos;

    dispatch({
        type: CARGANDO
    })


    try {

        const data = await axios.get(`api/regalos/get-regalo/${idEvento}`, {
            headers: { Authorization: apiToken }
        })

        const resp = data.data.regalos;

        //busco los regalos del evento que se activo
        const nuevosRegalos = resp.map((regalo) => ({
            ...regalo
        }))

        //lo coloco junto un array con lo regalos que estaba en el reducer
        const regalosAct = [
            ...regalos,
            nuevosRegalos
        ]
        const regalos_key = regalosAct.length - 1;

        const eventosAct = [...eventos]

        //le pongo el key del regalo al evento
        eventosAct[key] = {
            ...eventos[key],
            regalos_key
        }

        dispatch({
            type: TRAER_REGALOS,
            payload: regalosAct
        })
        dispatch({
            type: TRAER_EVENTOS,
            payload: eventosAct
        })

    } catch (error) {

        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal al treaer los regalos'
        })

    }
};


export const handleInputTipoRegalo = (value) => (dispatch) => {
    dispatch({
        type: TIPO_REGALO,
        payload: value
    })
}

export const handleInputBanco = (value) => (dispatch) => {
    dispatch({
        type: VALUE_BANCO,
        payload: value
    })
}

export const handleInputCuentaCuil = (value) => (dispatch) => {
    dispatch({
        type: VALUE_CUIL,
        payload: value
    })
}
export const handleInputCbu = (value) => (dispatch) => {
    dispatch({
        type: VALUE_CBU,
        payload: value
    })
}
export const handleInputPathImg = (value) => (dispatch) => {
    dispatch({
        type: VALUE_PATH_IMG,
        payload: value
    })
}
export const handleInputObjeto = (value) => (dispatch) => {
    dispatch({
        type: VALUE_OBJETO,
        payload: value
    })
}
export const handleInputSKU = (value) => (dispatch) => {
    dispatch({
        type: VALUE_SKU,
        payload: value
    })
}
export const handleInputTiendaSugerida = (value) => (dispatch) => {
    dispatch({
        type: VALUE_TIENDA,
        payload: value
    })
}
export const handleInputLink = (value) => (dispatch) => {
    dispatch({
        type: VALUE_LINK,
        payload: value
    })
}
export const handleInputTipoRegaloDinero = (value) => (dispatch) => {
    dispatch({
        type: VALUE_TIPO_DINERO_REGALO,
        payload: value
    })
}
/**
 * 
 * @param {Object} regalo  objeto del regalo
 * @param {IDBDatabase} editEvento _id del evento
 * @param {IDBDatabase} idRegalo  _id del regalo en caso que se vaya a editar
 * @param {IDBArrayKey} keyRegalo [] => key de los regalos que identifica el array dentro del reducer de regalos
 * @param {IDBArrayKey} keyItem key del item que se esta editando
 */ 
export const guardarRegalo = (regalo, editEvento, idRegalo, keyRegalo, edit, keyItem) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { regalos } = getState().regalos;
    dispatch({
        type: CARGANDO_GUARDAR
    })

    let url = null;
    
    if (regalo.TipoRegalo) {
        
        url = `api/regalos/add/${editEvento}/${idRegalo}`
    } else {
        url = `api/regalos/addObjeto/${editEvento}/${idRegalo}`
    }

    try {
        const result = await axios.post(url, regalo, {
            headers: { Authorization: apiToken }
        })
        const newRegalo = result.data.regalo
        
        let regalosAct = []
        if (!edit) {

            const regalosOld = [...regalos]

            regalosAct = [
                ...regalosOld[keyRegalo]
            ]

            regalosAct.push(newRegalo)

        } else {

            const regalosOld = [...regalos]

            regalosOld[keyRegalo].splice(keyItem, 1)

            regalosAct = [
                ...regalosOld[keyRegalo]
            ]
            regalosAct.push(newRegalo)

        }

        dispatch({
            type: AGREGAR_REGALOS_EVENTO,
        })

        dispatch({
            type: TRAER_REGALOS,
            payload: [regalosAct]
        })
    } catch (error) {

        console.log(error);

        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal'
        })
    }

}

export const borrarRegalo = (id, key, keyItem, keyEvento) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { regalos } = getState().regalos;
    const { eventos } = getState().eventos;
    try {
        axios.delete(`api/regalos/delete/${id}`, {
            headers: { Authorization: apiToken }
        })

        const nuevosEventos = [...eventos]
        nuevosEventos[keyEvento] = {
            ...nuevosEventos[keyEvento],
            Regalos: regalos[key].length - 1
        }
        const regalosAct = [...regalos]

        regalosAct[key].splice(keyItem, 1)


        dispatch({
            type: TRAER_REGALOS,
            payload: regalosAct
        })
        dispatch({
            type: TRAER_EVENTOS,
            payload: nuevosEventos
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