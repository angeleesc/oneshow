import { 
  TOGGLE_FULLSCREEN,
  SET_FULLSCREEN_STATE
} from './../../actions/app/types';

const initialState = {
  fullscreen: false
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
    default:
      return state;
  }
}