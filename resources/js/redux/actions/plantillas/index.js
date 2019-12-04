
import { TRAER_TODAS, AGREGAR_PLANTILLA_EVENTO, CARGANDO, ERROR } from './types'
import axios from "axios";
export const traerPlantillas = (token) => async (dispatch) => {
    try {
        const data = await fetch('/api/plantillas', {
            headers: {
                Authorization: token,                
            }
        });
        const resp = await data.json()

        
        dispatch({
            type: TRAER_TODAS,
            payload: resp
        })
    }
    catch (error) {
        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal.'
        })
    }
};


export const agregarPlantillaEvento = (newPlantilla) => async (dispatch) => {

    const apiToken = localStorage.getItem("api_token");

    dispatch({
        type: CARGANDO
    });

    try {
        const data = await axios.post("api/invitaciones/plantilla", newPlantilla, {
            headers: {
                Authorization: apiToken
            }
        })
        
        dispatch({
            type: AGREGAR_PLANTILLA_EVENTO
        })
    } catch (error) {
        console.log("errorAxio", error);
        
        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal.'
        });
    }

}
