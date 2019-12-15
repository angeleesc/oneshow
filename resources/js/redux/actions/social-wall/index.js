import { 
  GET_SOCIAL_EVENT_HASHTAGS,
  DELETE_SOCIAL_EVENT_HASHTAGS
} from './types';
import axios from 'axios';


export function getEventHashtags (eventId) {
  return (dispatch, getState) => {
    const { auth: { apiToken } } = getState();
    
    return axios.get(`api/event/${eventId}/social/hashtags`, {
      headers: {
        Authorization: apiToken,
      }
    })
    .then(res => {
      const { hashtagsTwitter, hashtagsInstagram } = res.data;

      dispatch(saveHashtags(hashtagsTwitter, hashtagsInstagram));

      return res.data;
    })
  }
}

export function updateEventHashtags (eventId, twitter, instagram) {
  return (dispatch, getState) => {
    const { auth: { apiToken }} = getState();

    return axios.put(`api/event/${eventId}/social/hashtags`, {
      twitter, 
      instagram
    }, {
      headers: { Authorization: apiToken }
    });
  }
}

export function saveHashtags (twitter, instagram) {
  return {
    type: GET_SOCIAL_EVENT_HASHTAGS,
    payload: { 
      twitter, 
      instagram 
    }
  };
}

export function cleanHashtags () {
  return {
    type: DELETE_SOCIAL_EVENT_HASHTAGS,
  };
}