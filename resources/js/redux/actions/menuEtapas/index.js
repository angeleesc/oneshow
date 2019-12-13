import {
    TRAER_MENU_ETAPAS,
    GUARDAR_MENU_ETAPA,
    VALUE_MENU_ETAPA_TITULO,
    VALUE_MENU_ETAPA_DESCRIPCION,
    ERROR,
    CARGANDO,
    CARGANDO_GUARDAR,
    LIMPIAR_FORM
} from './types'

import { TRAER_ETAPAS } from '../etapas/types'

/**
 * 
 * @param {*} idEtapa 
 * @param {*} key 
 * @param {*} keyItemEtapa 
 */
export const traerMenuEtapas = (idEtapa, key, keyItemEtapa) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { menuEtapas } = getState().menuEtapas;
    const { etapas } = getState().etapas;
    dispatch({
        type: CARGANDO
    })
    try {
        const data = await axios.get(`api/menu/${idEtapa}`,
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
        const resp = data.data.menu

        const nuevosMenuEtapas = resp.map((menuE) => ({
            ...menuE
        }))

        const menuEtapacAct = [
            ...menuEtapas,
            nuevosMenuEtapas

        ]

        const menuEtapa_key = menuEtapacAct.length - 1;
        const etapasAct = [...etapas]

        //le pongo el key del menuEtapa  a la etapa
        etapasAct[key][keyItemEtapa] = {
            ...etapas[key][keyItemEtapa],
            menuEtapa_key
        }

        dispatch({
            type: TRAER_MENU_ETAPAS,
            payload: menuEtapacAct
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

export const handleInputTituloMenuEtapa = (value) => (dispatch) => {
    dispatch({
        type: VALUE_MENU_ETAPA_TITULO,
        payload: value
    })
}
export const handleInputDescripcionMenuEtapa = (value) => (dispatch) => {
    dispatch({
        type: VALUE_MENU_ETAPA_DESCRIPCION,
        payload: value
    })
}

/**
 * 
 * @param {Object} menuEtapa nuevo menu para la etapa
 * @param {IDBDatabase} idEtapa id de la etapa
 * @param {IDBArrayKey} keyMenuEtapa menuEtapa_key | key del menu de la etapa dentro del array de etapa en el reducer
 * @param {*} keyItemEtapa 
 */
export const guardarMenuEtapa = (menuEtapa, idEtapa, keyMenuEtapa, keyItemIndex, edit, idMenu) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { menuEtapas } = getState().menuEtapas;

    let url = null

    if (!edit) {
        url = `api/menu/add/${idEtapa}`
    } else {
        url = `api/menu/edit/${idMenu}`
    }

    dispatch({
        type: CARGANDO_GUARDAR
    })
    try {
        const data = await axios.post(url, menuEtapa,
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

        let menuEtapasAct = []
        if (!edit) {
            const menuEtapasOld = [...menuEtapas]

            menuEtapasAct = [
                ...menuEtapasOld
            ]

            menuEtapasAct[keyMenuEtapa].push(resp)

        } else {
            const menuEtapasOld = [...menuEtapas]


            menuEtapasOld[keyMenuEtapa].splice(keyItemIndex, 1)

            menuEtapasOld[keyMenuEtapa].push(resp)

            menuEtapasAct = [
                ...menuEtapasOld
            ]

        }

        dispatch({
            type: GUARDAR_MENU_ETAPA
        })

        dispatch({
            type: TRAER_MENU_ETAPAS,
            payload: menuEtapasAct
        })
    } catch (error) {
        dispatch({
            type: ERROR,
            payload: error
        })
    }
}
export const borrarMenuEtapa = (idMenu, keyMenuEtapa, keyItemIndex) => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const { menuEtapas } = getState().menuEtapas;
    try {
        axios.post(`api/menu/eliminar/${idMenu}`, {
            headers: { Authorization: apiToken }
        })

        const menuEtapasOld = [...menuEtapas]


        menuEtapasOld[keyMenuEtapa].splice(keyItemIndex, 1)

        menuEtapasAct = [
            ...menuEtapasOld
        ]

        dispatch({
            type: TRAER_MENU_ETAPAS,
            payload: menuEtapasAct
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