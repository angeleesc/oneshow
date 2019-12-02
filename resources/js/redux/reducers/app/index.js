import { 
  TOGGLE_SIDEBAR,
  TOGGLE_FULLSCREEN,
  SET_FULLSCREEN_STATE,
  SET_TIMESTAMP_DIFF
} from './../../actions/app/types';

const initialState = {
  fullscreen: false,
  isSidebarOpen: true,
  timeOffset: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FULLSCREEN:
      return {
        ...state,
        fullscreen: !state.fullscreen
      };
    case SET_FULLSCREEN_STATE: 
      return {
        ...state,
        fullscreen: action.payload.state
      }
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen
      }
    case SET_TIMESTAMP_DIFF: 
      return {
        ...state,
        timeOffset: action.payload.diff
      };
    default:
      return state;
  }
}