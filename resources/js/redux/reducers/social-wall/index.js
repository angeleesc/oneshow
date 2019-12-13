import { 
  FETCHED_SOCIAL_COMPANIES,
  FETCHED_SOCIAL_EVENTS,
  FETCHED_SOCIAL_EVENT_HASHTAGS,
  FLUSH_SOCIAl_SELECTION,
  SET_SOCIAL_COMPANY,
  SET_SOCIAL_EVENT,
} from './../../actions/social-wall/types';

const initialState = {
  companyId: '',
  eventId: '',
  companies: [],
  events: [],
  hashtags: {
    twitter: [],
    instagram: [],
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCHED_SOCIAL_COMPANIES:
      return {
        ...state,
        companies: action.payload.companies.map(mapCompanyFromDbToStore),
      };
    case FETCHED_SOCIAL_EVENTS: 
      return {
        ...state,
        events: action.payload.events.map(mapEventFromDbToStore),
      };
    case SET_SOCIAL_COMPANY:
      return {
        ...state,
        companyId: action.payload.companyId,
      };
    case SET_SOCIAL_EVENT:
      return {
        ...state,
        eventId: action.payload.eventId,
      };
    default:
      return state;
  }
}

function mapCompanyFromDbToStore (company) {
  return {
    id: company._id,
    name: company.Nombre,
    email: company.Correo,
    phone: company.Telefono,
    countryId: company.Pais_id,
    active: company.Activo,
  }
}

function mapEventFromDbToStore (event) {
  return {
    id: event._id,
    name: event.Nombre,
    date: event.Fecha,
    time: event.Hora,
    companyId: event.Empresa_id,
    countryId: event.Pais_id,
  };
}