import { 
  DISPLAY_ALERT_MESSAGE,
  HIDE_ALERT
} from './../../actions/alert/types';

const initialState = {
  show: false,
  type: '',
  title: '',
  text: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case DISPLAY_ALERT_MESSAGE:
      return {
        ...state,
        show: true,
        type: action.payload.type,
        title: action.payload.title,
        text: action.payload.text,
      };
    case HIDE_ALERT:
      return {
        ...state,
        show: false,
        type: '',
        title: '',
        text: '',
      };
    default:
      return state;
  }
}