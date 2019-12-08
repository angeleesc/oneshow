import {
  END_RUNNING_SHOW,
  SET_CURRENT_SCENE,
  END_CURRENT_SCENE,
  UPDATE_CURRENT_LOOP,
  END_CURRENT_SCENE_TIME,
  ADD_SCENES,
  REMOVE_SCENE,
  EXECUTE_SCENE,
  READY_TO_EXECUTE_NEXT_SCENE
} from '../../actions/show/types';

const initialState = {
  color: {
    icon: 'palette',
    color: '#4b7bec',
    current: null,
  },
  flash: {
    icon: 'bolt',
    color: '#eb3b5a',
    current: null,
  },
  audio: {
    icon: 'volume-up',
    color: '#2bcbba',
    current: null,
  },
  video: {
    icon: 'video',
    color: '#fed330',
    current: null,
  },
  image: {
    icon: 'image',
    color: '#a55eea',
    current: null,
  },
  scenes: {
    selected: null,
    items: [],
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_SCENE:
      return {
        ...state,
        [action.payload.scene]: {
          ...state[action.payload.scene],
          current: action.payload.current
        }
      }
    case END_CURRENT_SCENE:
      return {
        ...state,
        [action.payload.scene]: null,
      }
    case END_CURRENT_SCENE_TIME:
      return {
        ...state,
        [action.payload.scene]: {
          ...state[action.payload.scene],
          current: {
            ...state[action.payload.scene].current,
            time: 0,
          }
        }
      }
    case UPDATE_CURRENT_LOOP: 
      return {
        ...state,
        [action.payload.scene]: {
          ...state[action.payload.scene],
          current: {
            ...state[action.payload.scene].current,
            loop: action.payload.loop,
          }
        }
      };
    case END_RUNNING_SHOW:
      return {
        ...state,
        [action.payload.scene]: {
          ...state[action.payload.scene],
          current: null,
        },
      };
    case ADD_SCENES:
      return {
        ...state,
        scenes: {
          ...state.scenes,
          items: [
            ...state.scenes.items,
            ...action.payload.scenes,
          ]
        }
      };
    case EXECUTE_SCENE:
      return {
        ...state,
        scenes: {
          ...state.scenes,
          selected: action.payload.sceneId,
        }
      }
    case REMOVE_SCENE:
      return {
        ...state,
        scenes: {
          selected: state.scenes.selected,
          items: state.scenes.items.filter(item => item._id !== action.payload.sceneId)
        }
      }
    case READY_TO_EXECUTE_NEXT_SCENE:
      return {
        ...state,
        scenes: {
          ...state.scenes,
          selected: null,
        }
      }
    default:
      return state;
  }
}