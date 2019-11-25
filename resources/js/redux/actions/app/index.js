import {
  TOGGLE_SIDEBAR,
  TOGGLE_FULLSCREEN,
  SET_FULLSCREEN_STATE
} from './types';

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