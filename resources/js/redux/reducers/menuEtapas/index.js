import {
    TRAER_MENU_ETAPAS,
    GUARDAR_MENU_ETAPA,
    VALUE_MENU_ETAPA_TITULO,
    VALUE_MENU_ETAPA_DESCRIPCION,
    ERROR,
    CARGANDO,
    CARGANDO_GUARDAR,
    LIMPIAR_FORM
} from '../../actions/menuEtapas/types'


const INITIAL_STATE = {
    menuEtapas: [],
    titulo: "",
    descripcion: "",
    cargando: false,
    error: false,
    cargando_guardar: false,
    regresar: false

}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case TRAER_MENU_ETAPAS:
            return {
                ...state,
                menuEtapas: action.payload, cargando: false, error: false, regresar: false
            }

        case GUARDAR_MENU_ETAPA:
            return {
                ...state,
                titulo: "",
                descripcion: "",
                cargando: false,
                cargando_guardar: false,
                error: "",
                regresar: true
            }

        case VALUE_MENU_ETAPA_TITULO: {
            return { ...state, titulo: action.payload }
        }
        case VALUE_MENU_ETAPA_DESCRIPCION: {
            return { ...state, descripcion: action.payload }
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
                titulo: "",
                descripcion: "",
            }
        default:
            return state;
    }
}