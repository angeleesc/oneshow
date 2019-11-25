import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

const middleware = [thunkMiddleware];
const initialState = {};

const store = createStore(
  reducers, 
  initialState,
  composeWithDevTools(
    applyMiddleware(...middleware)  
  )
);

export default store;