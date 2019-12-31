import {
    TRAER_INVITADOS,
    ERROR,
    CARGANDO,
    CHECKIN,
    CHECKINQR
} from "../../actions/invitados/types";

const INITIAL_STATE = {
    invitados: [],
    cargando: false,
    error: false,
    regresar: false
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case TRAER_INVITADOS:
            return {
                ...state,
                invitados: action.payload,
                cargando: false,
                error: "",
                regresar: false
            };

        case CARGANDO:
            return { ...state, cargando: true, error: "", regresar: false };

        case ERROR:
            return {
                ...state,
                error: action.payload,
                cargando: false,
                cargando_guardar: false
            };

        case CHECKIN:
            return {
                ...state,
                error: "",
                cargando: false
            };

        case CHECKINQR:
            return {
                ...state,
                invitados: [],
                error: "",
                cargando: false,
                regresar: true
            };
        default:
            return state;
    }
}
