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
} from '../../actions/etapas/types'


const INITIAL_STATE = {
    etapas: [],
    etapaNombre: "",
    etapaHora: "",
    etapaFecha: "",
    cargando: false,
    error: false,
    cargando_guardar: false

}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case TRAER_ETAPAS:
            return {
                ...state,
                etapas: action.payload, cargando: false, error: false, regresar: false
            }

        case GUARDAR_ETAPA:
            return {
                ...state,
                etapaNombre: "",
                etapaFecha: "",
                etapaHora: "",
                cargando: false,
                cargando_guardar: false,
                error: "",
                regresar: true
            }

        case VALUE_ETAPA_NOMBRE: {
            return { ...state, etapaNombre: action.payload }
        }
        case VALUE_ETAPA_HORA: {
            return { ...state, etapaHora: action.payload }
        }
        case VALUE_ETAPA_FECHA: {
            return { ...state, etapaFecha: action.payload }
        }

        case CARGANDO:
            return { ...state, cargando: true }

        case CARGANDO_GUARDAR:
            return { ...state, cargando_guardar: true }

        case ERROR:
            return { ...state, error: action.payload, cargando: false, cargando_guardar: false }

        case LIMPIAR_FORM: 
            return {
                ...state, 
                etapaNombre: "",
                etapaFecha: "",
                etapaHora: ""

            }    
        default:
            return state;
    }
}