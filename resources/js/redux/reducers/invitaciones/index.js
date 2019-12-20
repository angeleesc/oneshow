import {
    TRAER_INVITACIONES,
    GAURDAR_IMVITACION,
    CARGANDO,
    CARGANDO_GUARDAR,
    VALUE_IMG_INVITACION,
    VALUE_PDF_INVITACION,
    VALUE_TIPO_INVITACION,
    VALUE_PLANTILLA_PDF_INVITACION,
    ERROR,
    LIMPIAR_FORM
} from '../../actions/invitaciones/types'


const INITIAL_STATE = {
    invitaciones: [],
    Tipo: "",
    SizeImagen: "",
    SizePdf: "",
    Activo: "",
    PlantillaId: "",
    inputImagen: "",
    inputTipo: "",
    inputPdf: "",
    inputPlantillaPdf: "",
    regresar: false,
    cargando: false,
    cargando_guardar: false
}


export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case TRAER_INVITACIONES:
            return {
                ...state,
                invitaciones: action.payload,
                cargando: false,
                regresar: false,
                error: "",
                cargando_guardar: false,                
            }

        case GAURDAR_IMVITACION:
            return { ...state, cargando_guardar: false, error: "", regresar: true }

        case VALUE_IMG_INVITACION:
            return { ...state, inputImagen: action.payload }

        case VALUE_PDF_INVITACION:
            return { ...state, inputPdf: action.payload }

        case VALUE_TIPO_INVITACION:
            return { ...state, inputTipo: action.payload }

        case VALUE_PLANTILLA_PDF_INVITACION:
            return { ...state, inputPlantillaPdf: action.payload }

        case CARGANDO:
            return { ...state, cargando: true }

        case CARGANDO_GUARDAR:
            return { ...state, cargando_guardar: true }
        case ERROR:
            return { ...state, error: action.payload, cargando: false, regresar: false, cargando_guardar: false }

        case LIMPIAR_FORM:
            return {
                ...state,
                inputTipo: "",
                inputImagen: "",
                inputPdf: "",
                inputPlantillaPdf: "",
            }
        default:
            return state;
    }
}