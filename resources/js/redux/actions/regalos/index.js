
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
    ERROR,
    LIMPIAR_FORM
} from './types'
import axios from "axios";


export const traerRegalosEventosID = (idEvento) => async (dispatch) => {
    const apiToken = localStorage.getItem("api_token");
    dispatch({
        type: CARGANDO
    })
    try {

        const data = await axios.get(`api/regalos/get-regalo/${idEvento}`, {
            headers: { Authorization: apiToken }
        })

        const resp = data.data.regalos;
        
        dispatch({
            type: TRAER_REGALOS,
            payload: resp
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
export const guardarRegalo = (regalo, editEvento, idRegalo) => async (dispatch) => {
    const apiToken = localStorage.getItem("api_token");
    dispatch({
        type: CARGANDO
    })

    let url = null;

    
    if (regalo.TipoRegalo) {
        url = `api/regalos/add/${editEvento}/${idRegalo}`
    } else {
        url = `api/regalos/addObjeto/${editEvento}`
    }

    try {
        const result = await axios.post(url, regalo, {
            headers: { Authorization: apiToken }
        })

        dispatch({
            type: AGREGAR_REGALOS_EVENTO,
            payload: result
        })
    } catch (error) {
        
        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal'
        })
    }

}

export const borrarRegalo = (id) => async (dispatch) => {
    const apiToken = localStorage.getItem("api_token");
    try {
        axios.delete(`api/regalos/delete/${id}`, {
            headers: { Authorization: apiToken }
        })

        dispatch({
            type:TRAER_REGALOS,
            payload: {}
        })
    } catch (error) {
        dispatch({
            type:ERROR,
            payload: 'Algo ha salido mal.'
        })
    }
}

export const limpiarForm = () => (dispatch) =>{

    dispatch({
        type: LIMPIAR_FORM
    })
}