import { 
    MOSTRAR_ELEMENTO_CARGA,
    OCULTAR_ELEMENTO_CARGA
} from './types';
  
export function mostrarElementoDeCarga () {
    return {
      type: MOSTRAR_ELEMENTO_CARGA
    };
}
  
export function ocultarElementoDeCarga () {
    return {
      type: OCULTAR_ELEMENTO_CARGA
    };
}