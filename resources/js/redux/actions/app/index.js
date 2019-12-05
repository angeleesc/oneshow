import {
  TOGGLE_SIDEBAR,
  TOGGLE_FULLSCREEN,
  SET_FULLSCREEN_STATE,
  SET_TIMESTAMP_DIFF
} from './types';
import axios from 'axios';

export function getTimestampDiff () {
  return (dispatch, getState) => {
    const { auth: { apiToken } } = getState();
    
    const now = Date.now();

    return axios.get('/api/server/time', {
      headers: {
        Authorization: apiToken,
      }
    }).then(res => {
      const { time } = res.data;

      const diff = (time * 1000) - now;
      
      dispatch(setTimestampDiff(diff));

      return diff;
    })
  }
}

export function toggleSidebar () {
  return {
    type: TOGGLE_SIDEBAR
  }
}

export function toggleFullscreen () {
  return {
    type: TOGGLE_FULLSCREEN
  }
};

export function setFullscreenState (state) {
  return {
    type: SET_FULLSCREEN_STATE,
    payload: { state }
  }
};

export function setTimestampDiff (diff) {
  return {
    type: SET_TIMESTAMP_DIFF,
    payload: { diff }
  };
}