import {
  TRAER_REGALOS,
  AGREGAR_REGALOS_EVENTO,
  VALUE_BANCO,
  VALUE_CUIL,
  VALUE_CBU,
  VALUE_PATH_IMG,
  VALUE_OBJETO,
  VALUE_SKU,
  VALUE_TIENDA,
  VALUE_LINK,
  TIPO_REGALO,
  VALUE_TIPO_DINERO_REGALO,
  CARGANDO,
  ERROR,
  LIMPIAR_FORM,
  CARGANDO_GUARDAR
} from '../../actions/regalos/types'

const INITIAL_STATE = {
  regalos: [],
  tipoRegalo: "",
  OpcionDinero: "",
  Banco: "",
  CUIL: "",
  CBU: "",
  PathImg: "",
  Objeto: "",
  SKU: "",
  TiendaSugerida: "",
  Adquirido: "",
  Link: "",
  cargando: false,
  cargando_guardar: false,
  error: "",
  regresar: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case TRAER_REGALOS:
      return {
        ...state,
        regalos: action.payload,
        cargando: false,
        cargando_guardar: false,
        regresar: false,
      }

    case AGREGAR_REGALOS_EVENTO:
      return {
        ...state,
        tipoRegalo: "",
        OpcionDinero: "",
        Banco: "",
        CUIL: "",
        CBU: "",
        PathImg: "",
        SKU: "",
        Objeto: "",
        TiendaSugerida: "",
        Adquirido: "",
        Link: "",
        cargando: false,
        cargando_guardar: false,
        error: "",
        regresar: true
      }

    case TIPO_REGALO: {
      return { ...state, tipoRegalo: action.payload }
    }
    case VALUE_BANCO: {
      return { ...state, Banco: action.payload, error: "" }
    }
    case VALUE_CUIL: {
      return { ...state, CUIL: action.payload, error: "" }
    }
    case VALUE_CBU: {
      return { ...state, CBU: action.payload, error: "" }
    }
    case VALUE_PATH_IMG: {
      return { ...state, PathImg: action.payload, error: "" }
    }
    case VALUE_OBJETO: {
      return { ...state, Objeto: action.payload, error: "" }
    }
    case VALUE_SKU: {
      return { ...state, SKU: action.payload, error: "" }
    }
    case VALUE_TIENDA: {
      return { ...state, TiendaSugerida: action.payload, error: "" }
    }
    case VALUE_LINK: {
      return { ...state, Link: action.payload, error: "" }
    }
    case VALUE_TIPO_DINERO_REGALO: {
      return { ...state, OpcionDinero: action.payload, error: "" }
    }
    case CARGANDO:
      return { ...state, cargando: true }

    case CARGANDO_GUARDAR:
      return { ...state, cargando_guardar: true }
    case ERROR:
      return { ...state, error: action.payload, cargando: false, regresar: false }

    case LIMPIAR_FORM:
      return {
        ...state,
        tipoRegalo: "",
        OpcionDinero: "",
        Banco: "",
        CUIL: "",
        CBU: "",
        PathImg: "",
        SKU: "",
        Objeto: "",
        TiendaSugerida: "",
        Adquirido: "",
        Link: "",
      }
    default:
      return state;
  }
}

