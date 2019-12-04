import {
    TRAER_EVENTOS,
    ERROR,
    CARGANDO

} from '../../actions/eventos/types'

const INITIAL_STATE = {
    eventos: [],
    cargando: false,

};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case TRAER_EVENTOS:
            return {
                ...state,
                eventos: action.payload, cargando: false
            }

        case CARGANDO:
            return { ...state, cargando: true }

        case ERROR:
            return { ...state, error: action.payload, cargando: false }

        default:
            return state;
    }
}

