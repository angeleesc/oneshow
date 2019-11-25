import { 
  END_RUNNING_SHOW,
  SET_CURRENT_SCENE,
  END_CURRENT_SCENE,
  END_CURRENT_SCENE_TIME,
  UPDATE_CURRENT_LOOP,
  ADD_SCENES,
  REMOVE_SCENE,
  EXECUTE_SCENE,
  READY_TO_EXECUTE_NEXT_SCENE,
} from './types';
import axios from 'axios';

export function getFilesFromEvent (type) {
  return (_, getState) => {
    const { multimedia: { companyId, eventId }, auth: { apiToken } } = getState();

    return axios.get(`api/empresas/${companyId}/event/${eventId}/files/${type}`, {
      headers: {
        Authorization: apiToken
      }
    })
    .then(res => {
      console.log(res.data);
      
      return res.data;
    })
  }
}

export function createScene (scene) {
  return (dispatch, getState) => {
    const { multimedia: { eventId }, auth: { apiToken } } = getState();

    return axios.post(`api/event/${eventId}/scene`, scene, {
      headers: {
        Authorization: apiToken
      }
    })
    .then(res => {
      const sceneData = res.data;

      dispatch(addScenes([sceneData]));

      return sceneData;
    });
  }
} 

export function getScenesFromShow () {
  return (dispatch, getState) => {
    const { multimedia: { eventId }, auth: { apiToken } } = getState();

    return axios.get(`api/event/${eventId}/scenes`, {
      headers: {
        Authorization: apiToken
      }
    })
    .then(res => {
      const scenes = res.data;

      dispatch(addScenes(scenes));

      return scenes;
    });
  }
}

export function deleteScene (sceneId) {
  return (dispatch, getState) => {
    const { multimedia: { eventId }, auth: { apiToken } } = getState();

    return axios.delete(`api/event/${eventId}/scene/${sceneId}`, {
      headers: {
        Authorization: apiToken
      }
    })
    .then(res => dispatch(removeScene(sceneId)))
  }
}

export function endRunningShow (scene) {
  return {
    type: END_RUNNING_SHOW,
    payload: { scene }
  };
}

export function setCurrentScene (scene, current) {
  return {
    type: SET_CURRENT_SCENE,
    payload: { scene, current }
  };
}

export function endCurrentScene (scene) {
  return {
    type: END_CURRENT_SCENE,
    payload: { scene }
  }
}

export function endCurrentSceneTime (scene) {
  return {
    type: END_CURRENT_SCENE_TIME,
    payload: { scene },
  };
}

export function updateCurrentLoop (scene, loop) {
  return {
    type: UPDATE_CURRENT_LOOP,
    payload: { scene, loop }
  };
}

export function executeScene (sceneId) {
  return {
    type: EXECUTE_SCENE,
    payload: { sceneId }
  }
}

export function addScenes (scenes) {
  return {
    type: ADD_SCENES,
    payload: { scenes }
  }
}

export function removeScene (sceneId) {
  return {
    type: REMOVE_SCENE,
    payload: { sceneId }
  }
}

export function executionDone () {
  return {
    type: READY_TO_EXECUTE_NEXT_SCENE,
    payload: {},
  }
}