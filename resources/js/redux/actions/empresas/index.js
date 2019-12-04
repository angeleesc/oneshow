
import { TRAER_EMPRESAS, CARGANDO, ERROR } from './types'
import axios from "axios";

export const traerEmpresas = () => async (dispatch) => {
    const apiToken = localStorage.getItem("api_token");
    dispatch({
        type: CARGANDO
    })
    try {

        const data = await axios.get("api/empresas", {
            headers: { Authorization: apiToken }
        })

        dispatch({
            type: TRAER_EMPRESAS,
            payload: data.data.empresas
        })

    } catch (error) {
        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal al treaer las empresas'
        })

    }


};


