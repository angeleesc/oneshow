import {
  TRAER_TODAS,
  AGREGAR_PLANTILLA_EVENTO,
  CARGANDO,
  ERROR
} from '../../actions/plantillas/types'

const INITIAL_STATE = {
  plantillas: [],
  cargando: false,
  error: "",
  regresar: false

};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case TRAER_TODAS:
      return {
        ...state,
        plantillas: action.payload,
        regresar: false
      }

    case AGREGAR_PLANTILLA_EVENTO:
      return {
        ...state,
        cargando: false,
        error: "",
        regresar: true
      }

    case CARGANDO:
      return { ...state, cargando: true }

    case ERROR:
      return {...state, error: action.payload, cargando: false}
      
    default:
      return state;
  }
}

