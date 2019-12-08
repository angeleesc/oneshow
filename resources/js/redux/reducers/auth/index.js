import { 
  SET_USER_SCOPE,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
} from './../../actions/auth/types';

const storedState = JSON.parse(localStorage.getItem('auth'));

const initialState = storedState ? storedState : {
  user: null,
  scope: null,
  scopeName: '',
  isAuthenticated: false, 
  apiToken: '',
};

export default function (state = initialState, action) {
  let nextState = state;
  
  switch (action.type) {
    case USER_LOGGED_IN: 
      nextState = {
        ...state,
        isAuthenticated: true,
        user: mapUserFromDbToStore(action.payload.user),
        apiToken: action.payload.apiToken, 
      }; break;
    case USER_LOGGED_OUT:
      nextState = {
        user: null,
        scope: null,
        scopeName: '',
        isAuthenticated: false, 
        apiToken: '',
      }; break;
    case SET_USER_SCOPE:
      nextState = {
        ...state,
        scope: action.payload.scope,
        scopeName: action.payload.scopeName
      }; break;
    default:
      nextState = state; 
      break;
  }

  localStorage.setItem('auth', JSON.stringify(nextState));

  return nextState;
}

function mapUserFromDbToStore (user) {
  return {
    id: user._id,
    name: user.Nombre,
    lastname: user.Apellido,
    email: user.Correo,
    roleId: user.Rol_id,
    countryId: user.Pais_id,
    companyId: user.Empresa_id,
    active: true,
  }
}