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

export function doesPostNeedModeration (text, imageURL) {
  return (dispatch, getState) => {
    return axios.post(`${process.env.MIX_CONTENT_MODERATOR_BASE_URL}/ProcessText/Screen?language=spa&classify=true`, text,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Ocp-Apim-Subscription-Key': process.env.MIX_CONTENT_MODERATOR_SUB_KEY
      }
    })
    .then(res => {
      if (res.data.Terms) {
        return Promise.resolve({ moderation: true });
      } else {
        if (!imageURL) {
          return Promise.resolve({ moderation: false});
        }

        return axios.post(`${process.env.MIX_CONTENT_MODERATOR_BASE_URL}/ProcessImage/Evaluate`, {
          DataRepresentation: 'URL',
          Value: imageURL
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.MIX_CONTENT_MODERATOR_SUB_KEY,
          }
        })
        .then(res => {
          if (res.data.IsImageAdultClassified || res.data.IsImageRacyClassified) {
            return Promise.resolve({ moderation: true });
          } else {
            return Promise.resolve({ moderation: false });
          }
        });
      }
    });
  }
}

export function doesTextNeedModeration (text) {
  return (dispatch, getState) => {
    return axios.post(`${process.env.MIX_CONTENT_MODERATOR_BASE_URL}/ProcessText/Screen?language=spa&classify=true`, text,
      {
        headers: {
          'Content-Type': 'text/plain',
          'Ocp-Apim-Subscription-Key': process.env.MIX_CONTENT_MODERATOR_SUB_KEY
        }
      });
  };
}

export function doesImageNeedModeration (imageURL) {
  return (dispatch, getState) => {
    return axios.post(`${process.env.MIX_CONTENT_MODERATOR_BASE_URL}/ProcessImage/Evaluate`,{
      DataRepresentation: 'URL',
      Value: imageURL
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.MIX_CONTENT_MODERATOR_SUB_KEY,
      }
    });
  };
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