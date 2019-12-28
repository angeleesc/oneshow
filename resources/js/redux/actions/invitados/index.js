import { TRAER_INVITADOS, ERROR, CARGANDO, CHECKIN, CHECKINQR } from "./types";

import axios from "axios";

export const traerInvitados = () => async (dispatch, getState) => {
    const apiToken = localStorage.getItem("api_token");
    const permisoUsuario = JSON.parse(localStorage.getItem("permisosUsuario"));
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const rol = permisoUsuario.nombre;
    const { invitados } = getState().invitados;

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
    });

    try {
        const data = await axios.post(
            `api/invitados/all`,
            { id, rol },
            {
                headers: { Authorization: apiToken }
            }
        );

        const resp = data.data.invitados;

        const nuevosInvitados = resp.map(invitado => ({
            ...invitado
        }));

        //lo coloco junto un array con lo invitados que estaba en el reducer
        const invitadoAct = [...invitados, nuevosInvitados];

        dispatch({
            type: TRAER_INVITADOS,
            payload: invitadoAct
        });
    } catch (error) {
        dispatch({
            type: ERROR,
            payload: "Algo ha salido mal al treaer los regalos"
        });
    }
};

export const checkIn = (idInvitado, idEvento, out = null) => async dispatch => {
    const apiToken = localStorage.getItem("api_token");
    const permisoUsuario = JSON.parse(localStorage.getItem("permisosUsuario"));
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const rol = permisoUsuario.nombre;
    dispatch({
        type: CARGANDO
    });

    let id = null;

    if (rol == "ADMINISTRADOR") {
        id = usuario._id;
    } else if (rol == "EMPRESA") {
        id = usuario.Empresa_id;
    } else {
        id = usuario.Evento_id;
    }

    try {
        const data = await axios.post(
            `api/invitados/checkin/${idInvitado}/${idEvento}`,
            { id, rol, out },
            {
                headers: { Authorization: apiToken }
            }
        );

        if (data.data.error) {
            dispatch({
                type: ERROR,
                payload: data.data.error
            });

            return;
        }
        const resp = [data.data.invitados];

        dispatch({
            type: CHECKIN
        });

        dispatch({
            type: TRAER_INVITADOS,
            payload: resp
        });
    } catch (error) {
        dispatch({
            type: ERROR,
            payload: "Algo ha salido mal"
        });
    }
};

export const checkInQr = (id, idEvento) => async dispatch => {
    const apiToken = localStorage.getItem("api_token");

    dispatch({
        type: CARGANDO
    });

    try {
        const data = await axios.get(
            `api/invitados/checkinQr/${id}/${idEvento}`,
            {
                headers: { Authorization: apiToken }
            }
        );

        if (data.data.error) {
            dispatch({
                type: ERROR,
                payload: data.data.error
            });

            return;
        }

        dispatch({
            type: CHECKINQR
        });
    } catch (error) {
        dispatch({
            type: ERROR,
            payload: "Algo ha salido mal"
        });
    }
};

export const orderApellido = order => (dispatch, getState) => {
    const { invitados } = getState().invitados;

    let orderInvitados = null;
    if (!order) {
        orderInvitados = invitados[0].sort(function(a, b) {
            if (a.Apellido > b.Apellido) {
                return 1;
            }
            if (a.Apellido < b.Apellido) {
                return -1;
            }
            return 0;
        });
    } else {
        orderInvitados = invitados[0].sort(function(a, b) {
            if (a.Apellido < b.Apellido) {
                return 1;
            }
            if (a.Apellido > b.Apellido) {
                return -1;
            }
            return 0;
        });
    }

    dispatch({
        type: TRAER_INVITADOS,
        payload: [orderInvitados]
    });
};

export const orderNombre = order => (dispatch, getState) => {
    const { invitados } = getState().invitados;

    let orderInvitados = null;
    if (!order) {
        orderInvitados = invitados[0].sort(function(a, b) {
            if (a.Nombre > b.Nombre) {
                return 1;
            }
            if (a.Nombre < b.Nombre) {
                return -1;
            }
            return 0;
        });
    } else {
        orderInvitados = invitados[0].sort(function(a, b) {
            if (a.Nombre < b.Nombre) {
                return 1;
            }
            if (a.Nombre > b.Nombre) {
                return -1;
            }
            return 0;
        });
    }

    dispatch({
        type: TRAER_INVITADOS,
        payload: [orderInvitados]
    });
};
