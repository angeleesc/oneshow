import { 
  SET_USER_SCOPE,
  USER_LOGGED_IN,
  USER_LOGGED_OUT
} from './types';
import axios from 'axios';

export function authenticate (email, password) {
  return dispatch => {
    return axios.post('api/login', { correo: email, password })
      .then(res => {
        const { data } = res;

        if (data.code !== 200)
          return Promise.reject({ code: data.code, message: data.msj });

        dispatch(userLoggedIn(data.api_token, data.usuario));

        return data;
      });
  }
}

export function logout () {
  return (dispatch, getState) => {
    const { auth: { apiToken } } = getState();

    return axios.post('api/logout', {}, {
      headers: {
        Authorization: apiToken
      }
    })
  }
}

export function getUserScope () {
  return (dispatch, getState) => {
    const { auth: { apiToken, user } } = getState();

    return axios.get(`api/usuarios/permisos/${user.roleId}`, {
      headers: {
        Authorization: apiToken
      }
    })
    .then(res => {
      const { Nombre, Permisos } = res.data.data;
      
      dispatch(setUserScope(Nombre, Permisos));

      return { Nombre, Permisos };
    });
  }
}

export const setUserScope = (scopeName, scope) => ({
  type: SET_USER_SCOPE,
  payload: { scopeName, scope }
});

export function userLoggedIn (apiToken, user) {
  return {
    type: USER_LOGGED_IN,
    payload: { apiToken, user }
  };
}

export function userLoggedOut () {
  return {
    type: USER_LOGGED_OUT
  }
}