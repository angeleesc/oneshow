import { 
  GET_SOCIAL_EVENT_HASHTAGS,
  DELETE_SOCIAL_EVENT_HASHTAGS,
} from './../../actions/social-wall/types';

const initialState = {
  hashtags: {
    twitter: [],
    instagram: [],
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SOCIAL_EVENT_HASHTAGS:
      return {
        ...state,
        hashtags: {
          twitter: action.payload.twitter,
          instagram: action.payload.instagram,
        },
      };
    case DELETE_SOCIAL_EVENT_HASHTAGS: 
      return {
        ...state,
        hashtags: {
          twitter: [],
          instagram: [],
        }
      };
    default:
      return state;
  }
}