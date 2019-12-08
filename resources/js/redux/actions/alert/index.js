import { 
  DISPLAY_ALERT_MESSAGE,
  HIDE_ALERT
} from './types';

export function displayAlertMessage (title, text, type = 'info') {
  return {
    type: DISPLAY_ALERT_MESSAGE,
    payload: { title, text, type }
  }
}

export function hideAlert () {
  return {
    type: HIDE_ALERT
  };
}