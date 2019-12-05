import {
  FETCHED_MEDIA_EVENTS,
  FETCHED_COMPANIES,
  FETCHED_MEDIA_SECTOR,
  FETCHED_MEDIA_JOBS,
  CREATE_NEW_JOB,
  REMOVE_JOB,
  SET_COMPANY,
  SET_EVENT,
  FETCHED_MEDIA_TOOLS
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

export function getEventos (userId, apiToken) {
  return dispatch => {
    return axios.get(`/api/eventos/usuario/${userId}`, {
      headers: {
          Authorization: apiToken
      }
    }).then(res => {
      const { data } = res.data;
      
      localStorage.setItem("eventosUsuario", JSON.stringify(data));
      
      dispatch(saveEventos(data.eventos));
      dispatch(saveSectores(data.sectores));
    });
  }
}

export function getJobs (eventId) {
  return (dispatch, getState) => {
    const { auth: { apiToken }} = getState();
    
    return axios.post("/api/eventos/envios", { evento: eventId }, {
        headers: {
            Authorization: apiToken
        }
      })
      .then(res => {
        const { code, envios } = res.data;

        const jobs = envios.map(envio => ({
          id: envio._id,
          type: envio.Tipo,
          status: envio.Estado,
          startTime: envio.Inicio,
          endTime: envio.Fin,
          payload: envio.Parametro,
          eventId: envio.Evento,
        }));

        dispatch(saveJobs(jobs));
        
        return code;
      });
  }
}

export function createJob (job, apiToken) {
  return dispatch => {
    return axios.post('/api/eventos/cola/add', { 
      evento: job.eventId, 
      title: job.type,
      estado: job.status,
      inicio: job.startTime,
      fin: job.endTime,
      parametro: job.payload,
    } , {
      headers: {
          Authorization: apiToken
      }
    })
    .then(res => {
      if (res.data.code === 200) {
        const { envio } = res.data;

        dispatch(addJob({
          id: envio._id,
          type: envio.Tipo,
          status: envio.Estado,
          startTime: envio.Inicio,
          endTime: envio.Fin,
          payload: envio.Parametro,
          eventId: envio.Evento,
        }));

        return envio._id;

      } else if (res.data.code === 500) {
        return Promise.reject([]);
      }
    });
  }
}

export function deleteJob (jobId) {
  return dispatch => {
    return axios.post('/api/eventos/remove-envios', { id : jobId } ,{
      headers: {
          Authorization: localStorage.getItem("api_token")
      }
    })
    .then(res => {
      if (res.data.code !== 200)
        return Promise.reject({});
        
      dispatch(removeJob(jobId));

      return jobId;
    });
  }
}

export function getTool (eventId, herramienta) {
  return (dispatch, getState) => {
    const { auth } = getState();

    return axios.post('/api/multimedia/action-tool', { 
      evento: eventId, 
      herramienta
    } , {
      headers: {
          Authorization: localStorage.getItem("api_token")
      }
    })
    .then(res => {
      const { code, tool, biblioteca, msj } = res.data;

      if(code === 200){
        
        let payload = {
          isTool: true,
          titleTool: herramienta,
          bibliotecas: (tool == 'Video' || tool == 'Imagen' || tool == 'Audio') ? biblioteca : []
        };

        dispatch(saveTool(payload));
          
      } else {
        dispatch(saveTool({ isTool: false, titleTool: '' }));
      }

      return { code, msj };
    }, err => dispatch(saveTool({ isTool: false, titleTool: '' })));
  }
}

export function saveEventos (eventos) {
  return {
    type: FETCHED_MEDIA_EVENTS,
    payload: eventos,
  };
}

export function saveCompanies (companies) {
  return {
    type: FETCHED_COMPANIES,
    payload: { companies }
  }
}

export function saveSectores (sectores) {
  return {
    type: FETCHED_MEDIA_SECTOR,
    payload: sectores
  };
}

export function addJob (job) {
  return {
    type: CREATE_NEW_JOB,
    payload: job
  }
}

export function removeJob (id) {
  return {
    type: REMOVE_JOB,
    payload: { id }
  }
}

export function saveJobs (jobs) {
  return {
    type: FETCHED_MEDIA_JOBS,
    payload: jobs
  };
}

export function saveTool (tools) {
  return {
    type: FETCHED_MEDIA_TOOLS,
    payload: tools
  }
}

export function setCompany (companyId) {
  return {
    type: SET_COMPANY,
    payload: { companyId }
  };
}

export function setEvent (eventId) {
  return {
    type: SET_EVENT,
    payload: { eventId }
  };
}