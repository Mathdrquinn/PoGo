import { applyMiddleware, createStore, compose } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';

const middleware = [logger(), thunk, promise()];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const middleWare = applyMiddleware(logger(), thunk, promise())

const store = createStore(reducer, {}, composeEnhancers(
    applyMiddleware(...middleware)
));

export default store;
