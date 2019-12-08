import {
    TRAER_EMPRESAS,
    CARGANDO,
    ERROR
  } from '../../actions/empresas/types'
  
  const INITIAL_STATE = {
    empresas: [],
    cargando: false,
    error: "",
  
  };
  
  export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
      case TRAER_EMPRESAS:
        return {
          ...state,
          empresas: action.payload,
          cargando: false
        }
  
      case CARGANDO:
        return { ...state, cargando: true }
  
      case ERROR:
        return {...state, error: action.payload, cargando: false}
        
      default:
        return state;
    }
  }
  
  