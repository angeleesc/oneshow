import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import multimedia from './multimedia';
import show from './show';
import alert from './alert';
import loader from './loader';

export default combineReducers({
  app,
  auth,
  show,
  alert,
  multimedia,
  loader
});
