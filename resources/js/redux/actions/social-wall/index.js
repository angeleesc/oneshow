import { 
  FETCHED_SOCIAL_COMPANIES,
  FETCHED_SOCIAL_EVENTS,
  FETCHED_SOCIAL_EVENT_HASHTAGS,
  SET_SOCIAL_COMPANY,
  SET_SOCIAL_EVENT,
  FLUSH_SOCIAl_SELECTION,
} from './types';
import axios from 'axios';

export function getCompanies () {
  return (dispatch, getState) => {
    const { auth: { apiToken } } = getState();

    return axios.get('api/empresas', {
      headers: {
        Authorization: apiToken
      }
    })
    .then(res => {
      const { data } = res;

      return dispatch(saveCompanies(data.empresas));      
    })
  }
}

export function getEventsFromCompany (companyId) {
  return (dispatch, getState) => {
    const { auth: { apiToken }} = getState();
    
    return axios.get(`api/empresas/eventos/${companyId}`, {
      headers: {
        Authorization: apiToken
      }
    })
    .then(res => dispatch(saveEventos(res.data)))
  }
}

export function getEventHashtags (companyId, eventId) {
  return (dispatch, getState) => {
    const { auth: { apiToken }} = getState();
    
    return axios.get(`api/eventos/redes-sociales/consultar?eventoId=${eventId}`, {
      headers: {
        Authorization: apiToken
      }
    })
    .then(res => {
      
    })
  }
}

export function setCompany (companyId) {
  return {
    type: SET_SOCIAL_COMPANY,
    payload: { companyId }
  };
}

export function setEvent (eventId) {
  return {
    type: SET_SOCIAL_EVENT,
    payload: { eventId },
  };
}

export function fetchedEventHashtags () {

}

export function loadingSocialWall () {

}

export function saveCompanies (companies) {
  return {
    type: FETCHED_SOCIAL_COMPANIES,
    payload: { companies }
  };
}

export function saveEvents (events) {
  return {
    type: FETCHED_SOCIAL_EVENTS,
    payload: { events }
  };
}