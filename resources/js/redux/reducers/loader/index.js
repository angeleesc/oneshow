import { 
    MOSTRAR_ELEMENTO_CARGA,
    OCULTAR_ELEMENTO_CARGA
} from './../../actions/loader/types';
  
const initialState = {
    mostrar: false
};
  
export default function (state = initialState, action) {
    switch (action.type) {
      case MOSTRAR_ELEMENTO_CARGA:
        return {
          ...state,
          mostrar: true
        };
      case OCULTAR_ELEMENTO_CARGA:
        return {
          ...state,
          mostrar: false
        };
      default:
        return state;
    }
}