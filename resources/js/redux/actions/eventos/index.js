
import {
    TRAER_EVENTOS,
    CARGANDO,
    ERROR
} from './types'
import axios from "axios";

export const traerEventos = () => async (dispatch) => {
    const apiToken = localStorage.getItem("api_token");
    const permisoUsuario = JSON.parse(localStorage.getItem("permisosUsuario"));
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const rol = permisoUsuario.nombre;
console.log(usuario);

    let id = null;

    if (rol == "ADMINISTRADOR") {
        id = usuario._id;
    } else if (rol == "EMPRESA") {
        id = usuario.Empresa_id;
    } else {
        id = usuario.Evento_id;
    }
    dispatch({
        type: CARGANDO
    })
    try {

        const data = await axios.post("api/biblioteca", {
            rol,
            id
        }, {
            headers: {
                Authorization: apiToken
            }
        })
        
        dispatch({
            type: TRAER_EVENTOS,
            payload: data.data
        })

    } catch (error) {
       
        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal al treaer los eventos'
        })

    }

};


export const traerEventosRegalos = () => async (dispatch, getState) => {
    const { eventos } = getState().eventos;
    const apiToken = localStorage.getItem("api_token");
    const permisoUsuario = JSON.parse(localStorage.getItem("permisosUsuario"));
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const rol = permisoUsuario.nombre;
    
    let id = null;
    if (permisoUsuario.nombre == "ADMINISTRADOR") {
        id = usuario._id;
    } else if (permisoUsuario.nombre == "EMPRESA") {
        id = usuario.Empresa_id;
    } else {
        id = usuario.Evento_id;
    }
    dispatch({
        type: CARGANDO
    })


    try {
        const data = await axios
            .post(
                "api/regalos/get-info",
                {
                    empresa: "",
                    rol,
                    id
                },
                {
                    headers: { Authorization: apiToken }
                }
            )

        const resp = data.data.data
        
        const eventosActualizados = resp.map((e, key) => ({
            ...eventos[key],
            ...e
        }))

        dispatch({
            type: TRAER_EVENTOS,
            payload: eventosActualizados
        })
    } catch (error) {
    //    console.log('error',error);
        dispatch({
            type: ERROR,
            payload: 'Algo ha salido mal al treaer los eventos'
        })
    }
}


