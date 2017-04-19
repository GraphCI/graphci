import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import runs from './reducers/runs';

const rootReducer = combineReducers({
  runs,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
