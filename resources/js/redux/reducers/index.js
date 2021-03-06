import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import multimedia from './multimedia';
import show from './show';
import alert from './alert';
import loader from './loader';
import plantillas from './plantillas'
import empresas from './empresas'
import invitaciones from './invitaciones'
import eventos from './eventos'
import regalos from './regalos'
import social from './social-wall';
import etapas from './etapas'
import menuEtapas from './menuEtapas'
import invitados from './invitados'
export default combineReducers({
  app,
  auth,
  show,
  alert,
  multimedia,
  loader,
  plantillas,
  empresas,
  invitaciones,
  etapas,
  menuEtapas,
  eventos,
  social,
  regalos,
  invitados
});
